/**
 * @module TypeUtils
 */
import { Constant$ } from '../Constransts';
import { EventEmitter } from '../EventEmitter';
import { filter, isArray, isArrayLike, isBoolean, isDate, isEmpty, isEmptyValue, isFunction, isNaN, isNil, isNotEmptyValue, isNotNil, isNumber, isObject, isPlainObject, isString, map, values } from '../LodashExtra';

// Array.prototype.map = ()

export function isBooleanOrNumber(value: any): value is (boolean | number) {
  return isBoolean(value) || isNumber(value);
}
export function isEmptyArray<T>(value: any): value is T[] {
  return isArray(value) && !value.length;
}
export function isNotEmptyArray<T>(value: any): value is T[] {
  return isArray(value) && !!value.length;
}
export function isNotEmptyArrayStrict(value: any): value is any[] {
  return isArray(value) && value.filter(i => isNotEmptyValue(i)).length > 0;
}
export function isEmptyArrayStrict(value: any): value is any[] {
  return isArray(value) && value.filter(i => isNotEmptyValue(i)).length === 0;
}
export function isEmptyData(value: any): value is any[] {
  return !isBoolean(value) && !isNumber(value) && (isEmptyArrayStrict(value) || isEmpty(value));
}

/**
 * 不为空的数据
 * @param value 
 */
export function isNotEmptyData(value: any): boolean {
  return isBoolean(value) || isNumber(value) || !(isEmptyArrayStrict(value) || isEmpty(value));
}

export function paramShiftObjPairs<T>(func?: T): T {
  return func;
}

export function isEmptyObject(value: any, checkValue: boolean = false): value is {} {
  return isPlainObject(value) && (
    checkValue ? Constant$.FILTER(values(value), isNotEmptyData).length === 0 : isEmpty(value)
  );
}
export function isNotEmptyObject(value: any): value is object {
  return isPlainObject(value) && !isEmpty(value);
}

/**
 * 判断非空字符串
 * @param str
 */
export function isNotEmptyString(str: any): str is string {
  return isString(str) && str.length > 0;
}
export function isNotFunction(func: any) {
  return !isFunction(func);
}
export function isNotNaN(v: any): boolean {
  return !isNaN(v);
}
export function isNilAll(...valueArr: any[]): boolean {
  return filter(map(valueArr, value => isNil(value)), is => is).length === valueArr.length;
}


export const typeUtils = {
  isArrayLike,
  isArray,
  isBoolean,
  isObject,
  isNumber,
  isString,
  isEmptyData,
  isNotEmptyData,
  isEventEmitter: EventEmitter.is,
  isNotEmptyString,
  isFunction,
  isNil,
  isNotNil,
  isDate,
  isNaN,
  isNotFunction,
  isNotNaN,
  // isNilAll,
  isBooleanOrNumber,
  isEmptyValue,
  isNotEmptyValue,
  isEmptyArray,
  isNotEmptyArray,
  isEmptyArrayStrict,
  isNotEmptyArrayStrict,
  isEmptyObject,
  isNotEmptyObject,
};
