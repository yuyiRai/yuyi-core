/// <reference types="lodash" />
/**
 * @module TypeUtils
 */
import { isNumber } from './LodashExtra';
import { EventEmitter } from './EventEmitter';
import { IKeyValueMap, IsBaseType, IsArray, IsObject, IsAny } from './TsUtils';
/**
 * 是否为空或异常值，不包括0
 * 空值: null/undefined/''
 * 异常值: NaN
 * 不包括空对象/空数组
 * @param value
 */
export declare function isEmptyValue(value: any): value is (null | undefined | '');
/**
 * 是否非空且非异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param value
 */
export declare function isNotEmptyValue(value: any): value is (string | number | boolean | object | Function);
export declare function isBooleanOrNumber(value: any): value is (boolean | number);
export declare function isEmptyArray(value: any): value is boolean;
export declare function isNotEmptyArray(value: any): value is any[];
export declare function isNotEmptyArrayStrict(value: any): value is any[];
export declare function isEmptyArrayStrict(value: any): value is any[];
export declare function isEmptyData(value: any): value is any[];
export declare function isNotEmptyData(value: any): boolean;
export declare function isEmptyObject(value: any, checkValue?: boolean): value is {};
export declare function isNotEmptyObject(value: any): value is object;
export declare function isEventEmitter(emitter: any): emitter is EventEmitter;
/**
 * 判断非空字符串
 * @param str
 */
export declare function isNotEmptyString(str: any): str is string;
export declare function isNotFunction(func: any): boolean;
export declare function isNotNaN(v: any): boolean;
export declare function isNilAll(...valueArr: any[]): boolean;
/**
 * @external
 */
export declare const typeUtils: {
    isArrayLike: {
        <T extends {
            __lodashAnyHack: any;
        }>(t: T): boolean;
        (value: (...args: any[]) => any): value is never;
        (value: any): value is {
            length: number;
        };
    };
    isArray: {
        (value?: any): value is any[];
        <T>(value?: any): value is any[];
    };
    isBoolean: (value?: any) => value is boolean;
    isObject: (value?: any) => value is object;
    isNumber: typeof isNumber;
    isString: (value?: any) => value is string;
    isEmptyData: typeof isEmptyData;
    isNotEmptyData: typeof isNotEmptyData;
    isEventEmitter: typeof isEventEmitter;
    isNotEmptyString: typeof isNotEmptyString;
    isFunction: (value: any) => value is (...args: any[]) => any;
    isNil: (value: any) => value is null;
    isDate: (value?: any) => value is Date;
    isNaN: typeof isNaN;
    isNotFunction: typeof isNotFunction;
    isNotNaN: typeof isNotNaN;
    isNilAll: typeof isNilAll;
    isBooleanOrNumber: typeof isBooleanOrNumber;
    isEmptyValue: typeof isEmptyValue;
    isNotEmptyValue: typeof isNotEmptyValue;
    isEmptyArray: typeof isEmptyArray;
    isNotEmptyArray: typeof isNotEmptyArray;
    isEmptyArrayStrict: typeof isEmptyArrayStrict;
    isNotEmptyArrayStrict: typeof isNotEmptyArrayStrict;
    isEmptyObject: typeof isEmptyObject;
    isNotEmptyObject: typeof isNotEmptyObject;
};
export declare type FilterFunction<T = any> = <ST extends (IsBaseType<T, T, (IsArray<T, any, (IsObject<T, any, (IsAny<T, any, T>)>)>)>) = any>(...key: any[]) => (IsBaseType<T, T, (IsArray<T, Array<ST>, (IsObject<T, IsObject<ST, ST, IKeyValueMap<ST>>, (IsAny<ST, T, ST>)>)>)>) | undefined;
export declare function todoFilter(handler: (v: any) => boolean): FilterFunction;
export interface ITypeFilterUtils {
    isNumberFilter: FilterFunction<number>;
    isBooleanFilter: FilterFunction<boolean>;
    isStringFilter: FilterFunction<string>;
    isNotEmptyStringFilter: FilterFunction<string>;
    isArrayFilter: FilterFunction<Array<any>>;
    isObjectFilter: FilterFunction<object>;
    isNotEmptyArrayFilter: FilterFunction<Array<any>>;
    isNotEmptyValueFilter: FilterFunction;
    isFunctionFilter: FilterFunction<(...arg: any[]) => any>;
}
declare type Type<T> = T;
export interface ITypeUtils extends Type<typeof typeUtils>, ITypeFilterUtils {
}
/**
 * @external
 */
export declare const typeFilterUtils: ITypeFilterUtils;
export {};
//# sourceMappingURL=TypeLib.d.ts.map