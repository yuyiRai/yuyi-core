import { defaults, defaultTo, hasIn, merge } from 'lodash';
import { cloneDeep, PathEscapeConvert, get, reduceMap, set, unset } from '../LodashExtra';
import { TreeDataUtils } from '../OptionsUtils';
import { ForEachMacro, GeneratorForEachMacro } from '../Utils.macro';


export const EscpeUtils = PathEscapeConvert.create("_$_$_");

export type TKeyParamFunc<TSourceKey, TTargetKey, Result = any> = (
  key: TSourceKey, value?: any, targetKey?: TTargetKey
) => Result;
export type TValParamFunc<TSourceKey, TTargetKey, Result = any> = (
  value: any, key: TSourceKey, targetKey: TTargetKey
) => Result;

export interface IConvertDataOptions<TSourceKey, TTargetKey> {
  /** 缓存 */
  cache?: object;
  filterCodes?: TSourceKey[];
  /**
   * 在取值（且默认值）为`undefined`时清除对应的key
   * @remarks
   * 传入函数时会传入这个值进行判断
   * 
   * 返回为true时会做拦截/转而取默认值/作为多余字段进行清理等等工作
   */
  catchInvaildKey?: boolean | (TValParamFunc<TSourceKey, TTargetKey, boolean>);
  /** 对key进行预处理 */
  keyTransform?: (sourceKey: TSourceKey) => TTargetKey;
  /** 对value进行预处理 */
  valueTransform?: TValParamFunc<TSourceKey, TTargetKey>;
  /** 进行完整翻译（即使字段并不存在于传入的集合中） */
  full?: boolean;
  /** 取得默认值 */
  getDefaultValue?: (sourceKey: TSourceKey, sourceValue: any, targetKey: TTargetKey) => any;
  /**
   * 是否深度查找数组内部
   * 
   * 如果为true，在不指定filterCodes的情况下会把一个数组结构视作一种数据结构（即继续会查找数组元素）而非一个数据项
   * @default true
   */
  deepArraySearch?: boolean;
}
export interface ITransformerOptions<TSourceKey, TTargetKey> extends IConvertDataOptions<TSourceKey, TTargetKey> {
  filterCodes?: TSourceKey[];
  /** 进行完整翻译（即使字段并不存在于传入的集合中） */
  full?: boolean;
}
export interface IFromTransformOptions<TSourceKey, TTargetKey> extends ITransformerOptions<TSourceKey, TTargetKey> {
  /**
   * 取得merge后是否清理残留的元数据
   * @default true
   */
  clearMergeTmp?: boolean;
  /** 忽略特定Code的方法 */
  igroneCodes?: (key: TSourceKey, value?: any, targetKey?: TTargetKey) => boolean;
}
export interface IToTransformOptions<TSourceKey, TTargetKey> extends ITransformerOptions<TSourceKey, TTargetKey> {
  /** 
   * 取得merge后是否清理残留的原数据结构
   * @default true
   */
  clearMergeTmp?: boolean;
  /** 忽略特定Code的方法 */
  igroneCodes?: (key: TTargetKey, value?: any, targetKey?: TSourceKey) => boolean;
}

export type TTransformFunction<InputValue = any, OutputValue = any, FormData = any> = (value?: InputValue, data?: FormData) => OutputValue;
export interface ITransformFunction<InputValue = any, OutputValue = any, FormData = any> extends TTransformFunction<InputValue, OutputValue, FormData> {
  merge?: string[];
};

// export function createFilter<
//   InputValue,
//   OutputValue,
//   FormData
// >(
//   key: string,
//   transformer: IFilterFunction<InputValue, OutputValue, FormData>
// ): IFilter<typeof key, InputValue, OutputValue> {
//   return [key, transformer]
// }
/**
 * 返回true表示该字段为unused类型
 * @param value 
 * @param isUnvaildKey 
 * @param sourceKey 
 * @param targetKey 
 */
