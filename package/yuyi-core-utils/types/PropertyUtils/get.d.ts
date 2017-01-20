/**
 * @module PropertyUtils
 * Gets the property value at path of object. If the resolved value is undefined the defaultValue is used
 * in its place.
 *
 * @param object The object to query.
 * @param path The path of the property to get.
 * @param defaultValue The value returned if the resolved value is undefined.
 * @return Returns the resolved value.
 *
 * @see _.get
 */
import get from 'lodash/get';
import { NumericDictionary, PropertyPath } from 'lodash';
export declare namespace Lodash {
    /**
     * @see _.get
     */
    function get<TObject extends object, TKey extends keyof TObject>(object: TObject, path: TKey | [TKey]): TObject[TKey];
    /**
     * @see _.get
     */
    function get<TObject extends object, TKey extends keyof TObject>(object: TObject | null | undefined, path: TKey | [TKey]): TObject[TKey] | undefined;
    /**
     * @see _.get
     */
    function get<TObject extends object, TKey extends keyof TObject, TDefault>(object: TObject | null | undefined, path: TKey | [TKey], defaultValue: TDefault): Exclude<TObject[TKey], undefined> | TDefault;
    /**
     * @see _.get
     */
    function get<T>(object: NumericDictionary<T>, path: number): T;
    /**
     * @see _.get
     */
    function get<T>(object: NumericDictionary<T> | null | undefined, path: number): T | undefined;
    /**
     * @see _.get
     */
    function get<T, TDefault>(object: NumericDictionary<T> | null | undefined, path: number, defaultValue: TDefault): T | TDefault;
    /**
     * @see _.get
     */
    function get<TDefault>(object: null | undefined, path: PropertyPath, defaultValue: TDefault): TDefault;
    /**
     * @see _.get
     */
    function get(object: null | undefined, path: PropertyPath): undefined;
    /**
     * @see _.get
     */
    function get(object: any, path: PropertyPath, defaultValue?: any): any;
    const get: any;
}
export { get };
