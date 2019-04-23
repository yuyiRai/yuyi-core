/* eslint-disable */

import { autobind } from 'core-decorators';
import { last } from 'lodash';
import { action, computed, extendObservable, observable, reaction, runInAction } from 'mobx';
import { Utils } from './Utils';

export class AsyncLoadProperty<V = any> {
  @observable.ref type: any;
  @observable.ref defaultValue: V;
  @observable.ref currentValue: V;
  lastParam: any;
  @observable.ref loading = true;
  @observable isInited: boolean;
  @observable.ref getterFunc: Function = () => this.defaultValue
  timeBuffer: number = 0;
  @observable.ref emitter: any = null;

  constructor(type: any, getter: any, defaultValue: V = null, timeBuffer = 0) {
    this.type = type;
    this.reset(defaultValue, true)
    if (timeBuffer > 0) {
      this.timeBuffer = timeBuffer
    }
    this.registerGetter(getter)
    // reaction(() => this.loading, loading => {
    //   console.log('loading change', loading)
    // }, { fireImmediately: true })
    // reaction(() => this.isInited, value => {
    //   console.log('初始化状态变更', value)
    // }, { fireImmediately: true })
    // reaction(() => this.currentValue, value => {
    //   console.log('value change', value)
    // })
  }


  getValue = (param: any) => {
    if (param === this.lastParam) {
      return this.currentValue;
    }
    this.lastParam = param;
    this.valueGetter(param)
    return this.defaultValue
  }

  @action.bound reset(nextDefaultValue: V, force: boolean) {
    if (this.isTypedValue(nextDefaultValue)) {
      this.defaultValue = nextDefaultValue
      this.currentValue = this.defaultValue
      this.isInited = false;
    } else if (force) {
      this.isInited = false;
    }
    return this;
  }

  @action.bound async updateValue(nextValue: V) {
    const value = await nextValue
    if (this.isTypedValue(value)) {
      this.currentValue = value
      if (!this.isInited) {
        this.isInited = true
      }
      this.loadingEnd()
    }
  }
  @action.bound registerGetter(getter: any) {
    this.getterFunc = Utils.isFunctionFilter(getter, this.getterFunc);
  }
  @computed.struct get valueGetter() {
    if (this.timeBuffer > 0) {
      const emitter = Utils.createSimpleTimeBufferInput((resList) => {
        this.updateValue(this.getterFunc(last(resList)))
      }, this, this.timeBuffer, true)
      return action((param) => {
        runInAction(async () => {
          this.loadingStart()
          return emitter(param)
        })
      })
    }
    return action((param) => {
      runInAction(() => {
        this.loadingStart()
        this.updateValue(this.getterFunc(param))
      })
    })
  }

  @action.bound loadingStart() {
    if (!this.loading)
      this.loading = true
  }
  @action.bound loadingEnd() {
    if (this.loading)
      this.loading = false
  }

  @autobind isTypedValue(value: any) {
    if (value == null) {
      return true
    } else if (Utils.isFunction(this.type)) {
      return this.type(value)
    } else {
      const { type } = this
      switch (type) {
        case String: return Utils.isString(value)
        case Boolean: return Utils.isBoolean(value)
        case Array: return Utils.isArray(value)
        case Number: return Utils.isNumber(value)
        default: return value instanceof type
      }
    }
  }
}

export type AsyncComputedConfig<V> = { type: any, defaultValue: V, watcher: any, time: number }
/**
 * @return { PropertyDecorator }
 */
export function asyncComputed<V = any>({ type, defaultValue, watcher, time }: AsyncComputedConfig<V>): PropertyDecorator {
  /**
   * @type {PropertyDecorator}
   * @param { * } target 
   * @param { string } propertyName 
   * @param { PropertyDescriptor } descriptor
   */
  function Async(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<V>) {
    const asyncName = `$${propertyName}Async`
    const { get: getter } = descriptor
    if (getter) {
      descriptor.get = function() {
        let sourceInstance = this;
        if (!this[asyncName]) {
          const asyncNpm = new AsyncLoadProperty(
            type,
            () => Reflect.apply(getter, sourceInstance, []),
            defaultValue,
            time
          )
          extendObservable(this, {
            get [asyncName]() {
              return asyncNpm 
            }
          })

          if (!Utils.isNil(watcher)) {
            reaction(
              () => this[watcher],
              trigger => {
                this[asyncName].reset(asyncNpm.currentValue).getValue(trigger)
              },
              { fireImmediately: true }
            )
          }
        }
        return this[asyncName].getValue(this[watcher])
      }
    }
    return computed.struct(target, propertyName, descriptor);
  }
  return Async as any;
}
