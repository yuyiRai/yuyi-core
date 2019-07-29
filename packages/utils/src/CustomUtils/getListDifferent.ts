/**
 * @module CustomUtils
 */
import { differenceWith, isEqual } from '../LodashExtra';
export function getListDifferent(listA: any[], listB: any[], deep = false) {
  return {
    push: differenceWith(listB, listA, deep ? ((a, b) => isEqual(a, b)) : []),
    pull: differenceWith(listA, listB, deep ? ((a, b) => isEqual(a, b)) : [])
  };
}
