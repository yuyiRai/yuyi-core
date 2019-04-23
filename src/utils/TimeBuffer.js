/* eslint-disable */
import EventEmitter from '@/utils/EventEmitter';
import { assign, concat, forEach, isArray, isEqual, join, last, reduce } from 'lodash';
import { from, merge, of, timer } from 'rxjs';
import { bufferWhen, distinctUntilChanged, first, shareReplay, switchMap, tap } from 'rxjs/operators';
import Vue from 'vue';
import { Utils } from './Utils';
// import rx from 'rxjs'
// import * as rx2 from 'rxjs/operators';
// window.rx = rx;
// window.rx2 = rx2;
export const testGroup = {
  shareTest(...data) {
    var emitter = Utils.getEventEmitter();
    var line = from(emitter).pipe(distinctUntilChanged((x, b) => Utils.isEqual(x, b)), switchMap((item) => {
      return merge(of(item), of(item)).pipe(bufferTime(100), tap(console.log));
    }), shareReplay());
    line.subscribe(console.log.bind(this, 1));
    forEach(data, data => emitter.emit(data));
    line.subscribe(console.log.bind(this, 2));
    line.subscribe(console.log.bind(this, 3));
  }
};
const timeBufferFactory = {
  deepDiff: distinctUntilChanged((item, i) => isEqual(item, i)),
  diff: distinctUntilChanged((item, i) => item == i)
};
/**
 * 创建一个简单的时间缓冲Promise
 * @param { number } time 缓冲时间
 * @param { boolean } isDeepDiff
 * @param { function } callback
 * @param { EventEmitter } emitter
 */
export function simpleTimeBuffer(time, isDeepDiff = true, callback, emitter = new EventEmitter()) {
  const timeInput = Utils.isNumberFilter(time, 500);
  const $emitter = from(emitter);
  const $source = of(null).pipe(switchMap(() => $emitter), isDeepDiff ? timeBufferFactory.deepDiff : timeBufferFactory.diff, bufferWhen(() => $emitter.pipe(switchMap(() => timer(timeInput)))), first());
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
export function simpleTimeBufferInput(key, value, callback, time, isDeepDiff) {
  /**
   * @type { [EventEmitter, Promise, number] }
   */
  let config = ___timeBufferList.get(key);
  if (!isArray(config)) {
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
    if (isArray(___timeBufferList.get(key))) {
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
/**
 * 
 * @param {function} callback 回调
 * @param {*} instance 
 * @param {number} time 时间
 * @param {boolean} isDeepDiff 
 */
export function createSimpleTimeBufferInput(callback, instance = this, time, isDeepDiff) {
  // console.log(instance)
  return (value) => simpleTimeBufferInput(instance, value, callback, time, isDeepDiff);
}
/**
 *
 * @param { number } time
 */
export function timebuffer(time, mode = 'last') {
  return function (target, methodName, descriptor) {
    /**
     * @type {function}
     */
    const func = target[methodName];
    const key = methodName + 'Tmp'
    delete descriptor['value']
    delete descriptor['writable']
    descriptor.configurable = false
    descriptor.get = function() {
      if(!this[key]) {
        this[methodName + 'TmpKey'] = func.bind(this)
        this[key] = (...args) => {
          // console.log(methodName + 'Tmp', args)
          return simpleTimeBufferInput(this[methodName + 'TmpKey'], args, (argsList) => {
            const todoArgs = last(argsList);
            // console.log(todoArgs, argsList)
            return this[methodName + 'TmpKey'](...todoArgs);
          }, time);
        };
      }
      return this[key]
    }
    // console.log(descriptor)
  };
}

export function logger(name, time = false) {
  return function (target, methodName, descriptor) {
    /**
     * @type {function}
     */
    const func = target[methodName];
    if(time) {
      descriptor.value = function(...args) {
        console.time(methodName)
        const r = func.apply(this, args)
        console.log(name, methodName, args, r)
        console.timeEnd(methodName)
        return r;
      }
    } else {
      descriptor.value = function(...args) {
        const r = func.apply(this, args)
        console.log(name, methodName, args, r)
        return r;
      }
    }
  }
}

export function $message(config, instance, time) {
  simpleTimeBufferInput(instance, config, (configList) => {
    const config = reduce(configList, ({ msg, ...other }, { msg: iMsg, ...iOther }) => {
      return assign(other, iOther, {
        msg: concat(isArray(msg) ? msg : [], iMsg),
        dangerouslyUseHTMLString: true,
      });
    }, {});
    Vue.prototype.$message({ ...config, message: join(Array.from(new Set(config.msg)), '<br />') });
  }, time || 100);
}
$message.error = (msg, instance) => {
  return $message({ msg, type: 'error' }, instance);
};
export function $notify(config, instance, time, h = (instance || new Vue({})).$createElement) {
  return simpleTimeBufferInput(instance, config, function (configList) {
    const config = reduce(configList, ({ msg, ...other }, { msg: iMsg, ...iOther }) => {
      return assign(other, iOther, {
        msg: concat(isArray(msg) ? msg : [], iMsg),
        dangerouslyUseHTMLString: true,
      });
    }, {});
    return Utils.isFunctionFilter(instance && instance.$notify, Vue.prototype.$notify)({
      ...config,
      message: <span>{reduce(Array.from(new Set(config.msg)), (list, vdom) => [...list, list.length > 0 && <br />, Utils.isFunction(vdom) ? vdom() : vdom], [])}</span>
    });
  }, time || 100);
}

export default {
  $notify,
  $message,
  timebuffer,
  logger,
  simpleTimeBuffer,
  simpleTimeBufferInput,
  createSimpleTimeBufferInput,
  ...testGroup
}