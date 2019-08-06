import { mergeWith, MergeWithCustomizer } from 'lodash'
import { stubFunction } from './stub'
import { isNumber } from './isNumber';
import { isFunction } from './isFunction';
import { isString, isBoolean, isRegExp } from '.';

/**
 * 栈合并
 * @param object 
 * @param source 
 * @remarks
 * 实现细节见: {@link https://www.lodashjs.com/docs/latest#_mergewithobject-sources-customizer}
 */
export function trackMerge<Object, Source>(object: Object, source: Source) {
  return mergeWith(object, source, customizer)
}

export enum CustomizerAdapterType {
  ArrWithArr = 10 - 0,
  ArrWithObj = 10 - 1, // 替换
  ArrWithStr = 10 - 2, // 替换
  ArrWithNum = 10 - 3, // 替换
  ArrWithBool = 10 - 4, // 替换
  ArrWithOther = 10 - 5, // 替换
  ArrWithFunc = 10 - 6 // 迭代运算
}

const AT = CustomizerAdapterType
export const CustomizerAdapter: { [key: string]: MergeWithCustomizer } = {
  [AT.ArrWithArr]: (value: any[], srcValue: any[]) => {
    return value.concat(srcValue)
  },
  [AT.ArrWithObj]: (_, srcValue: object) => {
    return srcValue
  },
  [AT.ArrWithStr]: (_, srcValue: string) => {
    return srcValue
  },
  [AT.ArrWithNum]: (_, srcValue: number) => {
    return srcValue
  },
  [AT.ArrWithBool]: (value: any[], srcValue: boolean) => {
    return srcValue === false ? srcValue : value;
  },
  [AT.ArrWithFunc]: (value: any[], srcValue: Type.Function<[any[]], any[]>) => {
    return srcValue(value)
  },
  [AT.ArrWithOther]: () => {
    return undefined
  }
}


export function useAdapter(adapter: object, adapterKey: string) {
  return adapter[adapterKey] || stubFunction
}

export const customizer: MergeWithCustomizer = (value: any, srcValue: any, key: string, object: any, source: any) => {
  const adapterKey = getKey(value, srcValue, 'Arr')
  const adapter = useAdapter(CustomizerAdapter, CustomizerAdapterType[adapterKey])
  // console.log(adapterKey, key, adapter)
  return adapter(value, srcValue) || srcValue
}

export function getKey(value: any, srcValue: any, firstExpect: string) {
  const str = []
  while (str.length < 2) {
    const key = str.length === 0 ? value : srcValue
    if (Array.isArray(key)) {
      str.push('Arr')
    } else if (isNumber(key)) {
      str.push('Num')
    } else if (isString(key)) {
      str.push('Str')
    } else if (isBoolean(key)) {
      str.push('Bool')
    } else if (isFunction(key)) {
      str.push('Func')
    } else if (isRegExp(key)) {
      str.push('Reg')
    } else {
      str.push('Other')
    }
    if (str[0] !== firstExpect) {
      return undefined
    }
  }
  return str.join('With')
}