/**
 * @module LodashExtraUtils
 */
/** @internal */
import { isEqual as isEqualLodash } from 'lodash'
import { typeFilterUtils } from '../TypeLib'
const ia = typeFilterUtils.isNotEmptyValueFilter

declare interface isEqual {
  _: typeof isEqualLodash
}
isEqual._ = isEqualLodash

/**
 * 深比较两个值是否相等
 * @param value - 比较值
 * @param other - 另一个值
 * @param noStrict - 启用非严格模式(默认为false)，null和undefined视为相等
 * @returns 如果两个值完全相同，那么返回true，否则返回false。
 * @example
 * ```ts
 * const object = { 'a': 1 };
 * const other = { 'a': 1 };
 * 
 * LodashExtraUtils.isEqual(object, other);
 * // => true
 * object === other;
 * // => false
 * ```
 * @remarks 
 * > NOTE:
 * # **注意**.
 * 这个方法支持比较 arrays, array buffers, booleans, date objects, error objects, maps, numbers, Object objects, regexes, sets, strings, symbols, 以及 typed arrays. Object 对象值比较自身的属性，不包括继承的和可枚举的属性。 不支持函数和DOM节点比较。
 */
export function isEqual(value: any, other: any, noStrict: boolean = false): boolean {
  if (noStrict) {
    return ia(value) === ia(other) || isEqualLodash(ia(value), ia(other))
  } else {
    return isEqualLodash(value, other)
  }
}

/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_isequalvalue-other}
 */
export { isEqualLodash }