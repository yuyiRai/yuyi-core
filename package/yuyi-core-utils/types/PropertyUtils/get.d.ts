/**
 * @module PropertyUtils
 */
/// <reference types="lodash" />
/**
 * Gets the property value at path of object. If the resolved value is undefined the defaultValue is used
 * in its place.
 * @param object The object to query.
 * @param path The path of the property to get.
 * @param defaultValue The value returned if the resolved value is undefined.
 * @return Returns the resolved value.
 */
export declare function get<TObject extends object, TKey extends keyof TObject>(object: TObject, path: TKey | [TKey]): TObject[TKey];
/**
 * @see lodash.get
 */
export declare function get<TObject extends object, TKey extends keyof TObject>(object: TObject | null | undefined, path: TKey | [TKey]): TObject[TKey] | undefined;
/**
 * @see lodash.get
 */
export declare function get<TObject extends object, TKey extends keyof TObject, TDefault>(object: TObject | null | undefined, path: TKey | [TKey], defaultValue: TDefault): Exclude<TObject[TKey], undefined> | TDefault;
/**
 * @see lodash.get
 */
export declare function get<T>(object: _.NumericDictionary<T>, path: number): T;
/**
 * @see lodash.get
 */
export declare function get<T>(object: _.NumericDictionary<T> | null | undefined, path: number): T | undefined;
/**
 * @see lodash.get
 */
export declare function get<T, TDefault>(object: _.NumericDictionary<T> | null | undefined, path: number, defaultValue: TDefault): T | TDefault;
/**
 * @see lodash.get
 */
export declare function get<TDefault>(object: null | undefined, path: _.PropertyPath, defaultValue: TDefault): TDefault;
/**
 * @see lodash.get
 */
export declare function get(object: null | undefined, path: _.PropertyPath): undefined;
/**
 * @see lodash.get
 */
export declare function get(object: any, path: _.PropertyPath, defaultValue?: any): any;
