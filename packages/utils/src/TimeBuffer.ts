/**
 * @module TimeUtils
 */
import { from, merge, MonoTypeOperatorFunction, of, timer } from 'rxjs';
import { bufferTime, bufferWhen, distinctUntilChanged, first, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Constant$ } from './Constransts';
import { EventEmitter, Observable$$ } from './EventEmitter';
import { forEach, isArray, isEqual, isNil, stubFunction } from './LodashExtra';
import { sleep } from './TestUtils';
import { expect$ } from './TypeLib';
// import rx from 'rxjs'
// import * as rx2 from 'rxjs/operators';
// window.rx = rx;
// window.rx2 = rx2;
var { V, C, W, G } = Constant$.DefPropDec$$


var testGroup: any;
if (__DEV__) {
  testGroup = {
    shareTest(...data: any[]) {
      const emitter = EventEmitter.create();
      const line = from(emitter).pipe(distinctUntilChanged((x, b) => isEqual(x, b)), switchMap((item) => {
        return merge(of(item), of(item)).pipe(bufferTime(100), tap(console.log));
      }), shareReplay());
      line.subscribe(console.log.bind(this, 1));
      forEach(data, data => emitter.emit(data));
      line.subscribe(console.log.bind(this, 2));
      line.subscribe(console.log.bind(this, 3));
    }
  };
}
export { testGroup };

const timeBufferFactory = {
  deepDiff$$: distinctUntilChanged(isEqual),
  diff$$: distinctUntilChanged(Object.is)
};

export type CallbackFunction<V> = (args?: V[]) => void
export type TimeBufferConfig<V> = [EventEmitter<V>, Promise<V[]>, number]
/**
 * 创建一个简单的时间缓冲Promise
 * @param { number } time 缓冲时间
 * @param { boolean } isDeepDiff
 * @param { function } callback
 * @param { EventEmitter } emitter
 */
export function simpleTimeBuffer<V = any>(
  time: number,
  isDeepDiff: boolean = true,
  callback: CallbackFunction<V>,
  emitter: EventEmitter<V> = new EventEmitter<V>()
): TimeBufferConfig<V> {
  var timeInput = expect$.isNumber.filter(time, 500);
  var $emitter = from(emitter);
  var diff: MonoTypeOperatorFunction<V> = (isDeepDiff ? timeBufferFactory.deepDiff$$ as any : timeBufferFactory.diff$$ as any);
  var $source = of(null).pipe(
    switchMap(() => $emitter),
    diff,
    bufferWhen<V>(() =>
      $emitter.pipe(switchMap(() => timer(timeInput)))
    ),
    first()
  );
  return ([
    emitter,
    Constant$.CREATE_PROMISE<V[]>(function (resolve) {
      const sub = Observable$$.subscribe$$($source, function (valueGroup) {
        resolve(valueGroup);
        Observable$$.unsubscribe$$(sub);
        // console.log(this)
      }, stubFunction, () => {
        callback();
      });
    }),
    0
  ]);
}

// tslint:disable-next-line: variable-name
const timeBufferList = new Map<any, TimeBufferConfig<any> | null>();
// tslint:disable-next-line: variable-name
const timeBufferValueMap = new WeakMap<TimeBufferConfig<any>, any>();
// const BufferCacheGroup = { ___timeBufferList, ___timeBufferValueMap };

// if (__DEV__) {
//   export { BufferCacheGroup }
// }

// @ts-ignore
/**
 * 
 * @param key 关键字类型
 * @param value 值
 * @param callback 回调
 * @param time 时间
 * @param isDeepDiff 
 */
export function simpleTimeBufferInput<K extends object, V = any>(
  key: K, value: V, callback: CallbackFunction<V>,
  time: number, isDeepDiff: boolean = false
) {
  /**
   * @type { [EventEmitter, Promise, number] }
   */
  let config: TimeBufferConfig<V> | null = timeBufferList.get(key);
  if (!isArray(config)) {
    // console.log('createtimebuffer', key, callback)
    config = simpleTimeBuffer(time, isDeepDiff, () => {
      timeBufferList.delete(key);
    });
    timeBufferList.set(key, config);
  } else {
    config[2]++;
  }
  if (!isNil(config)) {
    // console.log(config)
    let [emitter, pro] = config;
    emitter.emit(value);
    return pro.then((value) => {
      if (isArray(timeBufferList.get(key))) {
        timeBufferList.set(key, null);
        const finalValue = callback(value);
        timeBufferValueMap.set(config, finalValue);
        return finalValue;
      }
      config[2]--;
      const rValue = timeBufferValueMap.get(config);
      if (config[2] === 0 || isNil(config[2])) {
        timeBufferValueMap.delete(config);
      }
      return rValue;
    });
  }
  return sleep(0)
}
/**
 * 
 * @param callback 回调
 * @param instance 
 * @param time 时间
 * @param isDeepDiff 
 */
export function createSimpleTimeBufferInput<K extends object = Window, V = any>(
  callback: CallbackFunction<V>,
  instance: K = window as any,
  time: number,
  isDeepDiff: boolean = false
) {
  // console.log(instance)
  return function (value: V) {
    return simpleTimeBufferInput<K, V>(instance, value, callback, time, isDeepDiff)
  };
}
/**
 *
 * @param { number } time
 */
export function timebuffer(time: number, mode = 'last') {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    var func: Function = target[methodName];
    var methodKey = Constant$.KEY_PREFIX_INJECT + methodName
    var methodTmpKey = methodKey + '2'
    delete descriptor[V]
    delete descriptor[W]
    Constant$.OBJ_ASSIGN(descriptor, {
      [C]: false,
      [G]: function () {
        var THIS = this;
        if (!THIS[methodKey]) {
          THIS[methodTmpKey] = func.bind(THIS)
          THIS[methodKey] = (...args: any[]) => {
            // console.log(methodName + 'Tmp', args)
            return simpleTimeBufferInput(THIS[methodTmpKey], args, (argsList) => {
              const todoArgs = argsList[argsList.length - 1];
              // console.log(todoArgs, argsList)
              return THIS[methodTmpKey](...todoArgs);
            }, time);
          };
        }
        return THIS[methodKey]
      },
    })
    // console.log(descriptor)
  };
}

export function logger<P extends any = any>(name?: string, time = false) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    if (__DEV__) {
      /**
       * @type {function}
       */
      const func: Function = target[methodName];
      if (time) {
        descriptor.value = function (...args: P[]) {
          console.time(methodName)
          const r = func.apply(this, args)
          console.log(name, methodName, args, r)
          console.timeEnd(methodName)
          return r;
        }
      } else {
        descriptor.value = function (...args: P[]) {
          const r = func.apply(this, args)
          console.log(name, methodName, args, r)
          return r;
        }
      }
    }
  }
}

export default {
  timebuffer,
  logger,
  simpleTimeBuffer,
  simpleTimeBufferInput,
  createSimpleTimeBufferInput,
  ...testGroup
};
