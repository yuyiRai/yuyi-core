/** 
 * @module PropertyUtils
 */

import { includes, reduce, isObject, isString } from '@/LodashExtra';
import { IKeyValueMap } from '../TsUtils/interface';
import { isEmptyValue, isNotEmptyArray } from '@/TypeLib';

/**
 * 从对象中提取成员，不存在则新建一个成员（默认为一个空对象）
 * 提取对象逐渐深入，一个对象一次只能提取一个成员（或他的子成员的子成员）
 * @param main - 键值对
 * @param proteryNames - 属性描述
 * @typeParam V - 返回值类型
 * 
 * @group PropertyUtils
 * @example 
 * ```ts
 * const obj = {}
 * const a = getPropertyFieldByCreate(obj, 'a', ['a'], ['a', 'b'])
 * 
 * console.log(a) // 'b'
 * console.log(obj) // {"a":{"a":{"a":"b"}}}
 * ```
 * 
 */
export function getPropertyFieldByCreate<V = any>(main: IKeyValueMap, ...proteryNames: PrototeryMatcher[]): V {
  return reduce(proteryNames, function (final, next, index, list) {
    if (isString(next)) {
      const keyName: string = next;
      if (isEmptyValue(final[keyName])) {
        final[keyName] = {};
      }
      return final[keyName];
    }
    if (!isObject(next)) {
      return undefined;
    } else if (isNotEmptyArray(next)) {
      const [keyName, defaultValue] = next;
      if (isEmptyValue(final[keyName])) {
        final[keyName] = (defaultValue === undefined ? (index < list.length - 1 ? {} : undefined) : defaultValue);
      }
      return final[keyName];
    } else {
      return undefined;
    }
  }, main);
}

/**
 * 代码解释器，返回getPropertyFieldByCreate解释数组
 * @param keyStr
 * @param defaultValue
 * @returns 二维数组
 * @group PropertyUtils
 * @example
 * ```ts
 * const matcher = getExpressByStr('a[1].b[0].d', 123) 
 * console.log(matcher) // [ ["a", []] , [1, {}] , ["b", []] , [0, {}] , ["d", 123] ]
 * ```
 */
export function getExpressByStr(keyStr: string, defaultValue: any): PrototeryMatcher[] {
  const paramList: string[][] = [
    ...((keyStr.match as any)(/(.*?)\.|(.*?)\[(.*)\]|(.+?)$/ig, ''))
  ].map((i: string) => i.split(/\[|\]|\[\]|\./ig).filter((i: string) => !includes(['', '.'], i)));
  return reduce<any[], any[]>(paramList, (list, [prototeryName, ...indexList], reduceIndex: number, reduceList) => {
    return list.concat([
      [prototeryName, indexList.length > 0 ? [] : (reduceIndex < reduceList.length - 1 ? {} : defaultValue)],
      ...indexList.map((i, index) => {
        // tslint:disable-next-line: radix
        return [parseInt(i), (index < indexList.length - 1 ? [] : ((index === indexList.length - 1 && reduceIndex === reduceList.length - 1) ? defaultValue : {}))];
      })
    ]);
  }, []);
}

/**
 * @external
 */
export type PrototeryMatcher = string | [string, any];