/**
 * @module CustomUtils
 */
import { assign, filter, isArray, keys, reduce } from 'lodash';
import Utils from '../';
import { IKeyValueMap } from 'mobx';
import { pipe } from "./pipe";
/**
 * 压缩数据结构，清除所有空值
 * 对象为key-value对会删除值为空的key，如果对象为Array会挤掉空的下标，但不会影响下标顺序
 * @param target 目标对象
 * @param isRemoveRepeat 是否移除重复的值（浅比较）
 */
export function zipEmptyData<T = any>(target: Array<T | undefined | null>, isRemoveRepeat?: boolean): T[];
export function zipEmptyData<T = any>(target: IKeyValueMap<T | undefined | null>, isRemoveRepeat?: boolean): IKeyValueMap<T>;
export function zipEmptyData<T = any>(target: IKeyValueMap<T | undefined | null> | Array<T | undefined | null>, isRemoveRepeat = true): IKeyValueMap<T> | T[] {
  return isArray(target)
    ? pipe(filter(target, v => Utils.isNotEmptyValue(v)), (list: any[]) => Utils.jsxIf(isRemoveRepeat, Array.from(new Set(list)), list))
    : reduce<any, any>(filter(keys(target), (k) => Utils.isNotEmptyValue(target[k])), (o, key) => assign(o, { [key]: target[key] }), {});
}
