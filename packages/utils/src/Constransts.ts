// tslint:disable: variable-name

export namespace Constant$ {

  export const ENTRIES = Object.entries
  /**
   * * keyof PropertyDescriptor
   * writable, configurable, value, enumerable
   */
  export enum DefPropDec$ {
    W = 'writable',
    C = 'configurable',
    V = 'value',
    E = 'enumerable'
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
  export var KEY_VAL: 'value' = DefPropDec$.V;
  export var TRUE: true = true;
  export var FALSE: false = false;
  export var UNDEFINED = undefined;
  export var NULL = null;
  export var ARRAY = Array;
  export var IS_ARR = ARRAY.isArray;
  export var FUNCTION = Function;
  export var CALLER = FUNCTION.call
  export var Num = Number;
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


  export function BIND<T extends Function>(Func: T, thisArgs: any, ...args: any[]): T {
    return FUNCTION.bind.call(Func, thisArgs, ...args)
  }
  export function STATIC_BIND<T extends Function>(Func: T, ...args: any[]): T {
    return BIND(Func, null, ...args)
  }


  export type ForFuncCalbackFn<T, K extends TKey, R = void> = (currentValue: T, currentIndex: K, array: T[]) => R
  export type LoopCalbackFn<T, R = void> = ForFuncCalbackFn<T, number, R>

  /**
   * 原生的map循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const MAP = BIND(CALLER, ARRAY[KEY_PROTOTYPE].map) as {
    <T, R = T>(arr: T[], callbackfn: LoopCalbackFn<T, R>, initialValue?: any[]): R[]
  }
  /**
   * 原生的for循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const FOR_EACH = BIND(CALLER, ARRAY[KEY_PROTOTYPE].forEach) as {
    <T>(arr: T[], callbackfn: LoopCalbackFn<T, any>): void;
  }

  /**
   * 原生的for循环改为函数调用
   * @param arr
   * @param callbackfn
   */
  export const FILTER = BIND(CALLER, ARRAY[KEY_PROTOTYPE].filter) as {
    <T>(arr: T[], callbackfn: LoopCalbackFn<T, boolean>): T[];
  }


  /**
   * 原生的reduce改为函数调用
   * @param arr
   * @param callbackfn
   * @param initialValue
   * @example
   * REDUCE([1, 2, 3, 4], (target: any, i: number) => ({ ...target, [i]: i }), {})
   */
  export const REDUCE = BIND(CALLER, ARRAY[KEY_PROTOTYPE].reduce) as {
    <T, R = T>(
      arr: T[],
      callbackfn: (previousValue: R, currentValue: T, currentIndex: number, array: T[]) => R,
      initialValue?: R
    ): R
  }
  /**
   * 原生的push改为函数调用
   * @param arr 目标数组
   * @param elements 新元素
   * @example
   * ARR_PUSH([1, 2, 3, 4], 5, 6, 7)
   */
  export const ARR_PUSH = BIND(CALLER, ARRAY[KEY_PROTOTYPE].push) as {
    <T, E = T>(arr: T[], ...elements: E[]): number
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
