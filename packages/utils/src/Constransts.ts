// tslint:disable: variable-name

type ConstructorType<T, Args extends any[] = [any?, any?, ...any[]]> = {
	new(...args: Args): InstanceType<new (...args: any) => T>
}
type TKey = string | number | symbol
type IKeyValueMap<V = any, K extends TKey = TKey> = Record<K, V>
namespace Constant$ {
	export const REDUCE = Array.prototype.reduce.call.bind(Array.prototype.reduce) as {
		<T, R = T>(arr: T[], callbackfn: (previousValue: R, currentValue: T, currentIndex: number, array: T[]) => R, initialValue?: R): T
	}

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
	export var KEY_CONSTRUCTOR: 'constructor' = 'constructor';
	export var KEY_PROPERTY: 'property' = 'property';
	export var KEY_PROTOTYPE: 'prototype' = 'prototype'
	export var KEY_NUM: 'number' = 'number';
	export var KEY_STR: 'string' = 'string';
	export var KEY_BOOL: 'boolean' = 'boolean';
	export var KEY_OBJ: 'object' = 'object';
	export var KEY_VAL: 'value' = DefPropDec$.V;
	export var TRUE: true = true;
	export var FALSE: false = false;
	export var UNDEFINED = undefined;
	export var NULL = null;
	export var ARRAY = Array;
	export var IS_ARR = ARRAY.isArray;
	export var FUNCTION = Function;
	export var Num = Number;
	// tslint:disable-next-line: variable-name
	export var IS_Num = Num.isFinite;
	export var IS_NAN = Num.isNaN;
	export var OBJECT = Object;
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
	export var OBJ_FREESE = OBJECT.freeze;
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
	export var PARSE_FLOAT = parseFloat
	export var PARSE_INT = parseInt
}
// @ts-ignore
global.Constant$ = { ...Constant$ }
