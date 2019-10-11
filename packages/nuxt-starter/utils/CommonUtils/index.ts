

export interface IKeyValueMap<V = any> {
  [key: string]: V;
}
import map from 'lodash/map'

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
  return obj instanceof Array ? obj : map(obj, (value, key) => ({ ...value, [defineKey]: key }))
}

export function convertArr2Map(arr: string[]) {
  return arr.reduce((o, r) => ({ ...o, [r]: true }), {} as IKeyValueMap<boolean>)
}
export function convertKeys2ValuesMap<
  O extends IKeyValueMap<string>
>(obj: O) {
  return Object.keys(obj).reduce((o, k) => ({ ...o, [obj[k]]: k }), {} as {
    [K in O[keyof O]]: K
  })
}

export function convertOptions2Map(arr: any[], labelKey = 'label', valueKey = 'value') {
  return arr.reduce((o, r) => ({ ...o, [r[valueKey]]: r[labelKey] }), {} as IKeyValueMap)
}

