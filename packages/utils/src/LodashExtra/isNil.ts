import { isNil, isString, trim } from './lodash';
import { isNaN } from './isNumber';

export const isNotNil = (v: any) => v !== null && v !== undefined

/**
 * 是否为空或异常值，不包括0
 * 空值: null/undefined/''
 * 异常值: NaN
 * 不包括空对象/空数组
 * @param value
 */
export function isEmptyValue(value: any): value is (null | undefined | '') {
  // console.log('isEmptyValue', value, (isString(value) && trim(value) === ''), isNil(value), isNaN(value))
  return (isString(value) && trim(value) === '') || isNil(value) || isNaN(value);
}

/**
 * 是否非空且非异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param value
 */
export function isNotEmptyValue(value: any): value is (string | number | boolean | object | Function) {
  return !isEmptyValue(value);
}
export { isNil };

