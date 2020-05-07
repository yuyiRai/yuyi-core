import { get, has, isPlainObject } from 'lodash';
import { Constant$ } from '../Constransts';
import { convertArr2Map } from './base';
import { createSearchMatcher } from './OptionsUtils';

type AllowPath = string[] | Record<string, true> | RegExp | ((path: string, value: any, currentKey: string, pathArr: string[]) => boolean);
export interface ValuePathIteratorOptions {
  /**
   * 允许的Path数组或一个对象，
   * 或是一个函数
   * ```ts
   * function (path: string, value: any, currentKey: string, pathArr: string[]): boolean;
   * ```
   * 或是一个RegExp对象，只迭代通过完整path匹配的path
   */
  allowPath?: AllowPath;
  /**
   * 是否侵入数组下标
   * @default false
   */
  deepArray?: boolean;
}
type Arg = ValuePathIteratorOptions | AllowPath

export function getValuePath(values: any, options?: ValuePathIteratorOptions): string[]
export function getValuePath(values: any, allowPath?: AllowPath): string[]
export function getValuePath(values: any, arg?: any) {
  var codeList = [];
  for (var [code] of getValuePathIterator(values, arg)) {
    codeList.push(code);
  }
  return codeList;
}

export function getValueAndPath(values: any, options?: ValuePathIteratorOptions): [string, any][];
export function getValueAndPath(values: any, allowPath?: AllowPath): [string, any][]
export function getValueAndPath(values: any, arg?: any) {
  var codeList: [string, any][] = [];
  for (var [code, value] of getValuePathIterator(values, arg)) {
    codeList.push([code, value]);
  }
  return codeList;
}


export function getValuePathIterator(values: any, options?: ValuePathIteratorOptions): Generator<[string, any]>;
export function getValuePathIterator(values: any, allowPath?: AllowPath): Generator<[string, any]>;
/**
 * 迭代器
 * @param values 
 * @param allowPath 
 */
export function getValuePathIterator(values: any, arg: Arg) {
  if (values == null) return null;
  if (arg instanceof Array) {
    return getValuePathIterator0(values, arg)
  }
  if (arg instanceof Object && 'deepArray' in arg) {
    const { deepArray: deepArray, allowPath } = arg;
    if (allowPath instanceof Array) {
      return getValuePathIterator0(values, allowPath);
    }
    // console.log('see array');
    if (deepArray)
      return getValuePathIterator2(values, allowPath as any);
    if (allowPath)
      return getValuePathIterator1(values, allowPath as any);
    return getValuePathIterator1(values);
  }
  // 如果是对象
  // console.log('common', arg)
  return getValuePathIterator1(values, arg as Exclude<AllowPath, string[] | Record<string, true>>);
}

function expectAllowPath(allowPath: Exclude<AllowPath, string[]>, key: string, value: any, deepKey: string, pathArr: string[]) {
  const matcher = allowPath && createSearchMatcher(allowPath as any)
  const r = matcher ? matcher(deepKey, value, key, pathArr) : allowPath[deepKey]
  console.log('expectAllowPath', allowPath, key, value, deepKey, r)
  return r
}

/**
 * 路径迭代器
 * @param values 
 * @param allowPath 
 */
function* getValuePathIterator0(values: any, allowPath?: string[]) {
  for (var i = 0; i < allowPath.length; i++) {
    if (has(values, allowPath[i])) {
      yield [allowPath[i], get(values, allowPath[i])];
    }
  }
}
/**
 * 嵌套对象迭代器（不识别数组下标）
 * @param values 
 * @param allowPath 
 */
