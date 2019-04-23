/// <reference types="lodash" />
import { toJS, IKeyValueMap } from 'mobx';
/**
 * 是否为空或异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param {*} value
 */
export declare function isEmptyValue(value: any): value is '' | null | undefined;
/**
 * 是否非空且非异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param {*} value
 */
export declare function isNotEmptyValue(value: any): boolean;
export declare function isNumber(value: any): value is number;
export declare function isBooleanOrNumber(value: any): value is (boolean | number);
export declare function isEmptyArray(value: any): value is boolean;
export declare function isNotEmptyArray(value: any): value is any[];
export declare function isNotEmptyArrayStrict(value: any): value is any[];
export declare function isEmptyArrayStrict(value: any): value is any[];
export declare function isEmptyData(value: any): value is any[];
export declare function isNotEmptyData(value: any): boolean;
export declare function isEmptyObject(value: any, checkValue?: boolean): value is {};
export declare function isNotEmptyObject(value: any): boolean;
export declare function isEventEmitter(emitter: any): boolean;
export declare const typeUtils: {
    isArrayLike: {
        <T>(value: T & string & number): boolean;
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
    isObject<T extends object>(value?: any): value is T;
    isNumber: typeof isNumber;
    isString: (value?: any) => value is string;
    isEmptyData: typeof isEmptyData;
    isNotEmptyData: typeof isNotEmptyData;
    isEventEmitter: typeof isEventEmitter;
    /**
     * 判断非空字符串
     * @param {*} str
     */
    isNotEmptyString(str: any): boolean;
    isFunction: (value: any) => value is (...args: any[]) => any;
    isNotFunction(func: any): boolean;
    isNil: (value: any) => value is null;
    isNaN: (value?: any) => boolean;
    isNotNaN(v: any): boolean;
    isNilAll(...valueArr: any[]): boolean;
    isBooleanOrNumber: typeof isBooleanOrNumber;
    isEmptyValue: typeof isEmptyValue;
    isNotEmptyValue: typeof isNotEmptyValue;
    isEmptyArray: typeof isEmptyArray;
    isNotEmptyArray: typeof isNotEmptyArray;
    isEmptyArrayStrict: typeof isEmptyArrayStrict;
    isNotEmptyArrayStrict: typeof isNotEmptyArrayStrict;
    isEmptyObject: typeof isEmptyObject;
    isNotEmptyObject: typeof isNotEmptyObject;
    toJS: typeof toJS;
};
export declare type FilterFunction<T = any> = (...key: (any | T)[]) => T | undefined;
export declare type FilterArrayFunction = <T = any>(...key: any[]) => Array<T> | undefined;
export declare type FilterFunctionGroup = IKeyValueMap<FilterFunction>;
export declare function todoFilter(handler: (v: any) => boolean): FilterFunction;
export interface ITypeFilterUtils {
    isNumberFilter: FilterFunction<number>;
    isStringFilter: FilterFunction<string>;
    isNotEmptyStringFilter: FilterFunction<string>;
    isArrayFilter: FilterArrayFunction;
    isObjectFilter: FilterFunction<{
        [key: string]: any;
    }>;
    isNotEmptyArrayFilter: FilterArrayFunction;
    isNotEmptyValueFilter: FilterFunction<boolean | string | number | any>;
    isFunctionFilter: FilterFunction<Function>;
}
/**
 *
 */
export declare const typeFilterUtils: ITypeFilterUtils;
