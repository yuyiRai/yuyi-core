/**
 * @module UtilClass
 */
import { cloneDeep, isEqual, property, camelCase, set, isNil, isString, isEmptyValue, isNotEmptyValue } from '../../LodashExtra/index';
import { action, extendObservable, observable } from 'mobx';
import { autobind } from 'core-decorators';
import { IKeyValueMap } from '../../TsUtils/interface';
import { isNotEmptyString } from '../../TypeLib';
import { getPropertyFieldByCreate, getExpressByStr } from '../getPropertyFieldByCreate';

/**
 * 一个通用的实体类
 * @beta
 */
export class CommonDto<T extends object = IKeyValueMap> {
  /**
   * @internal
   */
  @observable.ref
  // tslint:disable-next-line: variable-name
  protected $$___source_dto: T;
  /**
   * @deprecated
   * @internal
   */
  // tslint:disable-next-line: variable-name
  protected $$___instance: { dto: T }

  /**
   * 
   * @param dto - 原始对象
   */
  public constructor(dto: T) {
    this.$$___source_dto = dto;
    // tslint:disable-next-line: deprecation
    this.$$___instance = { dto }
    for (const key in dto) {
      const keyName = camelCase("set-" + key);
      extendObservable(this, {
        get [key]() {
          return this.$$___source_dto[key];
        },
        set [key](value: any) {
          this.$$___source_dto[key] = value;
        },
        [keyName](value: any) {
          // console.log(key, 'set', value, this.i.label)
          // const r = this.i[key] = value
          return Reflect.set(this.$$___source_dto, key, value);
        }
      }, {
          [keyName]: action
        }, { deep: false });
    }
  }
  /**
   * get value by key
   * @param { string } keyName
   */
  @action
  public get(keyNameStr: string, defaultValue: any = undefined, useCreater = true) {
    if (isNotEmptyString(keyNameStr)) {
      for (let keyName of keyNameStr.split('||')) {
        const value = this.hasComputed(keyName)
          ? this.getComputed(keyName)
          : ((this[useCreater ? 'getAndCreateDeepPropertyByStr' : 'getPropertyByStr'])(keyName, defaultValue));
        // 取到值之后创建缓存，确定路径已经存在了
        if (isNotEmptyValue(value)) {
          this.setSafeComputed(keyName);
          return value;
        }
      }
    }
    return undefined
  }
  /**
   * 创建缓存，使用安全方法
   * @param { string } keyName
   */
  @action
  public createComputed(keyName: string) {
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
  @autobind
  public hasComputed(keyName: string) {
    return !isNil(Reflect.getOwnPropertyDescriptor(this, '_' + keyName));
  };
  @action
  public setSafeComputed(keyName: string) {
    return !this.hasComputed(keyName) && this.createComputed(keyName);
  }
  public getComputed = (keyName: string) => {
    return this['_' + keyName];
  };
  @action
  public setLastValue(keyName: string, value: any) {
    const lastValueKey = `$$$_last_$__${keyName}`;
    if (isEqual(value, this[lastValueKey])) {
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
  @action
  public set(keyName: string, value: any = undefined, isSafe: boolean = false) {
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
  @action getAndCreateDeepPropertyByStr(keyStr: string, defaultValue: any) {
    if (isNil(keyStr)) {
      // debugger
      return defaultValue;
    }
    if (!isEmptyValue(keyStr)) {
      const express = getExpressByStr(keyStr, defaultValue);
      // console.log(this.$$___source_dto, keyStr, express, Reflect.apply(getInnerWarpField, this, [this.$$___source_dto, ...express]))
      return getPropertyFieldByCreate(this.$$___source_dto, ...express);
      // return getPropByPath(this.$$___source_dto, keyStr, false).v
    }
    return defaultValue;
  }
  /**
   * 根据字符串解析指针，如果没有值或解析不正确则返回undefined
   * @param { string } keyName 例: a.b[0].c
   * @param { * } defaultValue 任何
   */
  @action getPropertyByStr(keyName: string, defaultValue: any) {
    const value = property(keyName)(this.$$___source_dto);
    return isEmptyValue(value) ? defaultValue : value;
  }
  @action setPropertyByStr(keyName: string, value: any) {
    const dto = this.$$___source_dto;
    try {
      set(dto, keyName, isEmptyValue(value) ? undefined : !isString(value) ? JSON.stringify(value) : `${value}`);
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
  equals(dto: T, deep = false) {
    return deep ? isEqual(dto, this.$$___source_dto) : this.$$___source_dto === dto;
  }
}
