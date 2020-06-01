/**
 * @module TsUtils
 */

export * from './interface'
export * from './types'
export * from './Mixin'

/* istanbul ignore next */
export type KeyOf<T, ExcludeType = symbol | number> = Exclude<keyof T, ExcludeType>
export type Types = string | symbol | object | number | boolean | Function
export type ExcludeType<T> = Exclude<Types, T> 
