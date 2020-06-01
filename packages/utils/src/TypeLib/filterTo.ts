import { Constant$, FunctionFactory } from '../Constransts';
import { EventEmitter } from '../EventEmitter';
import { IKeyValueMap, IsAny, IsArray, IsBaseType, IsClasses, IsObject, IsUnknown } from '../TsUtils';

/**
 * 提供一个断言函数和若干个值，以此对这些值进行校验，并返回首个校验通过的值
 * @param expect - 断言函数
 * @param values - @rest 需要校验的值
 * @returns 首个通过校验的值，如果全都未通过则返回undefined
 */
export function filterTo<Target>(expect: (target: any) => boolean, ...values: any[]): Target | undefined;
export function filterTo<Target>(expect: (target: any) => boolean): Target | void {
  var i = 0, length = arguments.length, v: any;
  while (++i < length)
    if (expect(v = arguments[i])) return v;
  return;
}
// @ts-ignore
filterTo[Constant$.KEY_EXTEND] = function <T>(expect: (value: any) => boolean): FilterGenerator<T> {
  return Constant$.BindArg$$(filterTo, expect) as any
}

/**
 * @param expect 断言函数
 * @returns 返回一个断言Filter函数
 */
export function extendToFilter<T>(expect: (value: any) => boolean): FilterGenerator<T> {
  return Constant$.BindArg$$(filterTo, expect) as any;
}

/**
 * @internal
 */
export declare namespace filterTo {
  // @ts-ignore
  var extend: <T>(expect: (value: any) => boolean) => FilterGenerator<T>;
}

// function filterToExtra<Target>(expect: (target: any) => boolean, ...values: any[]): Target | undefined;
// function filterToExtra<Target>(expect: (target: any) => boolean): Target | void {
//   var i = 0, length = arguments.length, v: any;
//   while (++i < length)
//     if (expect(v = arguments[i])) return v;
//   return;
// }

// export { filterToExtra }

// export type AA = IsArray<any>
/**
 * Filter函数类型生成器
 */
export type FilterGenerator<Target> = <Expect extends (
  IsBaseType<Target, Target, (
    IsArray<Target, any, (
      IsObject<Target, any, (
        IsAny<Target, any, Target>
      )>
    )>
  )>
) = any>(...key: any[]) => (
  // 
  IsArray<Target, Array<Expect>, (
    IsBaseType<Target, IsUnknown<Expect, Target, Expect>, (
      IsUnknown<Target, Expect, (
        // 
        IsObject<Target, (
          IsClasses<Target, Target extends EventEmitter ? EventEmitter<Expect> : Target, (
            IsBaseType<Expect, IKeyValueMap<Expect>, Expect>
          )>
        ), (
            IsUnknown<Expect, Target, Expect>
          )>
      )>
    )>
  )>
  ) | undefined

export namespace FilterTypes {

  export type isNumber = FilterGenerator<number>

  export type isBoolean = FilterGenerator<boolean>

  export type isString = FilterGenerator<string>

  export type isArray = FilterGenerator<Array<any>>

  export type isObject = FilterGenerator<object>

  export type isFunction = FilterGenerator<FunctionFactory.Base>

  export type isEmptyObject = FilterGenerator<Record<string, never>>

  export type isObjectStrict<T extends {}> = FilterGenerator<T>

  export type isTyped<T> = FilterGenerator<T>

}
