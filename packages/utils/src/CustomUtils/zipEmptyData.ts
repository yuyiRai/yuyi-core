/**
 * @module CustomUtils
 */
import { assign, filter, isArray, keys, reduce } from '../LodashExtra';
import { IKeyValueMap } from '../TsUtils';
import { pipe } from "./pipe";
import { typeUtils } from '@/TypeLib';
import { jsxIf } from '@/commonUtils';
import _ from 'lodash'


export function App(param1: App.ParamA): any {
  return param1;
};

export namespace App {
  export type ParamA = number
  export function C() {
    return 1
  }
}


/**
 * 压缩数据结构，清除所有空值
 * 对象为key-value对会删除值为空的key，如果对象为Array会挤掉空的下标，但不会影响下标顺序
 * @param target - 目标对象
 * @param isRemoveRepeat - 是否移除重复的值（浅比较）
 */
export function zipEmptyData<T = any>(target: Array<T | undefined | null>, isRemoveRepeat?: boolean): T[];

export function zipEmptyData<T = any>(target: IKeyValueMap<T | undefined | null>, isRemoveRepeat?: boolean): IKeyValueMap<T>;

export function zipEmptyData<T = any>(target: IKeyValueMap<T | undefined | null> | Array<T | undefined | null>, isRemoveRepeat = true): IKeyValueMap<T> | T[] {
  return isArray(target)
    ? pipe(filter(target, v => typeUtils.isNotEmptyValue(v)), (list: any[]) => jsxIf(isRemoveRepeat, Array.from(new Set(list)), list))
    : reduce<any, any>(filter(keys(target), (k) => typeUtils.isNotEmptyValue(target[k])), (o, key) => assign(o, { [key]: target[key] }), {});
}
