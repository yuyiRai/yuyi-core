import { EventEmitter } from "src/utils/EventEmitter";
import { autobind } from "core-decorators";
import { filter } from "rxjs/operators";
import { IKeyValueMap } from "mobx";
import { forEach, assign, reduce, filter as lFilter } from 'lodash'
import Utils from ".";


/* class decorator */
// function staticImplements<T>() {
//   return (constructor: T) => constructor;
// } 

export type IEventEmitter = typeof EventEmitter
export interface IEventStoreBase {
  $emit?(eventName: string, ...args: any[]): boolean;
  $on?(eventName: string, ...args: any[]): boolean;
}

export interface IEventStore extends IEventStoreBase, EventEmitter<any> {
  eventNames: string[];
  isValidEventName(eventName: string): boolean;
};

// @staticImplements<IEventStoreStatic>()
export class EventStore extends EventEmitter<any> implements IEventStore {
  // public static injectedValidEventNames: string[];
  public eventNames: Array<string> = []
  constructor(eventNames: string[]) {
    super()
    this.eventNames = eventNames
  }
  /**
   * 是否是合法事件名
   * @param {string} eventName
   */
  @autobind isValidEventName(eventName: string) {
    return this.eventNames.includes(eventName)
  }
  /**
   * 发送事件
   * @param {string} eventName 事件名
   * @param {string[]} args 参数
   */
  @autobind $emit(eventName: string, ...args: any[]) {
    console.log('log $emit', this.eventNames.includes(eventName), eventName, ...args)
    if(this.eventNames.includes(eventName)) {
      this.emit({
        type: eventName, 
        args
      })
      return true
    }
    return false
  }
  /**
   * 监听事件
   * @param {string} eventName 事件名
   * @param {(...args, event) => void} callback 事件名
   */
  @autobind $on(eventName: string, callback: Function) {
    if(this.eventNames.includes(eventName)) {
      this.pipe(
        filter(({type}) => type === eventName)
      ).subscribe((e) => callback(...e.args, e))
      return true
    }
    return false
  }
}

const fake = { $emit(){}, $on(){} }

export interface InjectedClass extends IEventStoreBase {
  __getEventListenersHooks?: (validEventNames: string[], allowExtendKey: IKeyValueMap, force?: boolean) => any;
}
export interface InjectedClassStatic<T> {
  new (...args: any[]): T & InjectedClass;
  injectedValidEventNames?: string[];
}

/**
 * @param { string[] } eventNames
 * @param { {[key: string]: Function} } extendTarget
 */
export function EventStoreInject<V = any>(eventNames: string[], extendTarget?: any) {
  const allowExtendKey = reduce(extendTarget, function(r, t, key) {
    return Utils.isArray(t.injectedValidEventNames)
      ? assign(r, {
        [key]: lFilter(eventNames, function(eName: string) {
          return t.injectedValidEventNames.includes(eName)
        })
      })
      : r
  }, {})
    
  return function <S extends InjectedClassStatic<V & ThisType<V>>>(target: S) {
    Object.defineProperty(target, 'injectedValidEventNames', {
      value: eventNames,
      enumerable: true,
      writable: false
    })
    Object.defineProperty(target.prototype, '__getEventListenersHooks', {
      value: function(validEventNames: string[], allowExtendKey: IKeyValueMap, force?: boolean) {
        if(!this.$__event__store && !force) {
          return fake
        }
        if(force && !this.$__event__store){
          Object.defineProperty(this, '$__event__store', {
            get() {
              if(!this.$__event__store__core) {
                Object.defineProperty(this, '$__event__store__core', {
                  value: new EventStore(validEventNames),
                  enumerable: false,
                  configurable: true,
                  writable: false
                })
                console.log(validEventNames, allowExtendKey)
                forEach(allowExtendKey, (value, key) => {
                  if(this[key] && this[key].$on) {
                    forEach(value, name => {
                      this[key].$on(name, (...args: any) => {
                        console.log('on register', name, args)
                        this.$emit(name, ...args)
                      })
                      // console.log(`this.${key}.$on('${name}', this.$emit.bind(this, '${name}'))`)
                    })
                  }
                })
              }
              return this.$__event__store__core
            },
            enumerable: false,
            configurable: true
          })
        }
        return this.$__event__store;
      },
      enumerable: true,
      writable: false
    })
    Object.defineProperty(target.prototype, '$on', {
      get() { return this.__getEventListenersHooks(this.constructor.injectedValidEventNames, allowExtendKey, true).$on },
      enumerable: true,
      configurable: true
    })
    Object.defineProperty(target.prototype, '$emit', {
      get() {
        return this.__getEventListenersHooks(this.constructor.injectedValidEventNames, allowExtendKey).$emit 
      },
      enumerable: true,
      configurable: true
    })
    return target as S;
  }
}
