import map from 'lodash/map'
import { Constant$ } from '../Constransts'

export namespace Setter {
  export function setWithOptions$$<T>(o: T, option: any, keywordKey: TKey, keywordVal: TKey): T {
    return (o[option[keywordKey]] = option[keywordVal], o)
  }

  export function setWithEntries$$<T>(o: T, option: [string, string]): T {
    return setWithOptions$$(o, option, 0, 1)
  }

  export function setWithEntriesReverse$$<T>(o: T, option: [string, string]): T {
    return setWithOptions$$(o, option, 1, 0)
  }

  export function setValue$$<T>(o: T, key: TKey, value: any): T {
    return (o[key] = value, o)
  }

  export function setTrue$$<T>(o: T, key: TKey): T {
    return (o[key] = true) && o
  }

  export function setWithKeyValue$$<T>(o: T, option: any): T {
    return (o[option.key] = option.value, o)
  }
  export function setWithValueLabel$$<T>(o: T, option: any): T {
    return (o[option.value] = option.label, o)
  }
  export function setWithLabelValue$$<T>(o: T, option: any): T {
    return (o[option.label] = option.value, o)
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
  return REDUCE(arr, Setter.setTrue$$, {}) as any
}

export function convertKeys2ValuesMap<O extends IKeyValueMap<string>>(obj: O): { [K in O[keyof O]]: K } {
  return REDUCE(Object.entries(obj), Setter.setWithEntriesReverse$$, {}) as any
}

/**
 * 将下拉OptionList转化为Map<value, label>用于快速翻译查表
 * @param arr 
 * @param labelKey 
 * @param valKey 
 */
export function convertOptions2Map<T extends IKeyValueMap>(arr: T[], labelKey: TKey = 'label', valKey: TKey = 'value'): IKeyValueMap {
  return REDUCE(arr, (r, i) => Setter.setWithOptions$$(r, i, valKey, labelKey), {})
}
