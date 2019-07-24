/**
 * @module LodashExtraUtils
 */
/** @internal */
import { isEqual as isEqualLodash } from 'lodash'
import { typeFilterUtils } from '../TypeLib'
const ia = typeFilterUtils.isNotEmptyValueFilter

/**
 * 
 * @param valueA 
 * @param valueB 
 * @param noStrict
 */
export function isEqual(valueA: any, valueB: any, noStrict: boolean = false): boolean {
  if (noStrict) {
    return ia(valueA) === ia(valueB) || isEqualLodash(ia(valueA), ia(valueB))
  } else if (valueA === valueB) {
    return true
  }
  return isEqualLodash(valueA, valueB)
}

export namespace isEqual {
  /**
   * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_isequalvalue-other}
   */
  export const _ = isEqualLodash
}