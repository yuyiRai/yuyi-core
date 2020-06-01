import { get, has, isPlainObject } from 'lodash';
import { Constant$ } from '../Constransts';
import { convertArr2Map } from './base';
import { createSearchMatcher } from './OptionsUtils';
import { ForEachMacro, GeneratorForEachMacro } from '../Utils.macro';
export { TreeMap, TreeSet } from 'typescriptcollectionsframework';




/**
 * 树型结构数据工具集
 * @public
 */
export namespace TreeDataUtils {

  /**
   * 匹配特定路径的函数
   * @param path 当前节点路径
   * @param value 当前路径指向的值
   * @param currentKey 当前节点在父节点的key
   * @param pathArr 节点路径数组
   */
  export type TPathMatcherFunction = (path: string, value: any, currentKey: string, pathArr: string[]) => boolean;

  /**
   * 匹配固定路径的数组或对象，用于简单且固定的匹配条件
   */
  export type TPaths = string[] | Record<string, true>;

  /**
   * 匹配特定路径的{@link TreeDataUtils.TPathMatcherFunction | 函数}/正则表达式，用于复杂的匹配条件
   */
  export type TPathMatcher = RegExp | TPathMatcherFunction;

  /**
   * @see {@link TreeDataUtils.TPaths | TPaths}, {@link TreeDataUtils.TPathMatcher | TPathMatcher}
   */
  export type TAllowPath = TPaths | TPathMatcher;

  export interface ITreeNodeOptions {
    /**
     * 指定路径标识使用的key
     * 必传
     */
    key: string;
    /**
     * 指定子节点Node数组使用的key
     * @default "children"
     */
    children?: string;
    /**
     * 指定value使用的key，如果不传则把整个node自身视作value
     * @default undefined
     */
    value?: string;
  }

  export interface ITreeIteratorOptions {
    /**
     * TreeNode配置，用于更复杂结构的树型数据
     * 如果启用此配置，将无视{@link TreeDataUtils.ITreeIteratorOptions.deepArray | ITreeIteratorOptions.deepArray}选项
     */
    nodeOptions?: ITreeNodeOptions;
    /**
     * 是否侵入数组下标
     * @default false
     * @example
     * 为false的情况
     *```ts
     * var listTestObj = { list: [ { a: 1, b: [1, 2] }, { a: 2, b: 3 } ] }
     * const result = TreeDataUtils.getTreeLeafPaths(listTestObj, { deepArray: false }) // 不传也一样
     * _.isEqual(result, ["list"]) => true
     *```
     * @example
     *```ts
     * var listTestObj = { ... } // 同上一个例子
     * const result = TreeDataUtils.getTreeLeafs(listTestObj, { deepArray: true })
     * _.isEqual(result, [
     *   ["list[0].a", 1],
     *   ["list[0].b[0]", 1],
     *   ["list[0].b[1]", 2],
     *   ["list[1].a", 2],
     *   ["list[1].b", 3],
     * ]) => true
     *```
     * @example
     *```ts
     * var listTestObj = { ... } // 同上一个例子
     * const result = TreeDataUtils.getTreeLeafPaths(listTestObj, {
     *    deepArray: true, 
     *    allowPath: (path, value, key, arrKeys) => arrKeys.length === 3 && /^[0-9]$/.test(arrKeys[1]) 
     * })
     * _.isEqual(result, ["list[0].a", "list[0].b", "list[1].a", "list[1].b"]) => true
     *```
     */
    deepArray?: boolean;
    /**
     * 只迭代通过匹配的路径，用于匹配特定Path的参数
     * @remarks
     * 可以为{@link TreeDataUtils.TPaths | 数组/对象}
     * 
     * 或是一个{@link TreeDataUtils.TPathMatcher | 函数/正则表达式}
     * 
     */
    allowPath?: TAllowPath;
  }
  type TArg = ITreeIteratorOptions | TAllowPath;

