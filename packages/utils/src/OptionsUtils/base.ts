import map from 'lodash/map';
import { Constant$, IKeyValueMap, TKey } from '../Constransts';
import { isObject } from '../LodashExtra';

export namespace Setter {
  /**
   * 设置目标map或对象属性并返回目标自身
   * @param target 
   * @param source 
   * @param keywordKey 
   * @param keywordVal 
   */
  export function setWith$$<T extends {} | Map<any, any>>(target: T, source: any, keywordKey: TKey, keywordVal: TKey): T {
    return (
      target instanceof Map
        ? target.set(source[keywordKey], source[keywordVal])
        : (target[source[keywordKey]] = source[keywordVal]),
      target
    )
  }

  export function setWithEntries$$<T>(o: T, option: [string, string]): T {
    return setWith$$(o, option, 0, 1)
  }

  export function setWithEntriesReverse$$<T, K extends string, V extends string>(o: T, option: [K, V]): T {
    return setWith$$(o, option, 1, 0)
  }

  export function setValue$$<T>(o: T, key: TKey, value: any): T {
    return (o[key] = value, o)
  }

  export function setTrue$$<T>(o: T, key: TKey): T {
    return (o[key] = true) && o
  }

  export function setWithKeyValue$$<T>(target: T, source: { key: any; value: any; }): T {
    return (target[source.key] = source.value, target)
  }
  export function setWithValueLabel$$<T>(target: T, source: { label: any; value: any; }): T {
    return (target[source.value] = source.label, target)
  }
  export function setWithLabelValue$$<T>(target: T, source: { label: string; value: any }): T {
    return (target[source.label] = source.value, target)
  }
}

const { REDUCE } = Constant$

export function convertMap2UnieqArray<
  Target extends {},
  Keys extends string,
  Map extends { [k in Keys]: Target },
  PrimaryKey extends string = 'key'
>(
  obj: Map, defineKey: PrimaryKey = 'key' as PrimaryKey
): ({
  [Key in (keyof Target | PrimaryKey)]?: Key extends keyof Target ? Target[Key] : Keys;
} & { [key: string]: any; })[] {
  return obj instanceof Array
    ? obj
    : map(obj, (r, key) => Setter.setValue$$(r, defineKey, key))
}

export function convertArr2Map(arr: string[]): IKeyValueMap<boolean> {
  return arr ? REDUCE(arr, Setter.setTrue$$, {}) as any : {}
}

export function getSafeMapOptions(options?: string[] | IKeyValueMap<boolean>, defaultValue?: IKeyValueMap<boolean>): IKeyValueMap<boolean> {
  return Constant$.IS_ARR(options) ? convertArr2Map(options) : (isObject(options) ? options : defaultValue)
}

export function convertKeys2ValuesMap<O extends IKeyValueMap<string>>(obj: O): { [K in O[keyof O]]: K } {
  return obj ? REDUCE(Object.entries(obj), Setter.setWithEntriesReverse$$, {}) as any : {}
}

/**
 * 将下拉OptionList转化为Map<value, label>用于快速翻译查表
 * @param arr 
 * @param labelKey 
 * @param valKey 
 */
export function convertOptions2Map<T extends IKeyValueMap>(arr: T[], labelKey: TKey = 'label', valKey: TKey = 'value'): IKeyValueMap {
  return REDUCE(arr, (r, i) => Setter.setWith$$(r, i, valKey, labelKey), {})
}
