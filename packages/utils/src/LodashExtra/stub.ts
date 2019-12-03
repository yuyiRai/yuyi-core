/**
 * @module LodashExtraUtils
 */

import { stubArray, stubFalse, stubTrue, stubString, stubObject } from 'lodash'
import { Constant$ } from '../Constransts';

/**
 * 一个静态函数
 * @param args - 任意参数
 * @returns 什么都不会返回
 */
// tslint:disable-next-line: no-empty
export function stubFunction(...args: any[]): undefined {
  return undefined
}
/**
 * 一个只有返回功能的静态函数
 * @param args - 任意参数
 * @returns 传入什么返回什么，如果什么都没传则返回自身
 */
// tslint:disable-next-line: no-empty
export function stubReturn(...args: any[]): typeof stubReturn | typeof args[0]
export function stubReturn(args: any) {
  return args || stubReturn
}

/**
 * 一个静态的不可变空对象
 */
export const emptyObject: object = Constant$.EMPTY_OBJECT

/**
 * 一个静态函数，返回一个对象
 * @returns 一个静态的空对象，多次调用也永远指向同一个内存地址
 */
export function stubObjectStatic() {
  return Constant$.EMPTY_OBJECT;
}

export { stubObject, stubArray, stubFalse, stubTrue, stubString }
