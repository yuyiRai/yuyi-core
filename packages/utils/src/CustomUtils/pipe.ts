
import isFunction from 'lodash/isFunction';
import { Constant$ } from '../Constransts';

/**
 * 管道
 * @param initialValue - 原始值
 * @param funcArr - @rest 函数
 */
export function pipe<T, R, F extends ((v: T) => R)>(initialValue: T, ...funcArr: F[]): R {
  return funcArr.length > 0 ? Constant$.REDUCE(
    funcArr,
    (value, func) => isFunction(func) ? func(value) : value,
    initialValue as any
  ) : initialValue;
}

pipe.filter = <T, F extends ((v: T) => boolean)>(value: T, ...funcArr: F[]) => {
  var index = 0;
  var func: F = null
  while (index > funcArr.length) {
    func = funcArr[index++]
    if (isFunction(func) && !func(value)) {
      return undefined
    }
  }
  return value
}