function isInviledKey<TSourceKey, TTargetKey>(
  value: any,
  isUnvaildKey: IConvertDataOptions<any, any>['catchInvaildKey'],
  sourceKey: TSourceKey,
  targetKey: TTargetKey
) {
  if (isUnvaildKey instanceof Function) {
    return isUnvaildKey(value, sourceKey, targetKey);
  } if (isUnvaildKey === true)
    return value === undefined;
  return false;
}

/**
 * 对取出的值（使用`options.valueTransform`）进行预处理(如果返回值不为`undefined`，否则使用原始值) =>
 * 
 *  使用`options.cleanUnusedKey`校验取得的值，如果不通过则通过`options.getDefaultValue`取得默认值 =>
 * 
 *  使用`options.cleanUnusedKey`校验取得的值，如果通过则`set`到`targetData`中
 * 
 *  最后清理冗余字段，更新缓存等等
 * @param value 
 * @param sourceKey 
 * @param targetKey 
 * @param targetData 
 * @param options 
 */
function getSafeData<TSourceKey extends string, TTargetKey extends string>(value: any, sourceKey: TSourceKey, targetKey: TTargetKey, targetData: any, options: ITransformerOptions<TSourceKey, TTargetKey>) {
  const { cache } = options;
  // @ts-ignore
  const diffKey: boolean = sourceKey !== targetKey;
  if (options.valueTransform) {
    // 对取出的值进行预处理(如果有返回)
    value = defaultTo(options.valueTransform(value, sourceKey, targetKey), value);
  }
  // 如果有必要，取得默认值
  if (options.getDefaultValue && isInviledKey<TSourceKey, TTargetKey>(value, options.catchInvaildKey, sourceKey, targetKey)) {
    value = options.getDefaultValue(sourceKey, value, targetKey);
  }
  // 判断如果不为cleanUnusedKeyToDo返回为true的值
  if (!isInviledKey(value, options.catchInvaildKey, sourceKey, targetKey)) {
    set(targetData, targetKey, value);
  }
  if (diffKey) {
    // 如果结构变动较大，清除原结构的字段
    unset(targetData, sourceKey);
  }
  // 如果有必要，更新缓存
  if (cache) {
    updateCache(cache, targetKey, value);
  }
  return value;
}
/**
 * 数据结构转换
 * 将一种结构的数据转换为另一种结构的数据
 * @param data 原始数据
 * @param options @see {@link IConvertDataOptions}
 */
export function convertDataMap<
  TSourceKey extends string,
  TTargetKey extends string,
  TSource extends Record<TSourceKey, any>, TTarget extends Record<TTargetKey, any>
>(data: TSource, options: IConvertDataOptions<TSourceKey, TTargetKey>): TTarget {
  const { filterCodes: allowPath, deepArraySearch: deepArray = true } = options;
  const targetData = (options.full ? cloneDeep(data) : {}) as TTarget;
  // 过滤需要的字段
  GeneratorForEachMacro(TreeDataUtils.getTreeIterator(data, { allowPath, deepArray }), (data) => {
    let [path, value] = data;
    const sourceKey: TSourceKey = path as any;
    const targetKey: TTargetKey = options.keyTransform(sourceKey);
    value = getSafeData<TSourceKey, TTargetKey>(value, sourceKey, targetKey, targetData, options);
  })
  return targetData;
}

export type ICustomTransformer<Code extends string = string, InputValue = any, OutputValue = any, InputData = any, OutputData = any> = [
  Code,
  ITransformFunction<OutputValue, InputValue, OutputData>,
  ITransformFunction<InputValue, OutputValue, InputData>
];

const updateCache = ((cache: any, targetKey: string, value: any) => {
  if (value !== null && value !== undefined) {
    cache[targetKey] = value;
    return true;
  } else {
    delete cache[targetKey];
    return false;
  }
});


/**
 * 
 * @param toData 
 * @param sourceKey 
 * @param values 
 * @param filterTo 
 * @param options 
 */
