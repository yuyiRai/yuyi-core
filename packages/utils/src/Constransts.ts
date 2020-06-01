// tslint:disable: variable-name

declare global {
  namespace NodeJS {
    // @ts-ignore
    interface Global {
      __DEV__: boolean;
    }
  }
}

export type LoopIterator<T, K extends TKey, TResult = void> = (currentValue: T, currentIndex: K, array: T[]) => TResult
export type ArrayIterator<T, TResult = void> = LoopIterator<T, number, TResult>

export namespace FunctionFactory {
  export type Base<Args extends any[] = any[], Result = any> = (...args: Args) => Result;

  export type ReturnType<F, Default = any> = F extends Base<any, infer R> ? R : Default;

  export type Bind1<A, Args extends any[] = [], Result = any> = (a: A, ...args: Args) => Result;
  export type Bind2<A, B, Args extends any[] = [], Result = any> = (a: A, b: B, ...args: Args) => Result;
  export type Bind3<A, B, C, Args extends any[] = [], Result = any> = (a: A, b: B, c: C, ...args: Args) => Result;

  export type Arg0<T> = T extends Bind1<infer T, any[]> ? T : any;
  export type Arg1<T> = T extends Bind2<any, infer T, any[]> ? T : any;
  export type Arg2<T> = T extends Bind3<any, any, infer T, any[]> ? T : any;
  export type ExtractArgs<T, Default = []> = T extends (...args: infer Args) => any ? Args : Default;

  export type Shift1<T, A> = T extends Bind1<A, infer Args, infer Re> ? Base<Args, Re> : Function
  export type Shift2<T, A, B> = T extends Bind2<A, B, infer Args, infer Re> ? Base<Args, Re> : Function
  export type Shift3<T, A, B, C> = T extends Bind3<A, B, C, infer Args, infer Re> ? Base<Args, Re> : Function


  // export type Bind<BindArgs extends any[], Args extends any[] = [], Result = any> = ((binds: BindArgs, ...args: Args) => Result);
  // export interface ShiftAuto<T, A = any, B = any, C = any, Re = ReturnType<T>> {
  //   <Args extends T extends Bind<[A], infer Args> ? Args : any[]>(...args: Args): Re
  //   <Args extends T extends Bind<[A, B], infer Args> ? Args : any[]>(...args: Args): Re
  //   <Args extends T extends Bind<[A, B, C], infer Args> ? Args : any[]>(...args: Args): Re
  // }
  // export type Shift<T, A extends any[]> = T extends Bind<A, infer Args, infer Re> ? Base<Args, Re> : Function
}
// var global = window;

export namespace Constant$ {

  export const ENTRIES = Object.entries
  /**
   * * keyof PropertyDescriptor
   * writable, configurable, value, enumerable
   */
  export enum DefPropDec$$ {
    W = 'writable',
    C = 'configurable',
    V = 'value',
    E = 'enumerable',
    G = 'get',
    S = 'set'
  };
  export var KEY_PREFIX_INJECT: '__$$_' = '__$$_'
  export var KEY_STRICT: 'strict' = 'strict'
  export var KEY_CONSTRUCTOR: 'constructor' = 'constructor';
  export var KEY_EXTEND: 'extend' = 'extend';
  export var KEY_FILTER: 'filter' = 'filter';
  export var KEY_PROPERTY: 'property' = 'property';
  export var KEY_PROTOTYPE: 'prototype' = 'prototype'
  export var KEY_NUM: 'number' = 'number';
  export var KEY_STR: 'string' = 'string';
  export var KEY_BOOL: 'boolean' = 'boolean';
  export var KEY_FUNC: 'function' = 'function';
  export var KEY_OBJ: 'object' = 'object';
  export var KEY_VAL: 'value' = DefPropDec$$.V;
  export var ARRAY = Array;
  export var IS_ARR = ARRAY.isArray;
  export var FUNCTION = Function;
  export var CALLER = FUNCTION.call
  export var Num = Number;
  export var REGEXP = RegExp;
  // tslint:disable-next-line: variable-name
  export var OBJECT = Object;
  export var KEY_DESIGN_TYPE: "design:type" = "design:type";
  export var KEY_DESIGN_RETURNTYPE: "design:returntype" = "design:returntype"; 
  export var KEY_DESIGN_PARAMTYPES: "design:paramtypes" = "design:paramtypes";
  export var EMPTY_OBJECT = OBJECT.seal(OBJECT.create(null));
	/**
	 * ```ts
	 * Object.keys
	 * ```
	 * */
  export var OBJ_KEYS = OBJECT.keys;
	/** 
	 * ```ts
	 * Object.freeze
	 * ``` 
	 * */
  export var OBJ_FREEZE = OBJECT.freeze;
	/**
	 * ```ts
	 * Object.assign
	 * ```
	 * */
  export var OBJ_ASSIGN = OBJECT.assign;
	/**
	 * ```ts
	 * Object.getOwnPropertyDescriptors
	 * ```
	 * */
  export var OBJ_getOwnPropertyDescriptors$ = OBJECT.getOwnPropertyDescriptors;
	/**
	 * ```ts
	 * Object.defineProperty
	 * ```
	 * */
  export var OBJ_defineProperty$ = OBJECT.defineProperty;
	/**
	 * ```ts
	 * Object.defineProperties
	 * ```
	 * */
  export var OBJ_defineProperties$ = OBJECT.defineProperties;

