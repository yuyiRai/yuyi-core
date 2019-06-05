/**
 * This comment will be printed
 *
 * @module PropertyUtils
 * @preferred
 *
 *
 * This comment will be printed
 *
 *
 */
import { LoDashStatic } from 'lodash';
import { getExpressByStr, getPropertyFieldByCreate } from './getPropertyFieldByCreate';
import { getPropByPath } from './getPropByPath';
declare const PropertyUtils: {
    getPropByPath: typeof getPropByPath;
    getPropertyFieldByCreate: typeof getPropertyFieldByCreate;
    getExpressByStr: typeof getExpressByStr;
    get: {
        <TObject extends object, TKey extends keyof TObject>(object: TObject, path: TKey | [TKey]): TObject[TKey];
        <TObject extends object, TKey extends keyof TObject>(object: TObject, path: TKey | [TKey]): TObject[TKey];
        <TObject extends object, TKey extends keyof TObject, TDefault>(object: TObject, path: TKey | [TKey], defaultValue: TDefault): TDefault | Exclude<TObject[TKey], undefined>;
        <T>(object: import("lodash").NumericDictionary<T>, path: number): T;
        <T>(object: import("lodash").NumericDictionary<T>, path: number): T;
        <T, TDefault>(object: import("lodash").NumericDictionary<T>, path: number, defaultValue: TDefault): T | TDefault;
        <TDefault>(object: null, path: import("lodash").Many<string | number | symbol>, defaultValue: TDefault): TDefault;
        (object: null, path: import("lodash").Many<string | number | symbol>): undefined;
        (object: any, path: import("lodash").Many<string | number | symbol>, defaultValue?: any): any;
    };
    set: {
        <T extends object>(object: T, path: import("lodash").Many<string | number | symbol>, value: any): T;
        <TResult>(object: object, path: import("lodash").Many<string | number | symbol>, value: any): TResult;
    };
};
export interface IPropertyUtils {
    get: LoDashStatic['get'];
    set: LoDashStatic['set'];
    getPropByPath: typeof getPropByPath;
    getPropertyFieldByCreate: typeof getPropertyFieldByCreate;
    getExpressByStr: typeof getExpressByStr;
}
export default PropertyUtils;
/**
 * 123456
 */ 
