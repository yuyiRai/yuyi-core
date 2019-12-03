import { find, isEqual } from '../LodashExtra';
import { typeUtils } from '../TypeLib';

/**
 * 判断两个数组是否相似
 * @param array - 原数组
 * @param other - 比较数组
 * @remarks 
 * # **注意** 
 * 该方法的比较是相似而非相等
 */
export function likeArray(array: any[], other: any[]) {
  // if the other array is a falsy value, return
  if (
    !typeUtils.isArray(other) || !typeUtils.isArray(array) ||
    // compare lengths - can save a lot of time 
    array.length !== other.length
  ) {
    return false;
  }
  for (const v of array) {
    if (typeUtils.isNil(find(other, (item: any) => isEqual(item, v)))) {
      return false;
    }
  }
  return true;
}