function transformToMerge<ToData extends object, InputValue, OutputValue>(
  toData: ToData,
  sourceKey: string,
  values: any,
  filterTo: ITransformFunction<InputValue, OutputValue, ToData>,
  options: IToTransformOptions<any, any>
) {
  const { clearMergeTmp = true, cache } = options;
  // console.log('mergeValue', outData, value, filterTo.merge, code)
  const mergeKeys = filterTo.merge;
  for (const key of mergeKeys) {
    const targetKey = StaticTransformer.extendsParentCode(key, sourceKey);
    const value = values ? get(values, key) : undefined;
    if (!isInviledKey(value, options.catchInvaildKey, sourceKey, targetKey)) {
      set(toData, targetKey, value);
    }
  }
  if (clearMergeTmp) {
    unset(toData, sourceKey);
    if (cache) {
      // merge结构取值的code移除缓存
      cache && (delete cache[sourceKey]);
      // 将merge作用的集合存入缓存
      merge(cache, values);
    }
  }
}

/**
 * 
 * @param mergeKeys 
 * @param sourceKey 
 * @param sourceData 
 * @param options 
 * @param targetKey 
 * @param targetData
 * @example
 *```ts
 * const data = {
 *    first: {
 *      item1: {}, item2: {}
 *    }
 * }
 * transformFromMerge(data, data, ['item1', 'item2'], 'first.second', { ... })
 *```
 * 要把`first.item1/item2`变成`first.second`，也就是提取出`first.item1/item2`塞到`first.second`这个新对象上去
 * 结果就变成了
 *```ts
 * _.isEquals(data,{ 
 *    first: { second: { item1: {}, item2: {} } }
 * })
 *```
 * 原本的`first.item1/item2`会被移除，除非clearMergeTmp为false
 */
function transformFromMerge<TSource extends object | {}, TTarget extends object | {}>(
  sourceData: TSource, targetData: TTarget, mergeKeys: string[], sourceKey: TOuterKey, options: IFromTransformOptions<TOuterKey, TInnerKey>, targetKey: TInnerKey
) {
  const { getDefaultValue, clearMergeTmp = true } = options;
  const target = {};
  let loadedDefaultValue: any;
  for (const mergeKey of mergeKeys) {
    // 提取出first.item1/first.item2这个路径
    const mergeSourceKey = DataTransformer.extendsParentCode(mergeKey, sourceKey);
    // 这里因为字段可能过滤掉的关系，取原数据集
    let getters = get(sourceData, mergeSourceKey);
    // console.log('getDefaultValue', getters, mergeSourceKey)
    if (getDefaultValue && isInviledKey(getters, options.catchInvaildKey, sourceKey, targetKey)) {
      // debugger;
      // 这里做一下缓存
      if (!loadedDefaultValue) {
        loadedDefaultValue = getDefaultValue(sourceKey, target, targetKey);
      }
      if (loadedDefaultValue) {
        // 取默认值是针对单个数据项而非完整路径，所以使用mergeKey而不是mergeSourceKey
        getters = get(loadedDefaultValue, mergeKey);
      }
    }
    // 因为是固定merge结构，不会清理空字段
    set(target, mergeKey, getters);
    // 保留merge源字段
    if (!clearMergeTmp) {
      set(targetData, mergeSourceKey, getters);
    } else {
      unset(targetData, mergeSourceKey);
    }
  }
  return target;
}


/**
 *
 * data翻译器，将表单组件使用的结构数据转换为输出用的结构
 * @param data 
 * @param filters 
 * @param options 
 */