  const { V, E, C, W } = Constant$.DefPropDec$$
	/**
	 * ```ts
	 * Object.defineProperty
   * writable: true,
   * configurable: true,
   * enumerable: true,
   * value: param
	 * ```
	 * */
  export var OBJ_definePropertyNormal$ = function (target: any, key: Exclude<keyof typeof target, number>, value: any) {
    return OBJECT.defineProperty(target, key, {
      [V]: value, [W]: true, [C]: true, [E]: true
    })
  };
	/**
	 * ```ts
	 * Object.getPrototypeOf
	 * ```
	 * */
  export var OBJ_getPrototypeOf$ = OBJECT.getPrototypeOf;
	/**
	 * ```ts
	 * Object.getOwnPropertyDescriptor
	 * ```
	 * */
  export var OBJ_getOwnPropertyDescriptor$ = OBJECT.getOwnPropertyDescriptor;
	/**
	 * ```ts
	 * Object.getOwnPropertyNames
	 * ```
	 * */

  export var OBJ_getOwnPropertyNames$ = OBJECT.getOwnPropertyNames;
  export var PROMISE = Promise;
  export var CREATE_NEW = Reflect.construct

  export function CREATE_PROMISE<T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T> {
    return CREATE_NEW(PROMISE, [executor])
  }
  export function EMPTY_PROMISE<T = any>(value: T) {
    return PROMISE.resolve(value)
  }
  export var PARSE_FLOAT = parseFloat
  export var PARSE_INT = parseInt


  export function BIND<T extends FunctionFactory.Base<[any, ...any[]], any>,
    TA,
    R extends T extends (thisArgs: any, ...other: infer K) => infer Re ? FunctionFactory.Base<K, Re> : Function
  >(Func: T, thisArgs: TA, ...args: any[]): R {
    // @ts-ignore
    return FUNCTION.bind.call(Func, thisArgs, ...args)
  }

  // tslint:disable-next-line: class-name
  // export type STATIC_BIND<
  //   T extends Function,
  //   Bindex extends any[]
  // > = {
    
  // }
  export function BindArg$$<
    T extends Function,
    A extends FunctionFactory.Arg0<T>
    >(Func: T, arg0: A): FunctionFactory.Shift1<T, A>
  export function BindArg$$<
    T extends Function,
    A extends FunctionFactory.Arg0<T>,
    B extends FunctionFactory.Arg1<T>,
    >(Func: T, arg0: A, arg1: B): FunctionFactory.Shift2<T, A, B>;
  export function BindArg$$<
    T extends Function,
    A extends FunctionFactory.Arg0<T>,
    B extends FunctionFactory.Arg1<T>,
    C extends FunctionFactory.Arg2<T>,
    >(Func: T, arg0: A, arg1: B, arg2: C): FunctionFactory.Shift3<T, A, B, C>;
  export function BindArg$$(Func: any, ...args: any[]): any {
    // @ts-ignore
    return BIND(Func, null, ...args)
  }

  export function CREATE_OBJECT_IS(value: any): (value: any) => boolean {
    return BindArg$$(OBJECT.is, value)
  }

  export interface FunctionArgsShifter<
    T extends Function,
    P extends T['prototype'],
    K extends keyof P
    > {
    <Args extends P[K] extends (arg: infer A) => any ? A : any>(source: P, arg: Args): P[K] extends (...args: any[]) => infer R ? R : any;
  }

  export function INSTANCE_BIND<
    T extends Function,
    P extends T['prototype'],
    K extends keyof P,
  >(instance: T, key: K): FunctionArgsShifter<T, P, K> {
    // @ts-ignore
    return BIND(CALLER, instance[KEY_PROTOTYPE][key])
  }
  export function PROTOTYPE_BIND<
    T extends Function,
    P extends T['prototype'],
    K extends keyof P,
    >(instance: T, key: K): P[K] {
    // @ts-ignore
    return BIND(instance[KEY_PROTOTYPE][key], instance[KEY_PROTOTYPE]);
  }

