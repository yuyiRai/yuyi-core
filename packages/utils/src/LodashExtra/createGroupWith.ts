/**
 * @module LodashExtraUtils
 */

import { reduce } from "lodash";
import { isString } from ".";
import { Constant$ } from "../Constransts";;
import { typeFilterUtils } from "../TypeLib";
import { isFunction } from "./isFunction";

/**
 * 根据条件将一个数组拆分为多个数组
 * @param list - 源数组
 * @param keyOrWith - 分组关键字或方法（返回一个关键字）
 * @typeParam T - 原数组的成员类型（必须为Object）
 * @returns 返回一个新对象
 * @remarks
 * 更复杂的控制参照{@link https://www.lodashjs.com/docs/latest#_groupbycollection-iteratee_identity | Lodash.groupBy}
 */
export function createGroupWith<T extends object = any>(list: T[], keyOrWith: string | ((item: T) => string)): IKeyValueMap<T[]> {
  return reduce(typeFilterUtils.isArrayFilter(list, []), function (map, item) {
    const mapKey = isString(keyOrWith) ? item[keyOrWith] : (isFunction(keyOrWith) ? keyOrWith(item) : "default")
    map[mapKey] = typeFilterUtils.isArrayFilter(map[mapKey], [])
    Constant$.ARR_PUSH(map[mapKey], item)
    return map;
  }, {})
}
