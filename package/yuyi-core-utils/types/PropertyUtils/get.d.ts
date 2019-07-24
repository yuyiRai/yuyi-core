/// <reference types="lodash" />
/**
 * 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
 * Gets the property value at path of `object`. If the resolved value is undefined the defaultValue is used in its place.
 * @param object 要检索的`对象`。
 * The `object` to query.
 * @param path 要获取属性的`路径`。
 * The `path` of the property to get.
 * @param defaultValue 如果解析值是 `undefined`，该`值`才会被返回。
 * The `value` returned if the resolved value is `undefined`.
 * @returns 返回解析的值。
 * Returns the resolved value.
 *
 * @example
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 * _.get(object, 'a[0].b.c');
 * // => 3
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 *
 * @remarks 这个方法不会改变对象
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue Lodash.get }
 */
export declare function get<TObject extends object, TKey extends keyof TObject>(object: TObject, path: TKey | [TKey]): TObject[TKey];
/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue Lodash.get }
 */
export declare function get<TObject extends object, TKey extends keyof TObject>(object: TObject | null | undefined, path: TKey | [TKey]): TObject[TKey] | undefined;
/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue Lodash.get }
 */
export declare function get<TObject extends object, TKey extends keyof TObject, TDefault>(object: TObject | null | undefined, path: TKey | [TKey], defaultValue: TDefault): Exclude<TObject[TKey], undefined> | TDefault;
/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue Lodash.get }
 */
export declare function get<T>(object: _.NumericDictionary<T>, path: number): T;
/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue Lodash.get }
 */
export declare function get<T>(object: _.NumericDictionary<T> | null | undefined, path: number): T | undefined;
/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue Lodash.get }
 */
export declare function get<T, TDefault>(object: _.NumericDictionary<T> | null | undefined, path: number, defaultValue: TDefault): T | TDefault;
/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue Lodash.get }
 */
export declare function get<TDefault>(object: null | undefined, path: _.PropertyPath, defaultValue: TDefault): TDefault;
/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue Lodash.get }
 */
export declare function get(object: null | undefined, path: _.PropertyPath): undefined;
/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue Lodash.get }
 */
export declare function get(object: any, path: _.PropertyPath, defaultValue?: any): any;
//# sourceMappingURL=get.d.ts.map