  /**
   * 原生的map循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const APPLY = (fn: any, args: any[], thisArgs?: any) => fn.apply(thisArgs, args) as {
    <TArgs extends any[], TResult = any, T = any>(source: Function, args: TArgs, thisArgs?: T): TResult
  }
  /**
   * 原生的map循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const MAP = INSTANCE_BIND(ARRAY, 'map') as {
    <T extends any, R = T>(arr: T[], callbackfn: ArrayIterator<T, R>, initialValue?: any[]): R[]
  }

  export function DEFINED_ESMODULE(_exports: any, desc: any) {
    return Object.defineProperty(_exports, "__esModule", desc)
  }
  // MAP()
  /**
   * 原生的Array.prototype.some改为函数调用
   * @param arr
   * @param callbackfn
   * @param thisArg
   */
  export const SOME = INSTANCE_BIND(ARRAY, 'some') as {
    <T extends any>(arr: T[], callbackfn: ArrayIterator<T, boolean>, thisArg?: any): boolean
  }
  /**
   * 原生的for循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const FOR_EACH = INSTANCE_BIND(ARRAY, 'forEach') as {
    <T extends any>(arr: T[], callbackfn: ArrayIterator<T, any>): void;
  };
  /**
   * 原生数组的concat改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const ARR_CONCAT = PROTOTYPE_BIND(ARRAY, 'concat') as {
    <T extends any, A extends any = T>(arr: T[], ...next: A[][]): (A | T)[];
    <T extends any, A extends any = T>(arr: T[], ...next: A[]): (A | T)[];
  };
  /**
   * 原生数组的silce改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const ARR_SLICE = INSTANCE_BIND(ARRAY, 'slice') as {
    <T extends any>(arr: T[], startIndex?: number, endIndex?: number): T[];
    // tslint:disable-next-line: unified-signatures
    <T extends any>(arr: IArguments, startIndex?: number, endIndex?: number): T[]; 
  }
  
  /**
   * 原生的for循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const FILTER = INSTANCE_BIND(ARRAY, 'filter') as {
    <T extends any>(arr: T[], callbackfn: ArrayIterator<T, boolean>): T[];
  }


  /**
   * 原生的reduce改为函数调用
   * @param arr
   * @param callbackfn
   * @param initialValue
   * @example
   * REDUCE([1, 2, 3, 4], (target: any, i: number) => ({ ...target, [i]: i }), {})
   */
  export const REDUCE = INSTANCE_BIND(ARRAY, 'reduce') as {
    <T extends any, R = T>(
      arr: T[],
      callbackfn: (previousValue: R, currentValue: T, currentIndex: number, array: T[]) => R,
      initialValue?: R
    ): R
  }
  /**
   * 原生的Array<T>.push改为函数调用
   * @param arr 目标数组
   * @param elements 新元素
   * @example
   * ARR_PUSH([1, 2, 3, 4], 5, 6, 7)
   */
  export const ARR_PUSH = INSTANCE_BIND(ARRAY, 'push') as {
    <T extends any, E = T>(arr: T[], ...elements: E[]): number
  }

  /**
   * 原生的push改为函数调用
   * @param arr 目标数组
   * @param elements 新元素
   * @example
   * REGEXP_TEST(/123/, '123') // => true
   */
  export const REGEXP_TEST = INSTANCE_BIND(REGEXP, 'test') as {
    (reg: RegExp, str: string): boolean
  }

  export const delay$$ = BIND(setTimeout, null);

  /**
   *
   * @param arr
   * @param callbackfn
   */
  export function MAP$$<T, R>(arr: T[], callbackfn: ArrayIterator<T, R>): R[]
  export function MAP$$<T, R>(arr: T[], callbackfn: ArrayIterator<T, R>, initialValue = [], i: number = 0, length = arr.length - 1) {
    initialValue[i] = callbackfn(arr[i], i, arr)
    // @ts-ignore
    return i < length ? MAP$$(arr, callbackfn, initialValue, i + 1, length) : initialValue
  }


  /**
   *
   * @param arr
   * @param callbackfn
   */
  export function FOR_EACH$$<T>(arr: T[], callbackfn: ArrayIterator<T, any>): true {
    var tmp = { i: 0 }
    var length = arr.length - 1
    try {
      return FOR_EACH_P$$(arr, callbackfn, tmp, length)
    } catch (error) {
      while (length - tmp.i++) callbackfn(arr[tmp.i], tmp.i, arr)
      return true
    }
  }
  function FOR_EACH_P$$<T>(arr: T[], callbackfn: ArrayIterator<T, any>, tmp: { i: number }, length: number) {
    callbackfn(arr[tmp.i], tmp.i, arr)
    // console.trace('test')
    // @ts-ignore
    return tmp.i++ < length ? FOR_EACH_P$$(arr, callbackfn, tmp, length) : true
  }


  //
  export var Key_useDeprecatedSynchronousErrorHandling$$ = 'useDeprecatedSynchronousErrorHandling'
}

export type ConstructorType<T, Args extends any[] = [any?, any?, ...any[]]> = {
  new(...args: Args): InstanceType<new (...args: any) => T>;
};
export type TKey = string | number | symbol;
export type IKeyValueMap<V = any, K extends TKey = TKey> = Record<K, V>
declare global {
  // var K$: typeof Constant$;
  type ConstructorType<T, Args extends any[] = [any?, any?, ...any[]]> = {
    new(...args: Args): InstanceType<new (...args: any) => T>;
  };
  type TKey = string | number | symbol;
  type IKeyValueMap<V = any, K extends TKey = TKey> = Record<K, V>
}

// @ts-ignore
// tslint:disable-next-line: no-eval
// K$ = eval('Constant$')
