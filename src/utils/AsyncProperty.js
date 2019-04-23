/* eslint-disable */

import { observable, computed, action, runInAction, reaction, extendObservable, remove } from 'mobx'
import { Utils } from './Utils'
import { ItemConfig } from '../stores/index';
import { cpus } from 'os';
import { autobind } from 'core-decorators';

export class AsyncLoadProperty {
  @observable.ref type;
  @observable.ref defaultValue;
  @observable.ref currentValue;
  @observable.ref loading = true;
  @observable isInited;
  @observable.ref getterFunc = () => this.defaultValue
  timeBuffer = false;
  @observable.ref emitter = null;

  constructor(type, getter, defaultValue = null, timeBuffer = 0) {
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


  getValue = (param) => {
    if (param === this.lastParam) {
      return this.currentValue;
    }
    this.lastParam = param;
    this.valueGetter(param)
    return this.defaultValue
  }

  @action.bound reset(nextDefaultValue, force) {
    if (this.isTypedValue(nextDefaultValue)) {
      this.defaultValue = nextDefaultValue
      this.currentValue = this.defaultValue
      this.isInited = false;
    } else if (force) {
      this.isInited = false;
    }
    return this;
  }

  @action.bound async updateValue(nextValue) {
    const value = await nextValue
    if (this.isTypedValue(value)) {
      this.currentValue = value
      if (!this.isInited) {
        this.isInited = true
      }
      this.loadingEnd()
    }
  }
  @action.bound registerGetter(getter) {
    this.getterFunc = Utils.isFunctionFilter(getter, this.getterFunc);
  }
  @computed.struct get valueGetter() {
    if (this.timeBuffer > 0) {
      const emitter = Utils.createSimpleTimeBufferInput((resList) => {
        this.updateValue(this.getterFunc(_.last(resList)))
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

  @autobind isTypedValue(value) {
    if (value == null) {
      return true
    } else if (Utils.isFunction(this.type)) {
      return this.type(value)
    } else {
      const { Type } = this
      switch (Type) {
        case String: return Utils.isString(value)
        case Boolean: return Utils.isBoolean(value)
        case Array: return Utils.isArray(value)
        case Number: return Utils.isNumber(value)
        default: return value instanceof Type
      }
    }
  }
}

/**
 * @return { PropertyDecorator }
 */
export function asyncComputed({ type, defaultValue, resetFrom, watcher, time }) {
  /**
   * @type {PropertyDecorator}
   * @param { * } target 
   * @param { string } propertyName 
   * @param { PropertyDescriptor } descriptor
   */
  function Async(target, propertyName, descriptor) {
    const asyncName = `$${propertyName}Async`
    const { get: getter, set, ...other } = descriptor
    if (getter) {
      descriptor.get = function() {
        let sourceInstance = this;
        if (!this[asyncName]) {
          const asyncNpm = new AsyncLoadProperty(
            type,
            param => Reflect.apply(getter, sourceInstance, []),
            defaultValue,
            time
          )
          extendObservable(this, {
            get [asyncName]() {
              return asyncNpm 
            }
          })

          if (!_.isNil(watcher)) {
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
  return Async;
}

export class OptionsPipeStore {
  @observable itemConfig;
  @action.bound setItemConfig(itemConfig) {
    this.itemConfig = itemConfig
  }
  /**
   * 至今为止选择过的optionList
   * @type { Array }
   */
  @observable.ref selectedOptions = [];

  @action.bound patchSelectedOption(optionsList) {
    this.selectedOptions = _.concat(this.selectedOptions,
      _.filter(optionsList,
        item => !_.some(this.selectedOptions, option => option.value === item.value)
      )
    )
  }
  @action.bound patchSelectedOptionByValues(valueList, options) {
    this.selectedOptions = _.concat(this.selectedOptions,
      _.filter(Utils.getOptionsByValue(options, valueList),
        item => !_.some(this.selectedOptions, option => option.value === item.value)
      )
    )
  }

  nextOptionsWillUpdateValue(nextOptions, keyWordArr, lastValue) {
    const selectedOptions = Utils.getOptionsByLabel(nextOptions, keyWordArr)
    if (selectedOptions.length > 0) {
      const selectValue = multiple
        ? Utils.zipEmptyData(_.concat(lastValue, _.map(selectedOptions, 'value')), true)
        : _.get(selectedOptions, '[0].value')
      if (!Utils.likeArray(selectValue, lastValue))
        true
    }
    return false
  }

  @computed labelsToValues() {
    return (label) => {
      return Utils.arrayMapToKeysDive(Utils.getOptionsByLabel(this.isSearch ? this.selectedOptions : this.itemConfig.options, label), 'value')
    }
  }

  valuesToLabels = (value, joinKey = false) => {
    const result = Utils.isArrayFilter(
      Utils.arrayMapToKeysDive(
        Utils.getOptionsByValue(
          Utils.isArrayFilter(this.isSearch ? this.selectedOptions : this.itemConfig.options),
          value
        ),
        'label'
      ), []
    )
    return joinKey !== false ? result.join(joinKey) : result
  }
}