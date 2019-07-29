/**
 * @module LodashExtraUtils
 */

import { castArray as castArrayLodash, cloneDeep, isFunction, toString, isString } from 'lodash';
import { typeUtils, typeFilterUtils } from '../TypeLib';
// import '@yuyi/env'


/**
 * 将一个非数组值转换为数组
 * @param value - 输入值
 * @param allowEmpty - 是否允许数组成员为nil（默认为true），false时会过滤掉null或undefined
 * @default
 * @returns 由输入值转化而来的数组
 * @example
 * 允许为nil时
 * ```
 * castArray(null)
 * // => [null]
 * 
 * castArray([undefined, null])
 * // => [undefined, null]
 * ```
 * @remarks 注意，如果不允许空值（allowEmpty为false），即便输入值本身为数组也会进行过滤
 * @example
 * 不允许为nil时
 * ```
 * castArray(null, false)
 * // => []
 * 
 * castArray([undefined, null], false)
 * // => []
 * ```
 */
export function castArray<T = any>(value: T | T[], allowEmpty = true): T[] {
  return allowEmpty ? castArrayLodash(value) : (typeUtils.isNotEmptyValue(value) ? castArrayLodash(value) : []);
}

export type NotFunction = string | symbol | object | number | boolean

/**
 * 计算用函数
 * @param computedFunc - 计算用函数
 * @param computedArgs - 计算用参数
 * @returns computedFunc(...computedArgs) -> 计算结果
 * @example
 * ```
 * castComputed((a, b, c) => a + b + c, 1, 2, 3);
 * // => 6
 * ```
 * @example
 * ```
 * castComputed(a => a);
 * // => undefined
 * ```
 */
export function castComputed<T, Args extends any[]>(computedFunc: Type.Function<Args, T>, ...computedArgs: Args): T;
/**
 * 计算用函数（同一性）
 * @param nativeValue - 非函数的值
 * @param args - 可以传入参数不过没用
 * @returns 原值返回
 * @example
 * ```
 * castComputed(1, 2, 3);
 * // => 1 
 * ```
 */
export function castComputed<T extends NotFunction>(nativeValue: T): T;
export function castComputed<T, Args extends any[]>(functionOrValue: Type.Function<Args, T> | T, ...computedArgs: Args): T {
  return isFunction(functionOrValue) ? (functionOrValue as Type.Function<Args>)(...computedArgs) : functionOrValue
}
/**
 * 将输入值转换为function
 * @param withFunction - 输入值
 * @param deepClone - `default: false`对于对象，是否返回深拷贝
 * @returns 
 * 输入值类型为`function`时直接返回输入值<P/>
 * 其他情况返回一个`function`，这个`function`会返回你的输入值
 * @remarks `deepClone`为`true`时，返回的对象会解除和原对象的引用
 */
export function castFunction<T = any>(withFunction?: T, deepClone = false): Type.Function<any[], T> {
  if (deepClone) {
    withFunction = cloneDeep(withFunction)
  }
  return isFunction(withFunction) ? withFunction : function () { return withFunction; };
}

export function castString(value: any) {
  return isString(value) ? value : toString(value)
}

/**
 * 
 * @param objOrArr 
 * @param allowEmpty 
 */
export function castObjectArray(objOrArr: any[], allowEmpty = true): any[] {
  return typeFilterUtils.isArrayFilter(
    objOrArr,
    allowEmpty
      ? typeUtils.isObject(objOrArr) && [objOrArr]
      : typeUtils.isNotEmptyObject(objOrArr) && [objOrArr],
  ) || []
}

const oc = typeFilterUtils.isArrayFilter

export const test = oc([] instanceof Function ? [] : 1242, [], Math.min(10, 3), 21)
export const test2 = oc([] instanceof Function ? [] : 12424)