"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const EventEmitter_1 = require("./EventEmitter");
const lodash_1 = require("lodash");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const Utils_1 = require("./Utils");
const core_decorators_1 = require("core-decorators");
// import rx from 'rxjs'
// import * as rx2 from 'rxjs/operators';
// window.rx = rx;
// window.rx2 = rx2;
exports.testGroup = {
    shareTest(...data) {
        var emitter = Utils_1.Utils.getEventEmitter();
        var line = rxjs_1.from(emitter).pipe(operators_1.distinctUntilChanged((x, b) => Utils_1.Utils.isEqual(x, b)), operators_1.switchMap((item) => {
            return rxjs_1.merge(rxjs_1.of(item), rxjs_1.of(item)).pipe(operators_1.bufferTime(100), operators_1.tap(console.log));
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
function simpleTimeBuffer(time, isDeepDiff = true, callback, emitter = new EventEmitter_1.EventEmitter()) {
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
function simpleTimeBufferInput(key, value, callback, time, isDeepDiff = false) {
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
    return pro.then((value) => {
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
function createSimpleTimeBufferInput(callback, instance = this, time, isDeepDiff = false) {
    // console.log(instance)
    return function (value) {
        return simpleTimeBufferInput(instance, value, callback, time, isDeepDiff);
    };
}
exports.createSimpleTimeBufferInput = createSimpleTimeBufferInput;
/**
 *
 * @param { number } time
 */
function timebuffer(time, mode = 'last') {
    return function (target, methodName, descriptor) {
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
function $message(config, instance, time = 100) {
    return simpleTimeBufferInput(instance, config, (configList) => {
        const config = lodash_1.reduce(configList, (_a, _b) => {
            var { msg } = _a, other = __rest(_a, ["msg"]);
            var { msg: iMsg } = _b, iOther = __rest(_b, ["msg"]);
            return lodash_1.assign(other, iOther, {
                msg: lodash_1.concat(msg, [iMsg]),
                dangerouslyUseHTMLString: true,
            });
        }, { msg: [] });
        return this.complier(config);
    }, time);
}
exports.$message = $message;
;
$message.error = function (msg, instance, time) {
    return this({ msg, type: 'error' }, instance, time);
};
class MessageBuffer {
    constructor(complier) {
        this.$message = $message.bind(this);
        this.useComplier(complier);
    }
    useComplier(complier) {
        this.$complier = complier;
    }
    $notify(config, instance, time = 100) {
        return simpleTimeBufferInput(instance, config, function (configList) {
            const config = lodash_1.reduce(configList, (_a, _b) => {
                var { msg } = _a, other = __rest(_a, ["msg"]);
                var { msg: iMsg } = _b, iOther = __rest(_b, ["msg"]);
                return lodash_1.assign(other, iOther, {
                    msg: lodash_1.concat(lodash_1.isArray(msg) ? msg : [], iMsg),
                    dangerouslyUseHTMLString: true,
                });
            }, {});
            return this.complier(config);
        }, time || 100);
    }
}
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], MessageBuffer.prototype, "useComplier", null);
exports.MessageBuffer = MessageBuffer;
exports.default = Object.assign({ MessageBuffer,
    timebuffer,
    logger,
    simpleTimeBuffer,
    simpleTimeBufferInput,
    createSimpleTimeBufferInput }, exports.testGroup);
//# sourceMappingURL=TimeBuffer.js.map