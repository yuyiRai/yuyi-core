/**
 * @module TypeUtils
 */
import { Constant$ } from '../Constransts';
import { EventEmitter } from '../EventEmitter';
import { filter, isArray, isArrayLike, isBoolean, isDate, isEmpty, isEmptyValue, isFunction, isNaN, isNil, isNotEmptyValue, isNotNil, isNumber, isObject, isPlainObject, isString, map, values } from '../LodashExtra';
import { IKeyValueMap, IsAny, IsArray, IsBaseType, IsClasses, IsObject, IsUnknown } from '../TsUtils';

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
  return isArray(value) && filter(value, i => isNotEmptyValue(i)).length > 0;
}
export function isEmptyArrayStrict(value: any): value is any[] {
  return isArray(value) && filter(value, i => isNotEmptyValue(i)).length === 0;
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
  isNilAll,
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


// export type AA = IsArray<any>
/**
 * 过滤函数类型
 */
export type FilterFunction<Target> = <Expect extends (
    IsBaseType<Target, Target, (
      IsArray<Target, any, (
        IsObject<Target, any, (
          IsAny<Target, any, Target>
        )>
      )>
    )>
  ) = any>(...key: any[]) => (
    // 
    IsArray<Target, Array<Expect>, (
      IsBaseType<Target, IsUnknown<Expect, Target, Expect>, (
        IsUnknown<Target, Expect, (
          // 
          IsObject<Target, (
            IsClasses<Target, Target extends EventEmitter ? EventEmitter<Expect> : Target, (
              IsBaseType<Expect, IKeyValueMap<Expect>, Expect>
            )>
          ), (
            IsUnknown<Expect, Target, Expect>
          )>
        )>
      )>
    )>
  ) | undefined



export function todoFilter<V>(handler: (v: any) => boolean, ...values: any[]): V {
  // tslint:disable-next-line: one-variable-per-declaration
  var i = 0, length = values.length, v: any;
  while (i < length) {
    if (handler(v = values[i++])) {
      return v;
    }
  }
  return undefined;
}

export type ITypeMetaFilters = {
  isNumber: FilterFunction<number>;
  isBoolean: FilterFunction<boolean>;
  isString: FilterFunction<string>;
  isNotEmptyString: FilterFunction<string>;
  isArray: FilterFunction<Array<any>>;
  isObject: FilterFunction<object>;
  isNotEmptyArray: FilterFunction<Array<any>>;
  isNotEmptyArrayStrict: FilterFunction<Array<any>>;
  isFunction: FilterFunction<(...arg: any[]) => any>;
  isEventEmitter: FilterFunction<EventEmitter>;
  isEmptyObject: FilterFunction<Record<string, never>>;
  isNotEmptyObject: FilterFunction<{}>;
}
export type ITypeOtherFilters = {
  [K in Exclude<keyof typeof typeUtils, keyof ITypeMetaFilters>]: FilterFunction<any>
}
export type ITypeFilters = ITypeMetaFilters & ITypeOtherFilters

// const t: IsBaseType<any, 'string', false> = null
export interface ITypeFilterUtils extends ITypeMetaFilters {
  isNumberFilter: FilterFunction<number>;
  isBooleanFilter: FilterFunction<boolean>;
  isStringFilter: FilterFunction<string>;
  isNotEmptyStringFilter: FilterFunction<string>;
  isArrayFilter: FilterFunction<Array<any>>;
  isObjectFilter: FilterFunction<{}>;
  isNotEmptyArrayFilter: FilterFunction<Array<any>>;
  isNotEmptyValueFilter: FilterFunction<any>;
  isFunctionFilter: FilterFunction<(...arg: any[]) => any>
}
type Type<T> = T

export interface ITypeUtils extends Type<typeof typeUtils> {
  filter: ITypeFilterUtils
}

// console.log(typeUtils)
var keyTmp: any;
export const typeFilterUtils = Constant$.REDUCE<[string, (v: any) => boolean], ITypeFilterUtils & ITypeMetaFilters & ITypeOtherFilters>(
  Constant$.ENTRIES(typeUtils),
  function (target, keyAndValue) {
    var execTmp: any = keyAndValue[1]
    execTmp.filter = Constant$.BindArg$$(todoFilter, keyAndValue[1])
    return Constant$.OBJ_ASSIGN(target, {
      [keyTmp = keyAndValue[0]]: execTmp.filter,
      [keyTmp + "Filter"]: execTmp.filter
    });
  },
  {} as any
);

export type MultipleExpector<Core = Type<typeof typeUtils>> = {
  [K in keyof Core]: Core[K] & {
    filter: K extends keyof ITypeFilters ? ITypeFilters[K] : FilterFunction<unknown>
  };
}

export interface Expector<Core = Type<typeof typeUtils>> extends MultipleExpector {
  filter: ITypeFilters;
  pure: MultipleExpector<Core>;
}

export const expect$: Expector = Constant$.OBJ_FREEZE(Constant$.OBJ_ASSIGN({}, typeUtils as any, {
  filter: typeFilterUtils,
  pure: Constant$.OBJ_FREEZE(typeUtils)
}))
export { isNotEmptyValue, isEmptyValue }
// typeFilterUtils.isObjectFilter<number>({}, [])
// typeFilterUtils.isNumberFilter<number>({})
// typeFilterUtils.isArrayFilter<number>({})
// typeFilterUtils.isArrayFilter({})
// typeFilterUtils.isNotEmptyValueFilter({})
// typeFilterUtils.isNotEmptyValueFilter<number>({})
// typeFilterUtils.isStringFilter({})
// typeFilterUtils.isNotEmptyStringFilter('')
