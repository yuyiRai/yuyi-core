var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import forEach from "lodash/forEach";
import isArray from "lodash/isArray";
import isEqual from "lodash/isEqual";
import last from "lodash/last";
import { from } from "rxjs/_esm5/internal/observable/from";
import { merge } from "rxjs/_esm5/internal/observable/merge";
import { MonoTypeOperatorFunction } from "rxjs";
import { of } from "rxjs/_esm5/internal/observable/of";
import { timer } from "rxjs/_esm5/internal/observable/timer";
import { bufferTime } from "rxjs/_esm5/internal/operators/bufferTime";
import { bufferWhen } from "rxjs/_esm5/internal/operators/bufferWhen";
import { distinctUntilChanged } from "rxjs/_esm5/internal/operators/distinctUntilChanged";
import { first } from "rxjs/_esm5/internal/operators/first";
import { shareReplay } from "rxjs/_esm5/internal/operators/shareReplay";
import { switchMap } from "rxjs/_esm5/internal/operators/switchMap";
import { tap } from "rxjs/_esm5/internal/operators/tap";
import { Utils } from '.';
import { EventEmitter } from './EventEmitter';
// import rx from 'rxjs'
// import * as rx2 from 'rxjs/operators';
// window.rx = rx;
// window.rx2 = rx2;
export var testGroup = {
    shareTest: function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var emitter = Utils.getEventEmitter();
        var line = from(emitter).pipe(distinctUntilChanged(function (x, b) { return Utils.isEqual(x, b); }), switchMap(function (item) {
            return merge(of(item), of(item)).pipe(bufferTime(100), tap(console.log));
        }), shareReplay());
        line.subscribe(console.log.bind(this, 1));
        forEach(data, function (data) { return emitter.emit(data); });
        line.subscribe(console.log.bind(this, 2));
        line.subscribe(console.log.bind(this, 3));
    }
};
var timeBufferFactory = {
    deepDiff: distinctUntilChanged(function (item, i) { return isEqual(item, i); }),
    diff: distinctUntilChanged(function (item, i) { return item === i; })
};
/**
 * 创建一个简单的时间缓冲Promise
 * @param { number } time 缓冲时间
 * @param { boolean } isDeepDiff
 * @param { function } callback
 * @param { EventEmitter } emitter
 */
export function simpleTimeBuffer(time, isDeepDiff, callback, emitter) {
    if (isDeepDiff === void 0) { isDeepDiff = true; }
    if (emitter === void 0) { emitter = new EventEmitter(); }
    var timeInput = Utils.isNumberFilter(time, 500);
    var $emitter = from(emitter);
    var diff = (isDeepDiff ? timeBufferFactory.deepDiff : timeBufferFactory.diff);
    var $source = of(null).pipe(switchMap(function () { return $emitter; }), diff, bufferWhen(function () {
        return $emitter.pipe(switchMap(function () { return timer(timeInput); }));
    }), first());
    return ([
        emitter,
        new Promise(function (resolve) {
            var sub = $source.subscribe(function (valueGroup) {
                resolve(valueGroup);
                sub.unsubscribe();
                // console.log(this)
            }, Utils.stubFunction, function () {
                callback();
            });
        }),
        0
    ]);
}
var ___timeBufferList = new Map();
var ___timeBufferValueMap = new WeakMap();
export var BufferCacheGroup = { ___timeBufferList: ___timeBufferList, ___timeBufferValueMap: ___timeBufferValueMap };
/**
 *
 * @param {*} key 关键字类型
 * @param {*} value 值
 * @param {function} callback 回调
 * @param {number} time 时间
 * @param {boolean} isDeepDiff
 */
export function simpleTimeBufferInput(key, value, callback, time, isDeepDiff) {
    if (isDeepDiff === void 0) { isDeepDiff = false; }
    /**
     * @type { [EventEmitter, Promise, number] }
     */
    var config = ___timeBufferList.get(key);
    if (!isArray(config)) {
        // console.log('createtimebuffer', key, callback)
        config = simpleTimeBuffer(time, isDeepDiff, function () {
            ___timeBufferList.delete(key);
        });
        ___timeBufferList.set(key, config);
    }
    else {
        config[2]++;
    }
    if (!Utils.isNil(config)) {
        // console.log(config)
        var _a = __read(config, 2), emitter = _a[0], pro = _a[1];
        emitter.emit(value);
        return pro.then(function (value) {
            if (isArray(___timeBufferList.get(key))) {
                ___timeBufferList.set(key, null);
                var finalValue = callback(value);
                ___timeBufferValueMap.set(config, finalValue);
                return finalValue;
            }
            config[2]--;
            var rValue = ___timeBufferValueMap.get(config);
            if (config[2] == 0) {
                ___timeBufferValueMap.delete(config);
            }
            return rValue;
        });
    }
    return Utils.waitingPromise(0);
}
/**
 *
 * @param {function} callback 回调
 * @param {*} instance
 * @param {number} time 时间
 * @param {boolean} isDeepDiff
 */
export function createSimpleTimeBufferInput(callback, instance, time, isDeepDiff) {
    if (instance === void 0) { instance = window; }
    if (isDeepDiff === void 0) { isDeepDiff = false; }
    // console.log(instance)
    return function (value) {
        return simpleTimeBufferInput(instance, value, callback, time, isDeepDiff);
    };
}
/**
 *
 * @param { number } time
 */
export function timebuffer(time, mode) {
    if (mode === void 0) { mode = 'last'; }
    return function (target, methodName, descriptor) {
        var func = target[methodName];
        var key = methodName + 'Tmp';
        delete descriptor['value'];
        delete descriptor['writable'];
        descriptor.configurable = false;
        descriptor.get = function () {
            var _this = this;
            if (!this[key]) {
                this[methodName + 'TmpKey'] = func.bind(this);
                this[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    // console.log(methodName + 'Tmp', args)
                    return simpleTimeBufferInput(_this[methodName + 'TmpKey'], args, function (argsList) {
                        var todoArgs = last(argsList);
                        // console.log(todoArgs, argsList)
                        return _this[methodName + 'TmpKey'].apply(_this, __spread(todoArgs));
                    }, time);
                };
            }
            return this[key];
        };
        // console.log(descriptor)
    };
}
export function logger(name, time) {
    if (time === void 0) { time = false; }
    return function (target, methodName, descriptor) {
        /**
         * @type {function}
         */
        var func = target[methodName];
        if (time) {
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.time(methodName);
                var r = func.apply(this, args);
                console.log(name, methodName, args, r);
                console.timeEnd(methodName);
                return r;
            };
        }
        else {
            descriptor.value = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var r = func.apply(this, args);
                console.log(name, methodName, args, r);
                return r;
            };
        }
    };
}
export default __assign({ timebuffer: timebuffer,
    logger: logger,
    simpleTimeBuffer: simpleTimeBuffer,
    simpleTimeBufferInput: simpleTimeBufferInput,
    createSimpleTimeBufferInput: createSimpleTimeBufferInput }, testGroup);
//# sourceMappingURL=TimeBuffer.js.map