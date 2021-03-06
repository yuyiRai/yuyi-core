import { Constant$ } from '../Constransts';
import { EventEmitter } from '../EventEmitter';
import { filter, isArray, isArrayLike, isBoolean, isDate, isEmpty, isEmptyValue, isFunction, isNaN, isNil, isNotEmptyValue, isNotNil, isNumber, isObject, isPlainObject, isPureObj, isString, map, values } from '../LodashExtra';

// Array.prototype.map = ()

/**
 * 判断是否为数型或布尔型
 * @param value
 * @public
 */
export function isBoolOrNum(value: any): value is (boolean | number) {
  return isBoolean(value) || isNumber(value);
}
/**
 * 判断是否为空的数组
 * @param value
 * @remarks 需要注意是否为非空数组和不为空数组的差异
 * @public
 */
export function isEmptyArray<T>(value: any): value is T[] {
  return isArray(value) && !value.length;
}
/**
 * 判断是否是非空的数组
 * @param value
 * @remarks 需要注意是否为非空数组和不为空数组的差异
 * @public
 */
export function isNotEmptyArray<T>(value: any): value is T[] {
  return isArray(value) && !!value.length;
}
/**
 * 严格判断是否是非空数组
 * 如果长度不为0，则判断是否所有下标成员都为空值（校验规则见{@link LodashExtra#isNotEmptyValue | isNotEmptyValue()}）
 * @param value
 * @remarks 需要注意是否为非空数组和不为空数组的差异
 * @public
 */
export function isNotEmptyArrayStrict<T>(value: any): value is T[] {
  return isArray(value) && Constant$.FILTER(value, i => isNotEmptyValue(i)).length > 0;
}
/**
 * 严格判断是否是空数组
 * 如果长度不为0，则判断是否所有下标成员都为空值（校验规则见{@link LodashExtra#isNotEmptyValue | isNotEmptyValue()}）
 * @param value
 * @remarks 需要注意是否为非空数组和不为空数组的差异
 * @public
 */
export function isEmptyArrayStrict(value: any): value is any[] {
  return isArray(value) && Constant$.FILTER(value, i => isNotEmptyValue(i)).length === 0;
}

/**
 * 判断是否为空数据，基于lodash的{@link lodash#isEmpty | isEmpty()}进行严格判断
 * @param value
 * @public
 */
export function isEmptyData(value: any): value is any[] {
  return !isBoolean(value) && !isNumber(value) && (isEmptyArrayStrict(value) || isEmpty(value));
}

/**
 * 判断是否为非空数据，基于lodash的{@link lodash#isEmpty | isEmpty()}进行严格判断
 * @param value
 * @public
 */
export function isNotEmptyData(value: any): boolean {
  return isBoolean(value) || isNumber(value) || !(isEmptyArrayStrict(value) || isEmpty(value));
}

// export function paramShiftObjPairs<T>(func?: T): T {
//   return func;
// }

/**
 * 严格判断是否是空对象
 * 判断是否所有下标成员都为空值（校验规则见{@link isNotEmptyData | isNotEmptyData()}）
 * @param value
 * @remarks 需要注意是否为非空对象和不为空对象的差异
 * @public
 */
export function isEmptyObject(value: any, checkValue: boolean = false): value is {} {
  return isPureObj(value) && (
    checkValue ? Constant$.FILTER(values(value), isNotEmptyData).length === 0 : isEmpty(value)
  );
}
/**
 * 严格判断是否是非空对象
 * 判断是否所有下标成员都为空值（校验规则见{@link isNotEmptyData | isNotEmptyData()}）
 * @param value
 * @remarks 需要注意是否为非空对象和不为空对象的差异
 * @public
 */
export function isNotEmptyObject(value: any): value is object {
  return isPureObj(value) && !isEmpty(value);
}

/**
 * 判断非空字符串
 * @param value
 * @remarks 需要注意是否为非空字符串和不为空字符串的差异
 * @public
 */
export function isNotEmptyString(value: any): value is string {
  return isString(value) && value.length > 0;
}
/**
 * 判断空字符串
 * @param value
 * @remarks 需要注意是否为非空字符串和不为空字符串的差异
 * @public
 */
export function isEmptyString(value: any): value is string {
  return isString(value) && value.length === 0;
}

export function isNilAll(...valueArr: any[]): boolean {
  return filter(map(valueArr, value => isNil(value)), is => is).length === valueArr.length;
}

export const typeUtils = {
  isArrayLike,
  isArray,
  isBoolean,
  isPureObj,
  isObject,
  isNumber,
  isString,
  isEmptyData,
  isNotEmptyData,
  isEventEmitter: EventEmitter.is,
  isEmptyString,
  isNotEmptyString,
  isFunction,
  isNil,
  isNotNil,
  isDate,
  isNaN,
  isPlainObject,
  isBooleanOrNumber: isBoolOrNum,
  isEmptyValue,
  isNotEmptyValue,
  isEmptyArray,
  isNotEmptyArray,
  isEmptyArrayStrict,
  isNotEmptyArrayStrict,
  isEmptyObject,
  isNotEmptyObject
};

// export const typeUtilsKeys = tsKeys<typeof typeUtils>()
