/**
 * @module LodashExtraUtils
 */

import { castArray as castArrayLodash, cloneDeep, isFunction, toString } from 'lodash';
import { isObject } from '.';
import { Constant$ } from '../Constransts';
import { isNotEmptyObject, isNotEmptyValue, isNotNil, typeFilterUtils } from '../TypeLib';
import { stubReturn } from './stub';
// import '@yuyi919/env'


/**
 * 将一个非数组值转换为数组
 * @param value - 输入值
 * @param allowEmpty - 是否允许数组成员为nil（默认为true），false时会过滤掉null或undefined
 * @default
 * @returns 由输入值转化而来的数组
 * @example
 * * 允许为nil时
 * castArray(null)
 * // => [null]
 * 
 * castArray([undefined, null])
 * // => [undefined, null]
 * @remarks 注意，如果不允许空值（allowEmpty为false），即便输入值本身为数组也会进行过滤
 * @example
 * * 不允许为nil时
 * castArray(null, false)
 * // => []
 * 
 * castArray([undefined, null], false)
 * // => []
 */
export function castArray<T = any>(value: T | T[], allowEmpty: boolean | 'strict' = true): T[] {
  return allowEmpty === true
    ? castArrayLodash(value)
    : Constant$.FILTER(castArrayLodash(value), allowEmpty === Constant$.KEY_STRICT ? isNotEmptyValue : isNotNil);
}

export type NotFunction = string | symbol | object | number | boolean

/**
 * 计算用函数
 * @param computedFunc - 计算用函数
 * @param computedArgs - 计算用参数
 * @returns computedFunc(...computedArgs) -> 计算结果
 * @example
 * castComputed((a, b, c) => a + b + c, 1, 2, 3);
 * // => 6
 * @example
 * castComputed(a => a);
 * // => undefined
 */
export function castComputed<T, Args extends any[]>(computedFunc: Type.Function<Args, T>, ...computedArgs: Args): T;
/**
 * 计算用函数（同一性）
 * @param nativeValue - 非函数的值
 * @param args - 可以传入参数不过没用
 * @returns 原值返回
 * @example
 * castComputed(1, 2, 3);
 * // => 1 
 */
export function castComputed<T extends NotFunction>(nativeValue: T, ...args: any[]): T;
export function castComputed<T, Args extends any[]>(functionOrValue: Type.Function<Args, T> | T, ...computedArgs: Args): T {
  return isFunction(functionOrValue) ? (functionOrValue as Type.Function<Args>)(...computedArgs) : functionOrValue
}
/**
 * 将参数转换为function
 * @param withFunction - 参数
 * @param raw - `default: false`是否返回深拷贝的值而非引用值（通常为对象）
 * @returns 
 * 参数类型为`function`时直接返回参数<P/>
 * 其他情况返回一个`function`，这个`function`会返回你的参数
 * @remarks `raw`为`true`时，返回的对象会进行深拷贝（完全解除和原对象的引用）
 */
export function castFunction<T = any>(withFunction?: T, raw = false): Type.Function<any[], T> {
  raw && (withFunction = cloneDeep(withFunction))
  return isFunction(withFunction) ? withFunction : stubReturn.bind(null, withFunction);
}

export function castString(value: any) {
  return typeof value === Constant$.KEY_STR ? value : toString(value)
}

/**
 * 
 * @param objOrArr 
 * @param allowEmpty 
 */
export function castObjectArray(objOrArr: any[], allowEmpty = true): any[] {
  return typeFilterUtils.isArrayFilter(
    objOrArr,
    (allowEmpty ? isObject : isNotEmptyObject)(objOrArr) && [objOrArr],
  ) || []
}

// const oc = typeFilterUtils.isArrayFilter

// const test = oc([] instanceof Function ? [] : 1242, [], Math.min(10, 3), 21)
// const test2 = oc([] instanceof Function ? [] : 12424)
