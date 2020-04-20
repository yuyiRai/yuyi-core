
import isFunction from 'lodash/isFunction';
import { Constant$ } from '../Constransts';
import { castComputedPipe } from '../LodashExtra/castUtils';

/**
 * 管道
 * @param initialValue - 原始值
 * @param funcArr - @rest 函数
 */
export function pipe<T, R, F extends ((v: T) => R)>(initialValue: T, ...funcArr: F[]): R {
  return funcArr.length > 0 ? Constant$.REDUCE(
    funcArr,
    (value, func) => castComputedPipe(func, value),
    initialValue as any
  ) : initialValue;
}
/**
 * 管道
 * @param initialValue - 原始值
 * @param funcArr - @rest 函数
 */
export function pipeTrack<T, R, F extends ((v: T) => R)>(initialValue: T, ...funcArr: F[]): R {
  let last: any;
  return funcArr.length > 0 ? Constant$.REDUCE(
    funcArr,
    (track, func) => {
      last = track[track.length - 1]
      track.push(castComputedPipe(func, last))
      return track
    },
    [initialValue] as any
  ) : [initialValue];
}

pipe.filter = <T>(value: T, ...funcArr: ((v: T) => boolean)[]) => {
  var index = -1;
  var func = null
  while (++index < funcArr.length) {
    func = funcArr[index]
    if (isFunction(func) && !func(value)) {
      return undefined
    }
  }
  return value
}
