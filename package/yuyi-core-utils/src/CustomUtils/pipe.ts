/**
 * @module CustomUtils
 */

import { reduce, stubFunction } from '../LodashExtra';
import { typeFilterUtils } from '../TypeLib'
/**
 * 管道
 * @param data
 * @param funcArr
 */
export function pipe(data: any, ...funcArr: any[]) {
  return reduce(funcArr, (value, func) => (typeFilterUtils.isFunctionFilter(func) || stubFunction)(value), data);
}
