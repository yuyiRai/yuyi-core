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
import { get as lodashGet, NumericDictionary, PropertyPath } from 'lodash';

export function get<TObject extends object, TKey extends keyof TObject>(object: TObject, path: TKey | [TKey]): TObject[TKey];
export function get<TObject extends object, TKey extends keyof TObject>(object: TObject | null | undefined, path: TKey | [TKey]): TObject[TKey] | undefined;
export function get<TObject extends object, TKey extends keyof TObject, TDefault>(object: TObject | null | undefined, path: TKey | [TKey], defaultValue: TDefault): Exclude<TObject[TKey], undefined> | TDefault;
export function get<T>(object: NumericDictionary<T>, path: number): T;
export function get<T>(object: NumericDictionary<T> | null | undefined, path: number): T | undefined;
export function get<T, TDefault>(object: NumericDictionary<T> | null | undefined, path: number, defaultValue: TDefault): T | TDefault;
export function get<TDefault>(object: null | undefined, path: PropertyPath, defaultValue: TDefault): TDefault;
export function get(object: null | undefined, path: PropertyPath): undefined;
export function get(object: any, path: PropertyPath, defaultValue?: any): any;

// tslint:disable-next-line: no-empty
export function get(...a: any[]): any { }
module.exports.get = lodashGet



