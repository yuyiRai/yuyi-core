/**
 * @module LodashExtraUtils
 */
/** @external */
// import { isNaN } from 'lodash';
import isNumberLodash from 'lodash/isNumber';


const _ = { isNumber: isNumberLodash }
/**
 * Checks if value is classified as a Number primitive or object.
 * Note: To exclude Infinity, -Infinity, and NaN, which are classified as numbers, use the _.isFinite method.
 * @param value — The value to check.
 * @param allowNaN 
 * @returns — Returns true if value is correctly classified, else false.
 */
function isNumberAuto(value: any, allowNaN: boolean = false): value is number {
  // return isNumberLodash(value) && (allowNaN || !isNaN(value));
  return (allowNaN || !isNaN(value)) && _.isNumber(value);
}

function isNumber(value: any, allowNaN: boolean = false): value is number {
  return allowNaN ? isNumberOrNaN(value) : isNumberStrict(value)
}
function isNumberOrNaN(value: any): value is number {
  return typeof value === 'number';
}
function isNumberStrict(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export { isNumber, isNumberAuto, isNumberStrict, isNumberOrNaN }

/**
 * @remarks see:  {@link https://www.lodashjs.com/docs/latest#_isequalvalue-other}
 */
export { isNumberLodash };