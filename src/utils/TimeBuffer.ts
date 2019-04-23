/* eslint-disable */
import { EventEmitter } from './EventEmitter';
import { assign, concat, forEach, isArray, isEqual, last, reduce } from 'lodash';
import { from, merge, of, timer } from 'rxjs';
import { bufferTime, bufferWhen, distinctUntilChanged, first, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Utils } from './Utils';
import { autobind } from 'core-decorators';
// import rx from 'rxjs'
// import * as rx2 from 'rxjs/operators';
// window.rx = rx;
// window.rx2 = rx2;
export const testGroup = {
  shareTest(...data: any[]) {
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
  const timeInput = Utils.isNumberFilter(time, 500);
  const $emitter = from(emitter);
  const $source = of(null).pipe(
    switchMap(() => $emitter), 
    isDeepDiff ? timeBufferFactory.deepDiff : timeBufferFactory.diff, 
    bufferWhen<V>(() => 
      $emitter.pipe(switchMap(() => timer(timeInput)))
    ), 
    first()
  );
  return ([
    emitter,
    new Promise<V[]>(function (resolve) {
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

declare global {
  export interface Window {
    ___timeBufferList: Map<any, any>;
    ___timeBufferValueMap: WeakMap<any, any>;
  }
}
const ___timeBufferList = new Map<any, TimeBufferConfig<any>>();
const ___timeBufferValueMap = new WeakMap<TimeBufferConfig<any>, any>();
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
export function simpleTimeBufferInput<K extends object, V = any>(
  key: K, value: V, callback: CallbackFunction<V>, 
  time: number, isDeepDiff: boolean = false
) {
  /**
   * @type { [EventEmitter, Promise, number] }
   */
  let config: TimeBufferConfig<V> = ___timeBufferList.get(key);
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
  return pro.then((value) => {
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
export function createSimpleTimeBufferInput<K extends object = Window, V = any>(
  callback: CallbackFunction<V>, 
  instance: K = this, 
  time: number, 
  isDeepDiff: boolean = false
) {
  // console.log(instance)
  return function(value: V) {
    return simpleTimeBufferInput<K, V>(instance, value, callback, time, isDeepDiff)
  };
}
/**
 *
 * @param { number } time
 */
export function timebuffer(time: number, mode = 'last') {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const func: Function = target[methodName];
    const key = methodName + 'Tmp'
    delete descriptor['value']
    delete descriptor['writable']
    descriptor.configurable = false
    descriptor.get = function() {
      if(!this[key]) {
        this[methodName + 'TmpKey'] = func.bind(this)
        this[key] = (...args: any[]) => {
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

export function logger<P extends Array<any> = any[]>(name?: string, time = false) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    /**
     * @type {function}
     */
    const func: Function = target[methodName];
    if(time) {
      descriptor.value = function(...args: P) {
        console.time(methodName)
        const r = func.apply(this, args)
        console.log(name, methodName, args, r)
        console.timeEnd(methodName)
        return r;
      }
    } else {
      descriptor.value = function(...args: P) {
        const r = func.apply(this, args)
        console.log(name, methodName, args, r)
        return r;
      }
    }
  }
}

export interface IMessageConfig<T = any> {
  msg?: T;
  [k: string]: any;
}
export interface IMessageConfigGroup<T = any> {
  msg: T[];
  [k: string]: any;
}
export type Complier = (group: IMessageConfigGroup) => void;

export interface IMessage {
  <T = any>(config: IMessageConfig<T>, instance: any, time: number): Promise<T[]>;
  error: <T = any>(msg: T, instance?: any, time?: number) => Promise<T[]>;
}

export function $message<T = any>(config: IMessageConfig<T>, instance: any, time: number = 100): Promise<T[]> {
  return simpleTimeBufferInput(instance, config, (configList: IMessageConfig<T>[]) => {
    const config = reduce<IMessageConfig, IMessageConfigGroup>(configList, ({ msg, ...other }, { msg: iMsg, ...iOther }) => {
      return assign(other, iOther, {
        msg: concat(msg, [iMsg]),
        dangerouslyUseHTMLString: true,
      });
    }, { msg: [] });
    return this.complier(config);
  }, time);
};
$message.error = function(msg: any, instance?: any, time?: number) {
  return this({ msg, type: 'error' }, instance, time);
};

export interface IMessageBuffer {
  $complier: Complier | never;
  useComplier(complier: Complier): void;
  $message: IMessage;
}
export class MessageBuffer implements IMessageBuffer {
  $complier: Complier
  constructor(complier: Complier) {
    this.useComplier(complier)
  }
  @autobind useComplier(complier: Complier): void {
    this.$complier = complier
  }
  $message = $message.bind(this);

  $notify<V = any>(config: IMessageConfig<V>, instance: any, time: number = 100): Promise<V[]> {
    return simpleTimeBufferInput(instance, config, function (configList) {
      const config: V = reduce<any, any>(configList, ({ msg, ...other }, { msg: iMsg, ...iOther }) => {
        return assign(other, iOther, {
          msg: concat(isArray(msg) ? msg : [], iMsg),
          dangerouslyUseHTMLString: true,
        });
      }, {});
      return this.complier(config);
    }, time || 100);
  }
}

export default {
  MessageBuffer,
  timebuffer,
  logger,
  simpleTimeBuffer,
  simpleTimeBufferInput,
  createSimpleTimeBufferInput,
  ...testGroup
}