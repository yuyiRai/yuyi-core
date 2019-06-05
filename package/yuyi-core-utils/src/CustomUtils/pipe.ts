/**
 * @module CustomUtils
 */
import { reduce } from 'lodash';
import Utils from '../';
/**
 * 管道
 * @param data
 * @param funcArr
 */
export function pipe(data: any, ...funcArr: any[]) {
  return reduce(funcArr, (value, func) => (Utils.isFunctionFilter(func) || Utils.stubFunction)(value), data);
}
