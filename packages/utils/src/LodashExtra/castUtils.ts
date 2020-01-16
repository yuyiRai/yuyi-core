/**
 * @module LodashExtraUtils
 */

import { castArray as castArrayLodash, cloneDeep, toString } from 'lodash';
import { Constant$ } from '../Constransts';
import { isFunction } from './isFunction';
import { isNotEmptyValue, isNotNil } from './isNil';
import { isObject, isNil } from './lodash';
import { KeyOf, BaseType } from '../TsUtils'
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

/**
 * 转化一个对象为object
 * 如果对象不是object，则返回一个嵌入指定key的新对象
 * 可选第三个参数，判断条件变更为是否存在指定key的对象
 * @param target 
 * @param keyInObject 嵌入的key
 * @param checkRequired 判定时key是否必须存在
 * @example
 * const t = { a: 1, b: 2 }
 * castObject(t, 'c')
 * //=> { a: 1, b: 2 }
 * @example //! checkRequired的场合
 * castObject(t, 'c', true)
 * //=> { c: { a: 1, b: 2 } }
 */
export function castObject<T, K extends KeyOf<T> | string>(target: T | BaseType, keyInObject: K, checkRequired = false): Exclude<T, BaseType> & {
  [Key in K]: T extends object ? (K extends KeyOf<T> ? T[K] : unknown) : unknown
} {
  return isObject(target) && (!checkRequired || (keyInObject in target)) ? target : { [keyInObject]: target } as any
}
// const t = { a: 1, b: 2 };
// castObject(t, 'c')

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
 * 计算用管道函数，如果非函数则传递值自身
 * @param func
 * @param value 
 */
export function castComputedPipe<V, T = V>(func: Type.Function<[V], T> | T, value: V): T {
  return func instanceof Function ? (func as Type.Function<[V]>)(value) : value;
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
  return Constant$.IS_ARR(
    objOrArr
  ) ? objOrArr : (
      (allowEmpty ? isObject(objOrArr) : Constant$.OBJ_KEYS(objOrArr).length) && [objOrArr] || []
    )
}

// const oc = typeFilterUtils.isArrayFilter

// const test = oc([] instanceof Function ? [] : 1242, [], Math.min(10, 3), 21)
// const test2 = oc([] instanceof Function ? [] : 12424)