function* getValuePathIterator1(values: any, allowPath?: Exclude<AllowPath, string[] | Record<string, true>>) {
  // console.log('getValuePathIterator1', allowPath)
  // 使用数组记录结构，第一项为当前节点的key，第二项是该key的值，其后是当前节点的血源key
  // tslint:disable-next-line: one-variable-per-declaration
  var p: [string, any, string, string[]?][] = Constant$.ENTRIES(values) as any,
    currentPath: string, nextList: any[], nextIndex: number;
  while (p.length > 0) {
    const [key, valueOrP, parentKey, parentKeyArr = []] = p.shift();
    nextList = []; // 收集下一轮压入的堆
    nextIndex = -1;
    /** 当前path数组 */
    const currentKeyArr = parentKeyArr.concat([key])
    /** 当前path */
    currentPath = parentKey ? `${parentKey}.${key}` : key;

    if (isPlainObject(valueOrP) && (!allowPath || !expectAllowPath(allowPath, key, valueOrP, currentPath, currentKeyArr))) {
      for (const keyVal of Constant$.ENTRIES(valueOrP)) {
        nextList[++nextIndex] = [keyVal[0], keyVal[1], currentPath, currentKeyArr] as [string, any, string, string[]?];
      }
    } else if (!allowPath || expectAllowPath(allowPath, key, valueOrP, currentPath, currentKeyArr)) {
      yield [currentPath, valueOrP] as [string, any];
    }
    // 压入堆
    p = nextList.concat(p)
  }
}

/**
 * 嵌套对象迭代器（识别数组下标）
 * @param values 
 * @param allowPath 
 */
function* getValuePathIterator2(values: any, allowPath?: Exclude<AllowPath, string[] | Record<string, true>>) {
  // console.log('getValuePathIterator2', allowPath)
  // 使用数组记录结构，第一项为当前节点的key，第二项是该key的值，其后是当前节点的血源key
  // tslint:disable-next-line: one-variable-per-declaration
  var p: [string, any, string, boolean?, string[]?][] = Constant$.ENTRIES(values) as any,
    currentPath: string, nextList: any[], nextIndex: number;
  while (p.length > 0) {
    nextList = []; // 收集下一轮压入的堆
    nextIndex = -1;
    const [key, valueOrP, parentKey, arrParent, parentKeyArr = []] = p.shift();
    /** 当前path数组 */
    const currentKeyArr = parentKeyArr.concat([key])
    /** 当前path */
    currentPath = parentKey ? (
      arrParent ? `${parentKey}[${key}]` : `${parentKey}.${key}`
    ) : key;
    const arrTarget = valueOrP instanceof Array;
    // console.log('search', currentPath, valueOrP, allowPath)
    // 允许数组和对象，
    if ((arrTarget || isPlainObject(valueOrP)) && (!allowPath || !expectAllowPath(allowPath, key, valueOrP, currentPath, currentKeyArr))) {
      for (const keyVal of Constant$.ENTRIES(valueOrP)) {
        // console.log('unshift', valueOrP, keyVal[0], keyVal[1], currentPath, arrTarget)
        nextList[++nextIndex] = [keyVal[0], keyVal[1], currentPath, arrTarget, currentKeyArr] as [string, any, string, boolean?, string[]?];
      }
    } else if (!allowPath || expectAllowPath(allowPath, key, valueOrP, currentPath, currentKeyArr)) {
      yield [currentPath, valueOrP] as [string, any];
    }
    // 压入堆
    p = nextList.concat(p)
  }
}

/**
 * 迭代器(递归版本)
 * @param values 
 * @param allowPath 
 * @param parentKey 父级path（可选）
 */
export function getValuePathIteratorRunner(
  values: any,
  allowPath?: string[] | { [path: string]: boolean; },
  parentKey?: string
): Generator<[string, any], void, [string, any]>;

export function* getValuePathIteratorRunner(
  values: any,
  allowPath?: string[] | { [path: string]: boolean; },
  parentKey?: string,
  fixedAllPath: { [path: string]: boolean; } = allowPath instanceof Constant$.ARRAY ? convertArr2Map(allowPath) : allowPath
) {
  if (!values) return;

  // tslint:disable-next-line: one-variable-per-declaration
  var p = Constant$.OBJ_KEYS(values),
    currentPath: string,
    valueOrP: any,
    key: string;
  for (key of p) {
    valueOrP = values[key];
    currentPath = parentKey ? parentKey + '.' + key : key;
    if (isPlainObject(valueOrP) && (!fixedAllPath || !fixedAllPath[currentPath])) {
      // @ts-ignore
      yield* getValuePathIteratorRunner(valueOrP, allowPath, currentPath, fixedAllPath);
      // console.trace('test')
    } else if (!fixedAllPath || fixedAllPath[currentPath]) {
      yield [currentPath, valueOrP] as [string, any];
    }
  }
}