export function toTransformer<TSource extends object | {}, TTarget extends object | {}>(
  sourceData: TSource,
  targetData: TTarget,
  filters: ICustomTransformer<TOuterKey>[],
  options?: IToTransformOptions<TInnerKey, TOuterKey>
): TTarget {
  // console.error('dataSubmitTransform', sourceData, filters)
  for (const [code, _, filterTo] of filters) {
    let value = filterTo(sourceData[DataTransformer.formatCode(code)], targetData);
    // submit最后再处理merge-pipe
    if (filterTo.merge instanceof Array) {
      transformToMerge(targetData, code, value, filterTo, options);
    } else if (!isInviledKey(value, options.catchInvaildKey, code, code)) {
      set(targetData, code, value);
    }
  }
  // console.log('outData', outData);
  return targetData as any;
}

function isFilterValid(sourceData: any, mainCode: TOuterKey, mergeCodes: TOuterKey[]): boolean {
  // 这里因为MergeCodes，取原数据集
  return hasIn(sourceData, mainCode) || mergeCodes && mergeCodes.some(innerCode =>
    hasIn(sourceData, StaticTransformer.extendsParentCode(innerCode, mainCode)
    ));
}

/**
 * 
 * @param sourceData 
 * @param targetData 
 * @param filters 
 * @param options 
 */
export function fromTransform<TSource extends object | {}, TTarget extends object | {}>(sourceData: TSource, targetData: TTarget, filters: ICustomTransformer<TOuterKey>[], options: IFromTransformOptions<TOuterKey, TInnerKey>): TTarget {
  filters.forEach(([sourceKey, from, to]) => {
    const mergeKeys = to.merge instanceof Array && to.merge;
    const targetKey = options.keyTransform(sourceKey);
    // console.log('mergeKeys: ', mergeCodes, code, sourceData)
    // 判断code是否在对象字段里
    // if (options.full || isFilterValid(sourceData, sourceKey, mergeKeys as TOuterKey[])) {
    // load优先处理merge-pipe
    let value: any;
    if (mergeKeys instanceof Array) {
      // console.log('mergeKey: ', mergeKeys)
      // 特殊类型merge 从整个对象中提取特定字段组合而成，取默认值时要进行等效替换
      value = transformFromMerge<TSource, TTarget>(sourceData, targetData, mergeKeys, sourceKey, options, targetKey);
    } else {
      value = get(targetData, targetKey);
    }
    const result = from(value, sourceData);
    getSafeData<TOuterKey, TInnerKey>(result, sourceKey, targetKey, targetData, options);
    // }
  });
  return targetData;
}
export class StaticTransformer {

  /**
   * 将字段结构扁平化的编码
   * @param code 
   * @param parentCode 
   */
  static formatCode(code: TOuterKey, parentCode?: TOuterKey): TInnerKey {
    var r = EscpeUtils.escapePath(code);
    r = parentCode ? EscpeUtils.extendsEscapedPath(r, parentCode) : r;
    r = r.replace(/\[/g, '__$').replace(/\]/g, '$__');
    return r as TInnerKey;
  }
  /**
   * 将字段结构从扁平化的编码解码为路径结构
   * @param code
   * @param parentCode
   */
  static getDataCode(code: string | TInnerKey): TOuterKey {
    var r = EscpeUtils.extractPath(code);
    r = r.replace(/__\$/g, '[').replace(/\$__/g, ']');
    return r as TOuterKey;
  }
  static updateDataWithPath(data: any, code: string, value?: any) {
    if (!data) return false;
    if (value === undefined) return unset(data, code);
    return set(data, code, value);
  }
  static getDataWithPath(data: any, code: string, defaultValue?: any) {
    if (!data) return false;
    return get(data, code, defaultValue);
  }
  static extendsCode(code: string, extendsCode: TInnerKey) {
    var r = EscpeUtils.extendsEscapedPath(code, extendsCode);
    r = r.replace(/\[/g, '__$').replace(/\]/g, '$__');
    return r;
  }

  static extendsParentCode(key: string, extendKey: string) {
    const splitStr = '.';
    const parent = extendKey.split(splitStr);
    parent.length > 0 && parent.pop();
    parent.push(key);
    // console.log('extendsCode', parent.join(splitStr), extendKey, key);
    return parent.join(splitStr);
  }

