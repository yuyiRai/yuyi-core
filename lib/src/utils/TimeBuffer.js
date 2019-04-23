"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const EventEmitter_1 = __importDefault(require("@/utils/EventEmitter"));
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const vue_1 = __importDefault(require("vue"));
const Utils_1 = require("./Utils");
// import rx from 'rxjs'
// import * as rx2 from 'rxjs/operators';
// window.rx = rx;
// window.rx2 = rx2;
exports.testGroup = {
    shareTest(...data) {
        var emitter = Utils_1.Utils.getEventEmitter();
        var line = rxjs_1.from(emitter).pipe(operators_1.distinctUntilChanged((x, b) => Utils_1.Utils.isEqual(x, b)), operators_1.switchMap((item) => {
            return rxjs_1.merge(rxjs_1.of(item), rxjs_1.of(item)).pipe(bufferTime(100), operators_1.tap(console.log));
        }), operators_1.shareReplay());
        line.subscribe(console.log.bind(this, 1));
        lodash_1.forEach(data, data => emitter.emit(data));
        line.subscribe(console.log.bind(this, 2));
        line.subscribe(console.log.bind(this, 3));
    }
};
const timeBufferFactory = {
    deepDiff: operators_1.distinctUntilChanged((item, i) => lodash_1.isEqual(item, i)),
    diff: operators_1.distinctUntilChanged((item, i) => item == i)
};
/**
 * 创建一个简单的时间缓冲Promise
 * @param { number } time 缓冲时间
 * @param { boolean } isDeepDiff
 * @param { function } callback
 * @param { EventEmitter } emitter
 */
function simpleTimeBuffer(time, isDeepDiff = true, callback, emitter = new EventEmitter_1.default()) {
    const timeInput = Utils_1.Utils.isNumberFilter(time, 500);
    const $emitter = rxjs_1.from(emitter);
    const $source = rxjs_1.of(null).pipe(operators_1.switchMap(() => $emitter), isDeepDiff ? timeBufferFactory.deepDiff : timeBufferFactory.diff, operators_1.bufferWhen(() => $emitter.pipe(operators_1.switchMap(() => rxjs_1.timer(timeInput)))), operators_1.first());
    return ([
        emitter,
        new Promise(function (resolve) {
            const sub = $source.subscribe(function (valueGroup) {
                resolve(valueGroup);
                sub.unsubscribe();
                // console.log(this)
            }, () => { }, () => {
                callback();
            });
        }),
        0
    ]);
}
exports.simpleTimeBuffer = simpleTimeBuffer;
const ___timeBufferList = new Map();
const ___timeBufferValueMap = new WeakMap();
window.___timeBufferList = ___timeBufferList;
window.___timeBufferValueMap = ___timeBufferValueMap;
/**
 *
 * @param {*} key 关键字类型
 * @param {*} value 值
 * @param {function} callback 回调
 * @param {number} time 时间
 * @param {boolean} isDeepDiff
 */
function simpleTimeBufferInput(key, value, callback, time, isDeepDiff) {
    /**
     * @type { [EventEmitter, Promise, number] }
     */
    let config = ___timeBufferList.get(key);
    if (!lodash_1.isArray(config)) {
        // console.log('createtimebuffer', key, callback)
        config = simpleTimeBuffer(time, isDeepDiff, () => {
            ___timeBufferList.delete(key);
        });
        ___timeBufferList.set(key, config);
    }
    else {
        config[2]++;
    }
    // console.log(config)
    let [emitter, pro] = config;
    emitter.emit(value);
    return pro.then(function (value) {
        if (lodash_1.isArray(___timeBufferList.get(key))) {
            ___timeBufferList.set(key, null);
            const finalValue = callback(value);
            ___timeBufferValueMap.set(config, finalValue);
            return finalValue;
        }
        config[2]--;
        const rValue = ___timeBufferValueMap.get(config);
        if (config[2] == 0) {
            ___timeBufferValueMap.delete(config);
        }
        return rValue;
    });
}
exports.simpleTimeBufferInput = simpleTimeBufferInput;
/**
 *
 * @param {function} callback 回调
 * @param {*} instance
 * @param {number} time 时间
 * @param {boolean} isDeepDiff
 */
