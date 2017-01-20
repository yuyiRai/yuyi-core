/**
 * @module PropertyUtils
 */
/// <reference types="lodash" />
import 'lodash/get';
import { IKeyValueMap } from 'mobx';
declare const lodash: {
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
/**
 * @platform Web
 * @group PropertyUtils
 */
export declare namespace PropertyUtils {
    /**
     * @see lodash.get
     */
    const get: typeof lodash.get;
    /**
     * @see lodash.set
     */
    const set: typeof lodash.set;
    /**
     * 从对象中提取成员，不存在则新建一个成员（默认为一个空对象）
     * 提取对象逐渐深入，一个对象一次只能提取一个成员（或他的子成员的子成员）
     * @param main 键值对
     * @param proteryNames 属性描述
     * @typeparam V 返回值类型
     *
     * @group PropertyUtils
     * @example
     * const obj = {}
     * const a = getPropertyFieldByCreate(obj, 'a', ['a'], ['a', 'b'])
     *
     * console.log(a) // 'b'
     * console.log(obj) // {"a":{"a":{"a":"b"}}}
     *
     */
    function getPropertyFieldByCreate<V = any>(main: IKeyValueMap, ...proteryNames: PrototeryMatcher[]): V;
    /**
     * 代码解释器，返回getPropertyFieldByCreate解释数组
     * @param keyStr
     * @param defaultValue
     * @return 二维数组
     * @group PropertyUtils
     * @example
     * const matcher = getExpressByStr('a[1].b[0].d', 123)
     * console.log(matcher) // [ ["a", []] , [1, {}] , ["b", []] , [0, {}] , ["d", 123] ]
     */
    function getExpressByStr(keyStr: string, defaultValue: any): PrototeryMatcher[];
    type PrototeryMatcher = string | [string, any];
}
export {};
