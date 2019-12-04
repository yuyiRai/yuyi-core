// tslint:disable: variable-name

declare global {
  namespace NodeJS {
    interface Global {
      __DEV__?: boolean;
    }
  }
}
var __DEV__ = process.env.NODE_ENV === 'development'
if (__DEV__) {
  global.__DEV__ = true
}

export namespace FunctionFactory {
  export type Base<Args extends any[] = any[], Result = any> = (...args: Args) => Result;

  export type ReturnType<F> = F extends Base<any, infer R> ? R : any;

  export type Bind1<A, Args extends any[] = [], Result = any> = (a: A, ...args: Args) => Result;
  export type Bind2<A, B, Args extends any[] = [], Result = any> = (a: A, b: B, ...args: Args) => Result;
  export type Bind3<A, B, C, Args extends any[] = [], Result = any> = (a: A, b: B, c: C, ...args: Args) => Result;

  export type Arg0<T> = T extends Bind1<infer T, any[]> ? T : any;
  export type Arg1<T> = T extends Bind2<any, infer T, any[]> ? T : any;
  export type Arg2<T> = T extends Bind3<any, any, infer T, any[]> ? T : any;

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
  export var KEY_PROPERTY: 'property' = 'property';
  export var KEY_PROTOTYPE: 'prototype' = 'prototype'
  export var KEY_NUM: 'number' = 'number';
  export var KEY_STR: 'string' = 'string';
  export var KEY_BOOL: 'boolean' = 'boolean';
  export var KEY_FUNC: 'function' = 'function';
  export var KEY_OBJ: 'object' = 'object';
  export var KEY_VAL: 'value' = DefPropDec$$.V;
  export var TRUE: true = true;
  export var FALSE: false = false;
  export var UNDEFINED = undefined;
  export var NULL = null;
  export var ARRAY = Array;
  export var IS_ARR = ARRAY.isArray;
  export var FUNCTION = Function;
  export var CALLER = FUNCTION.call
  export var Num = Number;
  export var REGEXP = RegExp;
  // tslint:disable-next-line: variable-name
  export var OBJECT = Object;
  export var EMPTY_OBJECT = OBJECT.seal(OBJECT.create(null))
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
  export var PARSE_FLOAT = parseFloat
  export var PARSE_INT = parseInt


  export function BIND<T extends FunctionFactory.Base<[any, ...any[]], any>,
    TA,
    R extends T extends (thisArgs: any, ...other: infer K) => infer Re ? FunctionFactory.Base<K, Re> : Function
  >(Func: T, thisArgs: TA, ...args: any[]): R {
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


  export type ForFuncCalbackFn<T, K extends TKey, R = void> = (currentValue: T, currentIndex: K, array: T[]) => R
  export type LoopCalbackFn<T, R = void> = ForFuncCalbackFn<T, number, R>

  /**
   * 原生的map循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const MAP = INSTANCE_BIND(ARRAY, 'map') as {
    <T extends any, R = T>(arr: T[], callbackfn: LoopCalbackFn<T, R>, initialValue?: any[]): R[]
  }
  // MAP()
  /**
   * 原生的Array.prototype.some改为函数调用
   * @param arr
   * @param callbackfn
   * @param thisArg
   */
  export const SOME = INSTANCE_BIND(ARRAY, 'some') as {
    <T extends any>(arr: T[], callbackfn: LoopCalbackFn<T, boolean>, thisArg?: any): boolean
  }
  /**
   * 原生的for循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const FOR_EACH = INSTANCE_BIND(ARRAY, 'forEach') as {
    <T extends any>(arr: T[], callbackfn: LoopCalbackFn<T, any>): void;
  }

  /**
   * 原生的for循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const FILTER = INSTANCE_BIND(ARRAY, 'filter') as {
    <T extends any>(arr: T[], callbackfn: LoopCalbackFn<T, boolean>): T[];
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

  export const delay$$ = setTimeout;

  /**
   *
   * @param arr
   * @param callbackfn
   */
  export function MAP$$<T, R>(arr: T[], callbackfn: LoopCalbackFn<T, R>): R[]
  export function MAP$$<T, R>(arr: T[], callbackfn: LoopCalbackFn<T, R>, initialValue = [], i: number = 0, length = arr.length - 1) {
    initialValue[i] = callbackfn(arr[i], i, arr)
    // @ts-ignore
    return i < length ? MAP$$(arr, callbackfn, initialValue, i + 1, length) : initialValue
  }


  /**
   *
   * @param arr
   * @param callbackfn
   */
  export function FOR_EACH$$<T>(arr: T[], callbackfn: LoopCalbackFn<T, any>): true {
    var tmp = { i: 0 }
    var length = arr.length - 1
    try {
      return FOR_EACH_P$$(arr, callbackfn, tmp, length)
    } catch (error) {
      while (length - tmp.i++) callbackfn(arr[tmp.i], tmp.i, arr)
      return true
    }
  }
  export function FOR_EACH_P$$<T>(arr: T[], callbackfn: LoopCalbackFn<T, any>, tmp: { i: number }, length: number) {
    callbackfn(arr[tmp.i], tmp.i, arr)
    // console.trace('test')
    // @ts-ignore
    return tmp.i++ < length ? FOR_EACH_P$$(arr, callbackfn, tmp, length) : true
  }
}

declare global {
  type ConstructorType<T, Args extends any[] = [any?, any?, ...any[]]> = {
    new(...args: Args): InstanceType<new (...args: any) => T>
  }
  type TKey = string | number | symbol
  type IKeyValueMap<V = any, K extends TKey = TKey> = Record<K, V>
  var K$: typeof Constant$;
}

// @ts-ignore
// tslint:disable-next-line: no-eval
// K$ = eval('Constant$')
