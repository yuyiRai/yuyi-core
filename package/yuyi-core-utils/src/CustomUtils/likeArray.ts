/** @module CustomUtils */

import { find, isEqual } from '../LodashExtra';
import { typeUtils } from '@/TypeLib';

namespace CustomUtils {

  /**
   * 判断两个数组是否无序相等
   * @param arr 
   * @param array
   */
  export function likeArray(arr: any[], array: any[]) {
    // if the other array is a falsy value, return
    if (!typeUtils.isArray(array) || !typeUtils.isArray(arr)) {
      return false;
    }
    // compare lengths - can save a lot of time 
    if (arr.length !== array.length) {
      return false;
    }
    for (const v of arr) {
      if (typeUtils.isNil(find(array, (item: any) => isEqual(item, v)))) {
        return false;
      }
    }
    return true;
  }

}

export const likeArray = CustomUtils.likeArray