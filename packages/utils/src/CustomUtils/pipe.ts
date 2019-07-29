
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'

/**
 * 管道
 * @param initialValue - 原始值
 * @param funcArr - @rest 函数
 */
export function pipe<T, R>(initialValue: T, ...funcArr: any[]): R {
  return isArray(funcArr) ? funcArr.reduce((value, func) => isFunction(func) ? func(value) : value, initialValue) : initialValue;
}
