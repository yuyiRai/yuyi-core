/**
 * @module CustomUtils
 */
import { find } from 'lodash';
import Utils from '../';
/**
 * 判断两个数组是否无序相等
 * @param arr 
 * @param array
 */
export function likeArray(arr: any[], array: any[]) {
  // if the other array is a falsy value, return
  if (!Utils.isArray(array) || !Utils.isArray(arr)) {
    return false;
  }
  // compare lengths - can save a lot of time 
  if (arr.length !== array.length) {
    return false;
  }
  for (const v of arr) {
    if (Utils.isNil(find(array, (item: any) => Utils.isEqual(item, v)))) {
      return false;
    }
  }
  return true;
}
