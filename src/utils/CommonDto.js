/* eslint-disable */
import { cloneDeep, isEqual, property } from 'lodash';
import { action, extendObservable, observable } from 'mobx';
import { Utils } from './Utils';
export default class CommonDto {
  @observable.ref
  $$___source_dto;
  /**
   * sourceDto
   */
  constructor(dto) {
    this.$$___source_dto = dto;
    this.$$___instance = { dto };
    for (const key in dto) {
      const keyName = _.camelCase("set-" + key);
      extendObservable(this, {
        get [key]() {
          return this.$$___source_dto[key];
        },
        set [key](value) {
          return this.$$___source_dto[key] = value;
        },
        [keyName](value) {
          // console.log(key, 'set', value, this.i.label)
          // const r = this.i[key] = value
          return Reflect.set(this.$$___source_dto, key, value);
        }
      }, {
          [keyName]: action.bound
        }, { deep: false });
    }
  }
  /**
   * get value by key
   * @param { string } keyName
   */
  @action.bound
  get(keyNameStr, defaultValue = undefined, useCreater = true) {
    if (Utils.isNotEmptyString(keyNameStr)) {
      for (let keyName of keyNameStr.split('||')) {
        const value = this.hasComputed(keyName)
          ? this.getComputed(keyName)
          : ((this[useCreater ? 'getAndCreateDeepPropertyByStr' : 'getPropertyByStr'])(keyName, defaultValue));
        // 取到值之后创建缓存，确定路径已经存在了
        if (Utils.isNotEmptyValue(value)) {
          this.setSafeComputed(keyName);
          return value;
        }
      }
    }
  }
  /**
   * 创建缓存，使用安全方法
   * @param { string } keyName
   */
  @action.bound
  createComputed(keyName) {
    return extendObservable(this, {
      get ['_' + keyName]() {
        return this.getPropertyByStr(keyName);
      }
    });
  }
  /**
   * 是否已创建缓存
   * @param { string } keyName
   */
  hasComputed = (keyName) => {
    return !Utils.isNil(Reflect.getOwnPropertyDescriptor(this, '_' + keyName));
  };
  @action.bound
  setSafeComputed(keyName) {
    return !this.hasComputed(keyName) && this.createComputed(keyName);
  }
  getComputed = (keyName) => {
    return this['_' + keyName];
  };
  @action.bound setLastValue(keyName, value) {
    const lastValueKey = `$$$_last_$__${keyName}`;
    if (Utils.isEqual(value, this[lastValueKey])) {
      return false;
    }
    else {
      this[lastValueKey] = value;
      return true;
    }
  }
  /**
   * 设置值
   * @param { string } keyName
   * @param { * } value
   * @param { boolean } isSafe 安全模式
   */
  @action.bound set(keyName, value = undefined, isSafe = false) {
    // console.log('set', keyName, value)
    if (!this.setLastValue(keyName, value)) {
      // console.log('值没有发生变化，set失败', keyName, value)
      return false;
    }
    else {
      if (!isSafe && value === this.getAndCreateDeepPropertyByStr(keyName, value)) {
        // 取到值之后创建缓存，确定路径已经存在了
        return true;
      }
      this.setSafeComputed(keyName);
      return this.setPropertyByStr(keyName, value);
    }
  }
  /**
   *
   * @param { string } keyStr 指针地址
   * @param { * } defaultValue 没有取到值时默认返回并为该指针所赋的值
   */
  @action.bound getAndCreateDeepPropertyByStr(keyStr, defaultValue) {
    if (Utils.isNil(keyStr)) {
      // debugger
      return defaultValue;
    }
    if (!Utils.isEmptyValue(keyStr)) {
      const express = Utils.getExpressByStr(keyStr, defaultValue);
      // console.log(this.$$___source_dto, keyStr, express, Reflect.apply(Utils.getInnerWarpField, this, [this.$$___source_dto, ...express]))
      return Utils.getPropertyFieldByCreate(this.$$___source_dto, ...express);
      // return Utils.getPropByPath(this.$$___source_dto, keyStr, false).v
    }
    return defaultValue;
  }
  /**
   * 根据字符串解析指针，如果没有值或解析不正确则返回undefined
   * @param { string } keyName 例: a.b[0].c
   * @param { * } defaultValue 任何
   */
  @action.bound getPropertyByStr(keyName, defaultValue) {
    const value = property(keyName)(this.$$___source_dto);
    return Utils.isEmptyValue(value) ? defaultValue : value;
  }
  @action.bound setPropertyByStr(keyName, value) {
    const dto = this.$$___source_dto;
    const str = `dto.${keyName} = ${Utils.isEmptyValue(value) ? `undefined` : `${!Utils.isString(value) ? JSON.stringify(value) : `"${value}"`};`}`;
    try {
      eval(str);
      return true;
    }
    catch (e) {
      return false;
    }
  }
  export() {
    return this.$$___source_dto;
  }
  clone() {
    return cloneDeep(this.$$___source_dto);
  }
  equals(dto, deep = false) {
    return deep ? isEqual(dto, this.$$___source_dto) : this.$$___source_dto === dto;
  }
}
export { CommonDto }

