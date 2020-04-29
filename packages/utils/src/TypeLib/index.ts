/**
 * @module TypeUtils
 */
import { Constant$ } from '../Constransts';
import { EventEmitter } from '../EventEmitter';
import { typeUtils as typeUtilsBase } from './expect';
import { extendToFilter, FilterGenerator, filterTo, FilterTypes } from './filterTo';

export * from './expect';
export { filterTo, extendToFilter, FilterGenerator };

interface ITypeMetaFilters {
  isNumber: FilterTypes.isNumber;
  isBoolean: FilterTypes.isBoolean;
  isString: FilterTypes.isString;
  isNotEmptyString: FilterTypes.isString;
  isArray: FilterTypes.isArray;
  isObject: FilterTypes.isObject;
  isNotEmptyArray: FilterTypes.isArray;
  isNotEmptyArrayStrict: FilterTypes.isArray;
  isFunction: FilterTypes.isFunction;
  isEventEmitter: FilterTypes.isTyped<EventEmitter>;
  isEmptyObject: FilterTypes.isEmptyObject;
  isNotEmptyObject: FilterTypes.isObjectStrict<{}>;
}

type ITypeOtherFilters = {
  [K in Exclude<keyof typeof typeUtilsBase, keyof ITypeMetaFilters>]: FilterGenerator<any>
}
interface ITypeFilters extends ITypeMetaFilters, ITypeOtherFilters { }

// const t: IsBaseType<any, 'string', false> = null
interface ITypeFiltersBase extends ITypeMetaFilters {
  isNumberFilter: FilterGenerator<number>;
  isBooleanFilter: FilterGenerator<boolean>;
  isStringFilter: FilterGenerator<string>;
  isNotEmptyStringFilter: FilterGenerator<string>;
  isArrayFilter: FilterGenerator<Array<any>>;
  isObjectFilter: FilterGenerator<{}>;
  isNotEmptyArrayFilter: FilterGenerator<Array<any>>;
  isNotEmptyValueFilter: FilterGenerator<any>;
  isFunctionFilter: FilterGenerator<(...arg: any[]) => any>
}
type Type<T> = T

interface ITypeUtils extends Type<typeof typeUtilsBase> {
  filter: ITypeFiltersBase
}
interface ITypeFilterUtils extends ITypeFiltersBase, ITypeMetaFilters, ITypeOtherFilters { }

// console.log(typeUtils)
var keyTmp: any;



type MultipleExpector<Core = Type<typeof typeUtilsBase>> = {
  [K in keyof Core]: Core[K] & {
    filter: K extends keyof ITypeFilters ? ITypeFilters[K] : FilterGenerator<unknown>,
    not(value: any): boolean;
  };
}

export interface Expector<Core = Type<typeof typeUtilsBase>> extends MultipleExpector {
  filter: ITypeFilters;
  pure: MultipleExpector<Core>;
}

/**
 * @deprecated
 * @beta
 */
export const typeFilterUtils = Constant$.REDUCE<[string, (v: any) => boolean], ITypeFilterUtils>(
  Constant$.ENTRIES(typeUtilsBase),
  function (target, keyAndValue) {
    var execTmp: any = keyAndValue[1];
    execTmp.filter = Constant$.BindArg$$(filterTo, keyAndValue[1]);
    execTmp.not = function () {
      return !execTmp.apply(null, arguments);
    };
    return Constant$.OBJ_ASSIGN(target, {
      [keyTmp = keyAndValue[0]]: execTmp.filter,
      [keyTmp + "Filter"]: execTmp.filter
    });
  },
  {} as any
);


/**
 * 类型断言工具函数集
 * @beta
 */
export const expect$: Expector = Constant$.OBJ_FREEZE(Constant$.OBJ_ASSIGN({}, typeUtilsBase as any, {
  filter: typeFilterUtils,
  pure: Constant$.OBJ_FREEZE(typeUtilsBase)
}));

/**
 * @beta
 * @deprecated
 * {@inheritDoc expect$}
 */
export const typeUtils: ITypeUtils = expect$ as any

export namespace TypeUtils {
  export const isArray = typeUtils.isArray;
}
// typeFilterUtils.isObjectFilter<number>({}, [])
// typeFilterUtils.isNumberFilter<number>({})
// typeFilterUtils.isArrayFilter<number>({})
// typeFilterUtils.isArrayFilter({})
// typeFilterUtils.isNotEmptyValueFilter({})
// typeFilterUtils.isNotEmptyValueFilter<number>({})
// typeFilterUtils.isStringFilter({})
// typeFilterUtils.isNotEmptyStringFilter('')
