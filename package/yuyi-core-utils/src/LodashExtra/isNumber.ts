/**
 * @module LodashExtraUtils
 */
/** @external */
import { isNaN } from 'lodash';
import isNumberLodash from 'lodash/isNumber';

/**
 * Checks if value is classified as a Number primitive or object.
 * Note: To exclude Infinity, -Infinity, and NaN, which are classified as numbers, use the _.isFinite method.
 * @param value — The value to check.
 * @param allowNaN 
 * @returns — Returns true if value is correctly classified, else false.
 */
export function isNumber(value: any, allowNaN?: boolean): value is number {
  return isNumberLodash(value) && (allowNaN || !isNaN(value));
}
export namespace isNumber {
  /**
   * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_isequalvalue-other}
   */
  export const _ = isNumberLodash
  /**
   * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_isequalvalue-other}
   */
  export const _NaN = isNaN
}