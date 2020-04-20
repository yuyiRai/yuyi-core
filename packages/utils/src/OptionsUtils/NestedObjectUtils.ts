import { isPlainObject } from 'lodash';
import { Constant$ } from '../Constransts';
import { convertArr2Map } from './base';


export function getValuePath(values: any, allowPath?: string[] | { [path: string]: boolean }) {
  var codeList = []
  for (var [code] of getValuePathIteratorRunner(values, allowPath)) {
    codeList.push(code)
  }
  return codeList
}
export function getValueAndPath(values: any, allowPath?: string[] | { [path: string]: boolean }) {
  var codeList: [string, any][] = []
  for (var [code, value] of getValuePathIteratorRunner(values, allowPath)) {
    codeList.push([code, value])
  }
  return codeList
}


/**
 * 迭代器
 * @param values 
 * @param allowPath 
 */
export function* getValuePathIterator(values: any, allowPath?: string[] | { [path: string]: boolean }) {
  if (values == null) return null;
  allowPath instanceof Constant$.ARRAY && (allowPath = convertArr2Map(allowPath))
  // 使用数组记录结构，第一项为当前节点的key，第二项是该key的值，其后是当前节点的血源key
  // tslint:disable-next-line: one-variable-per-declaration
  var p: [string, any, string][] = Constant$.ENTRIES(values) as any,
    currentPath: string, nextList: any[], nextIndex: number
  while (p.length > 0) {
    nextList = []
    nextIndex = -1
    for (const [key, valueOrP, parentKey] of p) {
      currentPath = parentKey && parentKey + '.' + key || key;
      if (isPlainObject(valueOrP) && (!allowPath || !allowPath[currentPath])) {
        for (const keyVal of Constant$.ENTRIES(valueOrP)) {
          nextList[++nextIndex] = [keyVal[0], keyVal[1], currentPath] as [string, any, string]
        }
      } else if (!allowPath || allowPath[currentPath]) {
        yield [currentPath, valueOrP] as [string, any]
      }
    }
    p = nextList
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
  allowPath?: string[] | { [path: string]: boolean },
  parentKey?: string
): Generator<[string, any], void, [string, any]>

export function* getValuePathIteratorRunner(
  values: any,
  allowPath?: string[] | { [path: string]: boolean },
  parentKey?: string,
  fixedAllPath: { [path: string]: boolean } = allowPath instanceof Constant$.ARRAY ? convertArr2Map(allowPath) : allowPath
) {
  if (!values) return;

  // tslint:disable-next-line: one-variable-per-declaration
  var p = Constant$.OBJ_KEYS(values),
    currentPath: string,
    valueOrP: any,
    key: string;
  for (key of p) {
    valueOrP = values[key]
    currentPath = parentKey ? parentKey + '.' + key : key;
    if (isPlainObject(valueOrP) && (!fixedAllPath || !fixedAllPath[currentPath])) {
      // @ts-ignore
      yield* getValuePathIteratorRunner(valueOrP, allowPath, currentPath, fixedAllPath)
      // console.trace('test')
    } else if (!fixedAllPath || fixedAllPath[currentPath]) {
      yield [currentPath, valueOrP] as [string, any]
    }
  }
}
