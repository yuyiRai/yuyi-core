import { EventEmitter } from '../EventEmitter';
import { IKeyValueMap, IsAny, IsArray, IsBaseType, IsClasses, IsObject, IsUnknown } from '../TsUtils';
import { FunctionFactory, Constant$ } from '../Constransts';

// tslint:disable: one-variable-per-declaration
// tslint:disable: curly
export function filterTo<Target>(expect: (target: any) => boolean, ...values: any[]): Target | undefined;
export function filterTo<Target>(expect: (target: any) => boolean): Target | void {
  var i = 0, length = arguments.length, v: any;
  while (++i < length)
    if (expect(v = arguments[i])) return v;
  return;
}
filterTo[Constant$.KEY_EXTEND] = function <T>(expect: (value: any) => boolean): FilterFunction<T> {
  return Constant$.BindArg$$(filterTo, expect) as any
}

export declare namespace filterTo {
  var extend: <T>(expect: (value: any) => boolean) => FilterFunction<T>
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
 * 过滤函数类型
 */
export type FilterFunction<Target> = <Expect extends (
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

export namespace FilterFunction {

  export type isNumber = FilterFunction<number>

  export type isBoolean = FilterFunction<boolean>

  export type isString = FilterFunction<string>

  export type isArray = FilterFunction<Array<any>>

  export type isObject = FilterFunction<object>

  export type isFunction = FilterFunction<FunctionFactory.Base>

  export type isEmptyObject = FilterFunction<Record<string, never>>

  export type isObjectStrict<T extends {}> = FilterFunction<T>

  export type isTyped<T> = FilterFunction<T>

}
