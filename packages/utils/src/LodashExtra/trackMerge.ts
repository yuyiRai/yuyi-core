import { isBoolean, isRegExp, isString, mergeWith, MergeWithCustomizer } from 'lodash';
import { isFunction } from './isFunction';
import { isNumber } from './isNumber';
import { stubFunction } from './stub';
import { FunctionFactory, Constant$ } from '../Constransts';
/**
 * 栈合并
 * @param object 
 * @param source 
 * @remarks
 * 实现细节见: {@link https://www.lodashjs.com/docs/latest#_mergewithobject-sources-customizer}
 */
export function trackMerge<Object, Source>(object: Object, source: Source) {
  return mergeWith(object, source, trackMergeTo);
}

const enum Type {
  BASE,
  ARRAY,
  FUNCTION,
  OBJECT,
}
const enum CustomizerAdapterType {
  ArrWithBase = Type.ARRAY * 10 + Type.BASE, // 替换
  ArrWithArr = Type.ARRAY * 10 + Type.ARRAY,
  ArrWithObj = Type.ARRAY * 10 + Type.OBJECT, // 替换
  ArrWithFunc = Type.ARRAY * 10 + Type.FUNCTION // 迭代运算
}

const CustomizerAdapter: { [key: string]: MergeWithCustomizer; } = {
  [CustomizerAdapterType.ArrWithArr]: Constant$.ARR_CONCAT,
  [CustomizerAdapterType.ArrWithFunc](value: any[], srcValue: FunctionFactory.Base<[any[]], any[]>) {
    return srcValue(value);
  },
  [CustomizerAdapterType.ArrWithBase]: stubFunction
};


export function useAdapter<T = FunctionFactory.Base>(adapter: IKeyValueMap<T>, adapterKey: Exclude<TKey, symbol>) {
  return adapter[adapterKey] || stubFunction;
}

export const trackMergeTo: MergeWithCustomizer = (value: any, srcValue: any, key: string, object: any, source: any) => {
  const adapter = useAdapter<FunctionFactory.Base>(CustomizerAdapter, getType(value) * 10 + getType(srcValue));
  // console.log(adapterKey, key, adapter)
  return adapter(value, srcValue) || srcValue;
};

export function expectTo(value: any, arr: [any, any, boolean?][], elseValue?: any): any {
  var expect: any;
  const r = arr.find(
    (expectConfig) => {
      expect = expectConfig[0];
      return expect instanceof Function && expectConfig[2] !== false ? expect(value) : expect === value
    }
  );
  return (expect = r && r[1], expect !== undefined ? expect : elseValue);
}

function getType(value: any) {
  return expectTo(value, [
    [Array.isArray, Type.ARRAY],
    [isFunction, Type.FUNCTION],
    [value instanceof Object, Type.OBJECT],
    [Array.isArray, Type.ARRAY],
  ], Type.BASE);
}
