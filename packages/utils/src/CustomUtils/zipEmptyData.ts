/**
 * @module CustomUtils
 */
import { Constant$ } from '../Constransts';
import { isNotEmptyValue } from '../LodashExtra';
import { pipe } from "./pipe";
// import _ from 'lodash'


// export function App(param1: App.ParamA): any {
//   return param1;
// };

// export namespace App {
//   export type ParamA = number
//   export function C() {
//     return 1
//   }
// }


/**
 * 压缩数据结构，清除所有空值
 * 对象为key-value对会删除值为空的key，如果对象为Array会挤掉空的下标，但不会影响下标顺序
 * @param target - 目标对象
 * @param isRemoveRepeat - 是否移除重复的值（浅比较）
 */
export function zipEmptyData<T = any>(target: Array<T | undefined | null>, isRemoveRepeat?: boolean): T[];

export function zipEmptyData<T = any>(target: IKeyValueMap<T | undefined | null>, isRemoveRepeat?: boolean): IKeyValueMap<T>;

export function zipEmptyData<T = any>(target: IKeyValueMap<T | undefined | null> | Array<T | undefined | null>, isRemoveRepeat = true): IKeyValueMap<T> | T[] {
  return target instanceof Constant$.OBJECT && (
    Constant$.IS_ARR(target)
    ? pipe(Constant$.FILTER<any>(target, isNotEmptyValue), (list: any[]) => isRemoveRepeat ? Array.from(new Set(list)) : list)
    : Constant$.REDUCE<any, any>(Constant$.FILTER<any>(Constant$.OBJ_KEYS(target), (k) => isNotEmptyValue(target[k])), (o, key) => Constant$.OBJ_ASSIGN(o, { [key]: target[key] }), {})
  ) || target;
}


export function zipEmptyData2<T = any>(target: Array<T | undefined | null>, isRemoveRepeat?: boolean): T[];

export function zipEmptyData2<T = any>(target: IKeyValueMap<T | undefined | null>, isRemoveRepeat?: boolean): IKeyValueMap<T>;

export function zipEmptyData2<T = any>(target: IKeyValueMap<T | undefined | null> | Array<T | undefined | null>, isRemoveRepeat = true): IKeyValueMap<T> | T[] {
  return target instanceof Constant$.OBJECT && (
    Constant$.IS_ARR(target)
      ? pipe(Constant$.FILTER<any>(target, isNotEmptyValue), (list: any[]) => isRemoveRepeat ? Array.from(new Set(list)) : list)
      : Constant$.REDUCE<any, any>(Constant$.FILTER<any>(Constant$.OBJ_KEYS(target), (k) => isNotEmptyValue(target[k])), (o, key) => Constant$.OBJ_ASSIGN(o, { [key]: target[key] }), {})
  ) || target;
}
