import { Constant$ } from "../Constransts";

// import isNumberLodash from 'lodash/isNumber';

// const native = global.isNaN
export function isNaN(value: any) {
  return typeof value === 'number' && value !== value
}
(global as any).isNaN = isNaN

const { KEY_NUM } = Constant$

// const _ = { isNumber: isNumberLodash }
/**
 * 判断一个值是否为数字
 * @param value — 检查对象
 * @param allowNaN 是否允许NaN(默认不允许)
 * @returns — 返回true/false
 */
function isNumberAuto(value: any, allowNaN: boolean = false): value is number {
  // return isNumberLodash(value) && (allowNaN || !isNaN(value));
  return allowNaN ? isNumberOrNaN(value) : isNumberStrict(value);
}

function isNumber(value: any, allowNaN: boolean = false): value is number {
  return typeof value === KEY_NUM && (allowNaN || value === value)
}
function isNumberOrNaN(value: any): value is number {
  return typeof value === KEY_NUM;
}
function isNumberStrict(value: any): value is number {
  return typeof value === KEY_NUM && !isNaN(value);
}

export { isNumber, isNumberAuto, isNumberStrict, isNumberOrNaN }
