/**
 * 
 */

export type IsTargetTyped<TargetType, T, TRUE, FALSE> = T extends TargetType ? TRUE : FALSE
export type IsTargetTypedRe<TargetType, T, TRUE, FALSE> = TargetType extends T ? TRUE : FALSE
/**
 * 对于对象类型判断是否为any的条件类型
 * @typeParam T - Target
 * @typeParam TRUE - Target类型为any时的类型
 * @typeParam FALSE - 除此以外时的类型
 */
export type IsAny<T = unknown, TRUE = true, FALSE = false> = IsTargetTypedRe<unknown, T, TRUE, FALSE>
export type IsArray<T = unknown, TRUE = true, FALSE = false> = IsAny<T, FALSE, T extends Array<any> ? TRUE : FALSE>
export type IsBaseType<T = unknown, TRUE = true, FALSE = false> = IsAny<T, FALSE, T extends (string | number | boolean | Function) ? TRUE : FALSE>
export type IsObject<T = unknown, TRUE = true, FALSE = false> = IsAny<T, FALSE, IsBaseType<T, FALSE, IsArray<T, FALSE, T extends object ? TRUE : FALSE>>>

export type IsTrue<T = unknown, TRUE = true, FALSE = false> = IsTargetTyped<true, T, TRUE, FALSE>
export type IsNil<T = unknown, TRUE = true, FALSE = false> = IsTargetTyped<false | undefined | never, T, TRUE, FALSE>


/**
 * @external
 */
export const types = {}