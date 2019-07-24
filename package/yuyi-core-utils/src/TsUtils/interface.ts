/**
 * @module TsUtils
 * @preferred 
 * 
 * 此评论将用于记录“thing2”模块。
 */

export interface IKeyValueMap<V = any> {
  [key: string]: V;
}

export interface IFunction {
  (...args: any[]): any
}

/**
 * @external
 */
export const interfaces = {}