  /**
   * 取得一个树形结构数据的全部子节点的完整路径
   * @param source 数据源
   * @param allowPaths 简单路径匹配。详见{@link TreeDataUtils.TPaths}
   * @param pathMatcher 复杂路径匹配。详见{@link TreeDataUtils.TPathMatcher}
   * @param options 完整配置项。详见{@link TreeDataUtils.ITreeIteratorOptions}
   * @remarks 参照{@link TreeDataUtils.(getTreeLeafs:1)}，执行逻辑是一样的。
   */
  export function getTreeLeafPaths<Path extends string>(source: any, options?: ITreeIteratorOptions): Path[];
  /**
   * {@inheritDoc TreeDataUtils.(getTreeLeafPaths:1)}
   * @example
   * 参照{@link TreeDataUtils.(getTreeLeafs:2)}
   */
  export function getTreeLeafPaths<Path extends string>(source: any, allowPaths?: TPaths): Path[];
  /**
   * {@inheritDoc TreeDataUtils.(getTreeLeafPaths:1)}
   * @example
   * 参照{@link TreeDataUtils.(getTreeLeafs:3)}
   */
  export function getTreeLeafPaths<Path extends string>(source: any, pathMatcher?: TPathMatcher): Path[];
  export function getTreeLeafPaths(values: any, arg?: any) {
    var codeList = [];
    GeneratorForEachMacro(getTreeIterator(values, arg), opt => {
      codeList.push(opt[0]);
    })
    return codeList;
  }

  /**
   * 元组结构，为[完整路径, 对应路径的值]
   */
  export type TPathChildData<Path extends string> = [Path, any];
  /**
   * 取得一个树形结构数据的全部子节点的数组
   * @param source 数据源
   * @param allowPaths 简单路径匹配。详见{@link TreeDataUtils.TPaths}
   * @param pathMatcher 复杂路径匹配。详见{@link TreeDataUtils.TPathMatcher}
   * @param options 完整配置项。详见{@link TreeDataUtils.ITreeIteratorOptions}
   * @returns 返回一个由{@link TreeDataUtils.TPathChildData|结果数组}构成的数组
   * @remarks 当source为一个对象，按顺序搜索最大深度的子节点路径进行树遍历，默认只会把纯对象或纯数组视作一个父节点（类的实例等等）。
   *
   * 你可以使用paths指定遍历特定的节点路径，把特定路径所需要的搜索目标（对象或数组）视作一个子节点而非父节点。
   * 
   * 注意点
   *
   * 1. 如果一个父节点为空对象，除非通过paths指定该路径否则默认会忽略掉这个对象（视作没有子节点的父节点）
   *
   * 2. 默认不会侵入数组下标搜寻，除非通过{@link TreeDataUtils.ITreeIteratorOptions.deepArray|options.deepArray}。
   * @example
   * 简单用法
   *```ts
   * const r = { one: { one: 1, two: {} }, two: 2, three: [1, 2] }
   * _.isEqual(
   *   getTreeLeafs(r), [
   *     ['one.one', 1], 
   *     ['two', 2], 
   *     ['three[0]', 1], 
   *     ['three[1]', 2]
   *   ]
   * ) => true
   *```
   * 复杂的例子见{@link TreeDataUtils.ITreeIteratorOptions|配置项}中的举例
   */
  export function getTreeLeafs<Path extends string>(source: any, options?: ITreeIteratorOptions): TPathChildData<Path>[];
  /**
   * @example
   * 指定数组path：
   *```ts
   * const r = { one: { one: 1, two: {} }, two: 2, three: [1, 2] }
   * _.isEqual(
   *   getTreeLeafs(r, ['one.one', 'one.two', 'two', 'three']), [
   *     ['one.one', 1],
   *     ['one.two', {}],
   *     ['two', 2],
   *     ['three', [1, 2]],
   *   ]
   * ) => true
   *```
   * {@inheritDoc TreeDataUtils.(getTreeLeafs:1)}
   */
  export function getTreeLeafs<Path extends string>(source: any, allowPaths?: TPaths): TPathChildData<Path>[];
  /**
   * @example
   * 正则匹配：
   *```ts
   * const r = { one: { one: 1, two: {} }, two: 2, three: [1, 2] }
   * _.isEqual(
   *   getTreeLeafs({ obj: { 1: 1, 2: 2, c: 3 } }, /^obj\.([0-9]+)$/), [
   *     ["obj.1", 1],
   *     ["obj.2", 2]
   *   ]
   * ) => true
   *```
   * @example
   * 函数匹配：
   *```ts
   * const r = { one: { one: 1, two: {} }, two: 2, three: [1, 2] }
   * _.isEqual(
   *   getTreeLeafs({ obj: { 1: 1, 2: 2, c: 3 } }, (path, value, key, arrKeys) => {
   *     return /^obj\.([0-9]+)$/.test(path) && arrKeys.length === 2 && /^[0-9]$/.test(key) && value === 1
   *   }, [
   *     ["obj.1", 1]
   *   ]
   * ) => true
   *```
   * {@inheritDoc TreeDataUtils.(getTreeLeafs:1)}
   */
  export function getTreeLeafs<Path extends string>(source: any, pathMatcher?: TPathMatcher): TPathChildData<Path>[];
  export function getTreeLeafs(values: any, arg?: any) {
    var codeList: [string, any][] = [];
    GeneratorForEachMacro(getTreeIterator(values, arg), (opt) => {
      codeList.push([opt[0], opt[1]]);
    })
    return codeList;
  }

