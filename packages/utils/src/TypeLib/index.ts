/**
 * @module TypeUtils
 */
import {
  assign, filter, isArray,
  isArrayLike, isBoolean, isDate,
  isEmpty, isFunction, isNil,
  isNaN,
  isObject,
  isString, map, reduce, trim, values,
  isNumber,
  isNumberLodash
} from '../LodashExtra';
import { EventEmitter } from '../EventEmitter';
import { IKeyValueMap, IsBaseType, IsArray, IsObject, IsAny } from '../TsUtils';

// Array.prototype.map = ()
/**
 * 是否为空或异常值，不包括0
 * 空值: null/undefined/''
 * 异常值: NaN
 * 不包括空对象/空数组
 * @param value
 */
export function isEmptyValue(value: any): value is (null | undefined | '') {
  // console.log('isEmptyValue', value, (isString(value) && trim(value) === ''), isNil(value), isNaN(value))
  return (isString(value) && trim(value) === '') || isNil(value) || isNaN(value);
}

/**
 * 是否非空且非异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param value
 */
export function isNotEmptyValue(value: any): value is (string | number | boolean | object | Function) {
  return !isEmptyValue(value);
}

export function isBooleanOrNumber(value: any): value is (boolean | number) {
  return isBoolean(value) || isNumber(value);
}
export function isEmptyArray(value: any): value is boolean {
  return isArray(value) && isEmpty(value);
}
export function isNotEmptyArray(value: any): value is any[] {
  return isArray(value) && !isEmpty(value);
}
export function isNotEmptyArrayStrict(value: any): value is any[] {
  return isArray(value) && filter(value, i => isNotEmptyValue(i)).length > 0;
}
export function isEmptyArrayStrict(value: any): value is any[] {
  return isArray(value) && filter(value, i => isNotEmptyValue(i)).length === 0;
}
export function isEmptyData(value: any): value is any[] {
  return !isBoolean(value) && !isNumberLodash(value) && (isEmptyArrayStrict(value) || isEmpty(value));
}
export function isNotEmptyData(value: any): boolean {
  return isBoolean(value) || isNumberLodash(value) || !(isEmptyArrayStrict(value) || isEmpty(value));
}
export function isEmptyObject(value: any, checkValue: boolean = false): value is {} {
  return isObject(value) && !isArray(value) && (checkValue ? filter(values(value), v => isNotEmptyData(v)).length === 0 : isEmpty(value));
}
export function isNotEmptyObject(value: any): value is object {
  return isObject(value) && !isArray(value) && !isEmpty(value);
}
export function isEventEmitter(emitter: any): emitter is EventEmitter {
  return emitter instanceof EventEmitter;
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
  isEventEmitter,
  isNotEmptyString,
  isFunction,
  isNil,
  isDate,
  isNaN,
  isNotFunction,
  isNotNaN,
  isNilAll,
  isBooleanOrNumber,
  isEmptyValue,
  isNotEmptyValue,
  isEmptyArray,
  isNotEmptyArray,
  isEmptyArrayStrict,
  isNotEmptyArrayStrict,
  isEmptyObject,
  isNotEmptyObject
};

// export type AA = IsArray<any>

export type FilterFunction<T = any> = <
  ST extends (
    IsBaseType<T, T, (
      IsArray<T, any, (
        IsObject<T, any, (
          IsAny<T, any, T>
        )>
      )>
    )>
  ) = any
  >(...key: any[]) => (
    IsBaseType<T, T, (
      IsArray<T, Array<ST>, (
        IsObject<T, IsObject<ST, ST, IKeyValueMap<ST>>, (
          IsAny<ST, T, ST>
        )>
      )>
    )>
  ) | undefined



export function todoFilter(handler: (v: any) => boolean): FilterFunction {
  function Filter<T>(...values: any[]): T | undefined {
    for (const v of values) {
      if (handler(v)) {
        return v;
      }
    }
    return undefined;
  };
  return Filter
}

export interface ITypeFilterUtils {
  isNumberFilter: FilterFunction<number>;
  isBooleanFilter: FilterFunction<boolean>;
  isStringFilter: FilterFunction<string>;
  isNotEmptyStringFilter: FilterFunction<string>;
  isArrayFilter: FilterFunction<Array<any>>;
  isObjectFilter: FilterFunction<object>;
  isNotEmptyArrayFilter: FilterFunction<Array<any>>;
  isNotEmptyValueFilter: FilterFunction;
  isFunctionFilter: FilterFunction<(...arg: any[]) => any>
}
type Type<T> = T

export interface ITypeUtils extends Type<typeof typeUtils>, ITypeFilterUtils { }

/**
 * @external
 */
export const typeFilterUtils: ITypeFilterUtils = reduce<IKeyValueMap<(v: any) => boolean>, any>(
  typeUtils,
  function (group, func: (v: any) => boolean, key) {
    return assign(group, {
      [key + "Filter"]: todoFilter(func)
    });
  },
  {}
);
// typeFilterUtils.isObjectFilter<number>({}, [])
// typeFilterUtils.isNumberFilter<number>({})
// typeFilterUtils.isArrayFilter<number>({})
// typeFilterUtils.isArrayFilter({})
// typeFilterUtils.isNotEmptyValueFilter({})
// typeFilterUtils.isNotEmptyValueFilter<number>({})
// typeFilterUtils.isStringFilter({})
// typeFilterUtils.isNotEmptyStringFilter('')