function createSimpleTimeBufferInput(callback, instance = this, time, isDeepDiff) {
    // console.log(instance)
    return (value) => simpleTimeBufferInput(instance, value, callback, time, isDeepDiff);
}
exports.createSimpleTimeBufferInput = createSimpleTimeBufferInput;
/**
 *
 * @param { number } time
 */
function timebuffer(time, mode = 'last') {
    return function (target, methodName, descriptor) {
        /**
         * @type {function}
         */
        const func = target[methodName];
        const key = methodName + 'Tmp';
        delete descriptor['value'];
        delete descriptor['writable'];
        descriptor.configurable = false;
        descriptor.get = function () {
            if (!this[key]) {
                this[methodName + 'TmpKey'] = func.bind(this);
                this[key] = (...args) => {
                    // console.log(methodName + 'Tmp', args)
                    return simpleTimeBufferInput(this[methodName + 'TmpKey'], args, (argsList) => {
                        const todoArgs = lodash_1.last(argsList);
                        // console.log(todoArgs, argsList)
                        return this[methodName + 'TmpKey'](...todoArgs);
                    }, time);
                };
            }
            return this[key];
        };
        // console.log(descriptor)
    };
}
exports.timebuffer = timebuffer;
function logger(name, time = false) {
    return function (target, methodName, descriptor) {
        /**
         * @type {function}
         */
        const func = target[methodName];
        if (time) {
            descriptor.value = function (...args) {
                console.time(methodName);
                const r = func.apply(this, args);
                console.log(name, methodName, args, r);
                console.timeEnd(methodName);
                return r;
            };
        }
        else {
            descriptor.value = function (...args) {
                const r = func.apply(this, args);
                console.log(name, methodName, args, r);
                return r;
            };
        }
    };
}
exports.logger = logger;
function $message(config, instance, time) {
    simpleTimeBufferInput(instance, config, (configList) => {
        const config = lodash_1.reduce(configList, (_a, _b) => {
            var { msg } = _a, other = __rest(_a, ["msg"]);
            var { msg: iMsg } = _b, iOther = __rest(_b, ["msg"]);
            return lodash_1.assign(other, iOther, {
                msg: lodash_1.concat(lodash_1.isArray(msg) ? msg : [], iMsg),
                dangerouslyUseHTMLString: true,
            });
        }, {});
        vue_1.default.prototype.$message(Object.assign({}, config, { message: lodash_1.join(Array.from(new Set(config.msg)), '<br />') }));
    }, time || 100);
}
exports.$message = $message;
$message.error = (msg, instance) => {
    return $message({ msg, type: 'error' }, instance);
};
function $notify(config, instance, time, h = (instance || new vue_1.default({})).$createElement) {
    return simpleTimeBufferInput(instance, config, function (configList) {
        const config = lodash_1.reduce(configList, (_a, _b) => {
            var { msg } = _a, other = __rest(_a, ["msg"]);
            var { msg: iMsg } = _b, iOther = __rest(_b, ["msg"]);
            return lodash_1.assign(other, iOther, {
                msg: lodash_1.concat(lodash_1.isArray(msg) ? msg : [], iMsg),
                dangerouslyUseHTMLString: true,
            });
        }, {});
        return Utils_1.Utils.isFunctionFilter(instance && instance.$notify, vue_1.default.prototype.$notify)(Object.assign({}, config, { message: React.createElement("span", null, lodash_1.reduce(Array.from(new Set(config.msg)), (list, vdom) => [...list, list.length > 0 && React.createElement("br", null), Utils_1.Utils.isFunction(vdom) ? vdom() : vdom], [])) }));
    }, time || 100);
}
exports.$notify = $notify;
exports.default = Object.assign({ $notify,
    $message,
    timebuffer,
    logger,
    simpleTimeBuffer,
    simpleTimeBufferInput,
    createSimpleTimeBufferInput }, exports.testGroup);
//# sourceMappingURL=TimeBuffer.js.map