  export function getTreeLeafsAndParents(values: any, arg?: any): [string, any, string?][] {
    var codeList: [string, any, string?][] = [];
    GeneratorForEachMacro(getTreeIterator(values, arg), opt => {
      codeList.push(opt);
    })
    return codeList;
  }

  export function getTreeLeafsAndParentsPath(values: any, arg?: any): Record<string, string> {
    var result: Record<string, string> = {};
    GeneratorForEachMacro(getTreeIterator(values, arg), (opt) => {
      result[opt[0]] = opt[2]
    })
    return result;
  }



  /**
   * 树形结构（嵌套对象）迭代器。
   * @param source 数据源
   * @param allowPaths 简单路径匹配。详见{@link TreeDataUtils.TPaths}
   * @param pathMatcher 复杂路径匹配。详见{@link TreeDataUtils.TPathMatcher}
   * @param options 完整配置项。详见{@link TreeDataUtils.ITreeIteratorOptions}
   * @returns 返回一个迭代器；当搜索到叶子节点时，迭代返回{@link TreeDataUtils.TPathChildData|TPathChildData}。
   * @remarks 参照{@link TreeDataUtils.(getTreeLeafs:1)}，执行逻辑是一样的。
   * @example
   * 简单用法
   *```ts
   * const r = { one: { one: 1, two: {} }, two: 2, three: [1, 2] }
   * for (const [key, value] of getValuePathIterator(r)) {
   *    console.log(key, value)
   * }
   * ```
   * log => `one.one 1`, `two 2`, `three [1,2]`
   */
  export function getTreeIterator(source: any, options?: ITreeIteratorOptions): Generator<[string, any, string?]>;
  /**
   * {@inheritDoc TreeDataUtils.(getTreeIterator:1)}
   * @example
   * 参照{@link TreeDataUtils.(getTreeLeafs:2)}
   */
  export function getTreeIterator(source: any, allowPaths?: TPaths): Generator<[string, any, string?]>;
  /**
   * {@inheritDoc TreeDataUtils.(getTreeIterator:1)}
   * @example
   * 参照{@link TreeDataUtils.(getTreeLeafs:3)}
   */
  export function getTreeIterator(source: any, pathMatcher?: TPathMatcher): Generator<[string, any, string?]>;
  export function getTreeIterator(values: any, arg: TArg) {
    if (values == null) return null;
    if (arg instanceof Array) {
      return deepEntires(values, arg, true);
    }
    if (arg instanceof Object && ('deepArray' in arg || 'nodeOptions' in arg)) {
      const { deepArray: deepArray, allowPath, nodeOptions } = arg;
      if (!nodeOptions) {
        if (allowPath instanceof Array) return deepEntires(values, allowPath, true);
        // console.log('see array');
        if (deepArray) return getValuePathIterator2(values, allowPath as any);
      }
      return getValuePathIterator1(values, allowPath as any, nodeOptions as ITreeNodeOptions);
    }
    // 如果是对象
    // console.log('common', arg)
    return getValuePathIterator1(values, arg as Exclude<TAllowPath, string[] | Record<string, true>>);
  }

