/**
 * @module TypeUtils
 */
import { Constant$ } from '../Constransts';
import { EventEmitter } from '../EventEmitter';
import { typeUtils } from './expect';
import { FilterFunction, filterTo } from './filterTo';

export { typeUtils, filterTo, FilterFunction }
export * from './expect'

export type ITypeMetaFilters = {
  isNumber: FilterFunction.isNumber;
  isBoolean: FilterFunction.isBoolean;
  isString: FilterFunction.isString;
  isNotEmptyString: FilterFunction.isString;
  isArray: FilterFunction.isArray;
  isObject: FilterFunction.isObject;
  isNotEmptyArray: FilterFunction.isArray;
  isNotEmptyArrayStrict: FilterFunction.isArray;
  isFunction: FilterFunction.isFunction;
  isEventEmitter: FilterFunction.isTyped<EventEmitter>;
  isEmptyObject: FilterFunction.isEmptyObject;
  isNotEmptyObject: FilterFunction.isObjectStrict<{}>;
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
    execTmp.filter = Constant$.BindArg$$(filterTo, keyAndValue[1])
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
// typeFilterUtils.isObjectFilter<number>({}, [])
// typeFilterUtils.isNumberFilter<number>({})
// typeFilterUtils.isArrayFilter<number>({})
// typeFilterUtils.isArrayFilter({})
// typeFilterUtils.isNotEmptyValueFilter({})
// typeFilterUtils.isNotEmptyValueFilter<number>({})
// typeFilterUtils.isStringFilter({})
// typeFilterUtils.isNotEmptyStringFilter('')