  static createTransformr<
    TKey extends string,
    InputValue,
    OutputValue,
    InputData,
    OutputData
  >(
    key: TKey,
    input: TTransformFunction<OutputValue, InputValue, OutputData>,
    output: TTransformFunction<InputValue, OutputValue, InputData>,
  ): ICustomTransformer<TKey, InputValue, OutputValue, InputData, OutputData> {
    return [key, input, output]; // createFilter(key, transformer)
  }

  static createMergeTransformer<
    TKey extends string,
    InputValue,
    OutputValue,
    InputData,
    OutputData
  >(
    key: string,
    inTransformer: TTransformFunction<any, any, any>,
    outTransformer: TTransformFunction<any, any, any>,
    mergeCodes: string[]
  ): ICustomTransformer<TKey, InputValue, OutputValue, InputData, OutputData> {
    // @ts-ignore
    inTransformer.merge = mergeCodes;
    // @ts-ignore
    outTransformer.merge = mergeCodes;
    // @ts-ignore
    // console.log(key, inTransformer.merge, outTransformer.merge)
    return [key, inTransformer, outTransformer] as any;
  }
}

export type TInnerKey = string & { _inner: true; };
export type TOuterKey = string; // & { _outer: true; };
// const a: TInnerKey = '' as TOuterKey

