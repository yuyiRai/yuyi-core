/**
 * @module LodashExtraUtils
 */

import { stubArray, stubFalse, stubTrue, stubString, stubObject } from 'lodash'

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
 * 一个静态的不可变空对象
 */
export const emptyObject: object = Object.freeze({})

/**
 * 一个静态函数，返回一个对象
 * @returns 一个静态的空对象，多次调用也永远指向同一个内存地址
 */
export function stubObjectStatic() {
  return emptyObject;
}

export { stubObject, stubArray, stubFalse, stubTrue, stubString }