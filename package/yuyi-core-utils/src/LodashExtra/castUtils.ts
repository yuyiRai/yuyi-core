/**
 * @module LodashExtraUtils
 */

import { castArray as castArrayLodash, isFunction, toString, isString } from 'lodash';
import { typeUtils, typeFilterUtils } from '../TypeLib';
import 'yuyi-core-env'

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
 * 
 * @example
 * ```
 * castComputed((a, b, c) => a + b + c, 1, 2, 3);
 * // => 6
 * 
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
 * 
 * @example
 * ```
 * castComputed(1, 2, 3);
 * // => 1 
 * ```
 */
export function castComputed<T extends NotFunction>(nativeValue: T, ...args: any[]): T;
export function castComputed<T, Args extends any[]>(functionOrValue: Type.Function<Args, T> | T, ...computedArgs: Args): T {
  return isFunction(functionOrValue) ? (functionOrValue as Type.Function<Args>)(...computedArgs) : functionOrValue
}
/**
 * 将输入值转换为function返回
 * @param withFunction - 输入值
 * @returns 输入值类型为function时直接返回输入值，其他情况返回一个function，这个function返回你的输入值
 * @remarks 如果传入值
 */
export function castFunction<T = any>(withFunction: T): Type.Function<any[], T> {
  return isFunction(withFunction) ? withFunction : function () { return withFunction; };
}

export function castString(value: any) {
  return isString(value) ? value : toString(value)
}


export function castObjectArray(objOrArr: any[], allowEmpty = true): any[] {
  return typeFilterUtils.isArrayFilter(
    objOrArr,
    allowEmpty
      ? typeUtils.isObject(objOrArr) && [objOrArr]
      : typeUtils.isNotEmptyObject(objOrArr) && [objOrArr],
  ) || []
}