  function expectAllowPath(allowPath: TPathMatcher, key: string, value: any, deepKey: string, pathArr: string[]) {
    const matcher = allowPath && createSearchMatcher(allowPath as any);
    if (matcher) {
      return matcher(deepKey, value, key, pathArr);
    }
    // console.log('expectAllowPath', allowPath, key, value, deepKey, r)
    return allowPath[deepKey]; // || !(deepKey in allowPath);
  }

  /**
   * 返回一个深度路径迭代器
   * @param obj 
   * @param paths 
   * @param strict 严格模式（obj不存在指定path时是否忽略迭代）
   */
  export function* deepEntires(obj: any, paths: string[], strict = false) {
    for (var i = 0; i < paths.length; i++) {
      if (!strict || has(obj, paths[i])) {
        yield [paths[i], get(obj, paths[i])];
      }
    }
  }

  const defaultOptionsChlidrenKey = 'children'
  function childrenEntires<T>(target: T, options?: ITreeNodeOptions): [string, any][]{
    if (options) {
      const children = target instanceof Array ? target : target[options.children || defaultOptionsChlidrenKey];
      const result: {[k: string]: any}  = {}
      if (children instanceof Array) {
        ForEachMacro(children, item => {
          if (item && options.key in item) {
            (typeof item[options.key] === 'number') && (item[options.key] = (item[options.key] + ''));
            result[item[options.key]] = item;
          }
        })
        // var index = -1, length = children.length - 1;
        // while (index < length) {
        //   const item = children[++index]; //, i, children
        //   if (item && options.key in item) {
        //     (typeof item[options.key] === 'number') && (item[options.key] = (item[options.key] + ''));
        //     result[item[options.key]] = item;
        //   }
        // }
        
      }
      return Object.entries(result)
    }
    return Object.entries(target)
  }

  /**
   * 是否为父节点
   * @param target 
   * @param nodeOptions 
   */
  function isParentNode(target: any, nodeOptions?: ITreeNodeOptions) {
    return isPlainObject(target) && nodeOptions && ((nodeOptions.children || defaultOptionsChlidrenKey) in target);
  }
  /**
   * 是否为父对象
   * @param target 
   * @param nodeOptions 
   */
  function isParentObject(target: any, nodeOptions?: ITreeNodeOptions): target is object {
    return nodeOptions ? (isParentNode(target, nodeOptions)) : isPlainObject(target)
  }
  
  /**
   * 初始化遍历堆
   * @param target 
   * @param nodeOptions 
   */
  function initIteratorTrack(target: any, nodeOptions?: ITreeNodeOptions): [string, any, string, string[]?][] {
    return isParentNode(target, nodeOptions)
      // 根节点手动压入栈
      ? [[target[nodeOptions.key], target]]
      : childrenEntires(target, nodeOptions) as any
  }
  function toValue(target: any, nodeOptions?: ITreeNodeOptions) {
    return nodeOptions && nodeOptions.value ? target[nodeOptions.value] : target
  }

