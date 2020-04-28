/**
 * @module TsUtils
 */

export * from './interface'
export * from './types'
export * from './Mixin'

/* istanbul ignore next */
export type KeyOf<T, ExcludeType = symbol | number> = Exclude<keyof T, ExcludeType>