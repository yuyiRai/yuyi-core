/**
 * @module LodashExtraUtils
 */

import { IKeyValueMap } from '../TsUtils';
import { reduce, List } from 'lodash';
import { Constant$ } from '../Constransts';

export { reduce }

export type ReduceMapObjectIterator<TSource = any, Result = TSource[keyof TSource], TResult = {
  [K in keyof TSource]?: Result;
}> = (curr: TSource[keyof TSource], key: keyof TSource, source: TSource, prev: TResult) => TResult;

/**
 * 近似_.map，callback需返回一个Object，最后将所有返回的Object组合为一个Object
 * @param collection
 * @param callback
 * @param accumulator 基于预先存在的Object
 * @remarks see:  _.reduce
 * @remarks see:  _.map
 */
export function reduceMap<T, Result extends IKeyValueMap, TResult = {
  [K in keyof T]?: Result;
}>(
  collection: List<T> | T[] | null | undefined,
  callback: ReduceMapObjectIterator<List<T> | T[] | null | undefined, Result, TResult>,
  accumulator?: TResult
): TResult;

/**
 * @remarks see:  _.reduce
 */
export function reduceMap<T extends IKeyValueMap, Result = any, TResult = {
  [K in keyof T]?: Result;
}>(collection: T | null | undefined, callback: ReduceMapObjectIterator<T, Result, TResult>, accumulator?: TResult): TResult;
export function reduceMap(a: any, b: any, c?: any): any {
  return Constant$.REDUCE(a, (obj, v, key, list) => Constant$.OBJ_ASSIGN(obj, b(v, key, list, obj)), c || {});
}