export class DataTransformer<
  Source extends object = object,
  Target extends object = object,
  > extends StaticTransformer {

  public transformers: ICustomTransformer[] = [];
  /**
   * @param keyList 注意必须为TOuterKey
   */
  constructor(factory: (trans: DataTransformer<Source, Target>) => any[], keyList: string[]);
  constructor(transformers: ICustomTransformer[], keyList: TOuterKey[]);

  constructor(
    factory: ICustomTransformer[] | ((trans: DataTransformer<Source, Target>) => ICustomTransformer[]),
    public keyList: TOuterKey[],
    public storeKeyList?: TInnerKey[]
  ) {
    super();
    if (factory instanceof Function) {
      this.transformers = factory(this);
    } else {
      this.transformers = factory;
    }
    this.storeKeyList = storeKeyList || this.keyList.map(code => this.getInnerKey(code));
  }

  public useTransform<TKey extends string,
    SourceType extends (TKey extends keyof Source ? Source[TKey] : any),
    TargetType extends (TKey extends keyof Target ? Target[TKey] : any)
  >(
    key: TKey,
    input: TTransformFunction<TargetType, SourceType, Target>,
    output: TTransformFunction<SourceType, TargetType, Source>,
  ) {
    return DataTransformer.createTransformr<TKey, SourceType, TargetType, Source, Target>(
      key,
      input,
      output
    );
  }

  getValueWithKey(data: Source, code: TOuterKey, defaultValue?: any) {
    return this.getValueWithInnerKey(data, DataTransformer.formatCode(code) as TInnerKey, defaultValue);
  }
  setValueWithKey(data: Source, code: TOuterKey, value?: any) {
    return this.setValueWithInnerKey(data, DataTransformer.formatCode(code) as TInnerKey, value);
  }
  getValueWithInnerKey(data: Source, code: TInnerKey, defaultValue?: any) {
    if (!data) return false;
    var r = data[code];
    return r !== undefined ? r : defaultValue;
  }
  setValueWithInnerKey(data: Source, code: TInnerKey, value?: any) {
    if (!data) return false;
    return data[code] = value;
  }

  getDataWithKey(data: Target, code: TOuterKey, defaultValue?: any) {
    return StaticTransformer.getDataWithPath(data, code, defaultValue);
  }
  setDataWithKey(data: Target, code: TOuterKey, value?: any) {
    return StaticTransformer.updateDataWithPath(data, code, value);
  }
  getDataWithInnerKey(data: Target, code: TInnerKey, defaultValue?: any) {
    return this.setDataWithKey(data, this.getDataKey(code), defaultValue);
  }
  setDataWithInnerKey(data: Target, code: TInnerKey, value?: any) {
    return this.setDataWithKey(data, this.getDataKey(code), value);
  }

  getDataKey(code: TInnerKey): TOuterKey {
    return DataTransformer.getDataCode(code) as any;
  }
  getInnerKey(code: TOuterKey): TInnerKey {
    return DataTransformer.formatCode(code) as any;
  }



  private mergeOptions<T>(staticOpts: T, options: T, defaultsOptions: T) {
    return defaults(defaults(staticOpts, options || {}), defaultsOptions);
  }
  /**
   * data翻译器，将输出结构的数据转换为便于组件使用的结构
   * @param fromData
   * @param options 选项
   * @remarks
   * 流程大概是这样的
   * 结构转换 -> 对转换后的结构进行transform(过程中做默认值、不必要字段的校验)
   */
  public fromTransform<Data extends Target>(fromData: Data, options?: IFromTransformOptions<TOuterKey, TInnerKey>): Source {
    options = this.mergeOptions({
      keyTransform: this.getInnerKey,
      filterCodes: this.keyList
    }, options, {
      cache: this.importCache,
      deepArraySearch: true
    });
    const { igroneCodes } = options;
    const filters: ICustomTransformer<TOuterKey>[] = (
      igroneCodes ? this.transformers.filter((opt: ICustomTransformer<TOuterKey>) => !igroneCodes(opt[0])) : this.transformers
    ) as any;
    const sourceData: Data = cloneDeep(fromData) as any;
    // 先过一遍，把树型结构转化为便于内部处理的扁平化结构
    const targetData: Source = convertDataMap<TOuterKey, TInnerKey, Target, Source>(sourceData, {
      ...options,
      /** 这三项工作不在这做 */
      getDefaultValue: null,
      valueTransform: null,
      catchInvaildKey: null,
    });
    // console.log('mapPropsToFields', filters)
    return fromTransform<Data, Source>(sourceData, targetData, filters, {
      ...options,
      catchInvaildKey: (value, sourceKey, targetKey) => {
        // 如果要忽略 忽略
        if (igroneCodes && igroneCodes(sourceKey, value, targetKey)) return true;
        return value === undefined;
      }
    });
  }

  /**
   * data翻译器，将表单组件使用的结构数据转换为提交用的报文
   * @param sourceData
   * @remarks
   * 流程大概是这样的
   * 结构转换(过程中做默认值、不必要字段的校验) -> 对转换后的结构进行transform
   */
  public toTransform<Data extends Source>(sourceData: Data, options?: IToTransformOptions<TInnerKey, TOuterKey>): Target {
    options = this.mergeOptions({
      filterCodes: this.storeKeyList,
      keyTransform: this.getDataKey
    }, options, {
      cache: this.exportCache,
      deepArraySearch: true
    });

    const { igroneCodes } = options;
    /** 忽略掉特定字段翻译 */
    const filters: ICustomTransformer<TOuterKey>[] = (igroneCodes ? this.transformers.filter((opt: ICustomTransformer<TOuterKey>) => !igroneCodes(opt[0])) : this.transformers) as any;
    // 如果需要，存储缓存
    if (options.cache && options.full) {
      merge(options.cache, sourceData);
    }
    // 先过一遍，把内部扁平化的结构恢复为树型结构
    const outputData: Target = convertDataMap<TInnerKey, TOuterKey, Source, Target>(sourceData, {
      ...options,
      catchInvaildKey: (value, sourceKey, targetKey) => {
        // 如果要忽略 忽略
        if (igroneCodes && igroneCodes(targetKey, value, sourceKey)) return true;
        return value === undefined;
      }
    });
    return toTransformer(sourceData, outputData, filters, options);
  }

  public exportCache: Target = {} as any;
  public importCache: Source = {} as any;
}