  /**
   * 嵌套对象迭代器（不识别数组下标）
   * @param values 
   * @param allowPath 
   */
  function* getValuePathIterator1(values: any, allowPath?: TPathMatcher, nodeOptions?: ITreeNodeOptions) {
    // console.log('getValuePathIterator1', allowPath)
    // 使用数组记录结构，第一项为当前节点的key，第二项是该key的值，其后是当前节点的血源key
    // tslint:disable-next-line: one-variable-per-declaration
    var p: [string, any, string, string[]?][] = initIteratorTrack(values, nodeOptions),
    currentPath: string, nextList: any[], nextIndex: number;
    while (p.length > 0) {
      const [key, target, parentKey, parentKeyArr = []] = p.shift();
      nextList = []; // 收集下一轮压入的堆
      nextIndex = -1;
      /** 当前path数组 */
      const currentKeyArr = parentKeyArr.concat([key]);
      /** 当前path */
      currentPath = parentKey ? `${parentKey}.${key}` : key;

      const isParentObj = isParentObject(target, nodeOptions) && (!allowPath || !expectAllowPath(allowPath, key, target, currentPath, currentKeyArr))
      const isCheckedNode = isParentNode(target, nodeOptions)
      if (isParentObj) {
        childrenEntires(target, nodeOptions).forEach(opt => {
          nextList[++nextIndex] = [opt[0], opt[1], currentPath, currentKeyArr] as [string, any, string, string[]?];
        })
      }
      if ((!isParentObj || isCheckedNode) && (!allowPath || expectAllowPath(allowPath, key, target, currentPath, currentKeyArr))) {
        yield [currentPath, toValue(target, nodeOptions), parentKey] as [string, any, string];
      }
      // 压入堆
      p = nextList.concat(p);
    }
  }

  /**
   * 嵌套对象迭代器（识别数组下标）
   * @param values 
   * @param allowPath 
   */
  function* getValuePathIterator2(values: any, allowPath?: TPathMatcher) {
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
      const currentKeyArr = parentKeyArr.concat([key]);
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
        yield [currentPath, valueOrP, parentKey] as [string, any, string];
      }
      // 压入堆
      p = nextList.concat(p);
    }
  }

  // /**
  //  * 迭代器(递归版本)
  //  * @param values 
  //  * @param allowPath 
  //  * @param parentKey 父级path（可选）
  //  */
  // function getValuePathIteratorRunner(
  //   values: any,
  //   allowPath?: string[] | { [path: string]: boolean; },
  //   parentKey?: string
  // ): Generator<[string, any], void, [string, any]>;

  // function* getValuePathIteratorRunner(
  //   values: any,
  //   allowPath?: string[] | { [path: string]: boolean; },
  //   parentKey?: string,
  //   fixedAllPath: { [path: string]: boolean; } = allowPath instanceof Constant$.ARRAY ? convertArr2Map(allowPath) : allowPath
  // ) {
  //   if (!values) return;

  //   // tslint:disable-next-line: one-variable-per-declaration
  //   var p = Constant$.OBJ_KEYS(values),
  //     currentPath: string,
  //     valueOrP: any,
  //     key: string;
  //   for (key of p) {
  //     valueOrP = values[key];
  //     currentPath = parentKey ? parentKey + '.' + key : key;
  //     if (isPlainObject(valueOrP) && (!fixedAllPath || !fixedAllPath[currentPath])) {
  //       // @ts-ignore
  //       yield* getValuePathIteratorRunner(valueOrP, allowPath, currentPath, fixedAllPath);
  //       // console.trace('test')
  //     } else if (!fixedAllPath || fixedAllPath[currentPath]) {
  //       yield [currentPath, valueOrP] as [string, any];
  //     }
  //   }
  // }

}

/**
 * 别名导出
 * @deprecated
 * @see {@link (TreeDataUtils:namespace).(getTreeIterator:1)}
 */
export const getValuePathIterator = TreeDataUtils.getTreeIterator;
