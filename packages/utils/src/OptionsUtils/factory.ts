import { Constant$ } from '../Constransts';
import { isRegExp } from 'lodash';
import { isFunction } from '../LodashExtra/isFunction';
import { isEqual } from '../LodashExtra/isEqual';
import { KeywordMatcher, SearchKey } from './interface';
// /**
//  * 操作Options的工具集合
//  * @beta 
//  */
export function createSearchMatcher(searchKey: KeywordMatcher | RegExp): KeywordMatcher {
  if (isFunction(searchKey)) {
    // console.error('isFunction', searchKey);
    return searchKey;
  }
  if (isRegExp(searchKey)) {
    // console.error('isRegExp', searchKey);
    return Constant$.BindArg$$(Constant$.REGEXP_TEST, searchKey);
  }
  return null;
}
// export namespace OptionsUtils {
/**
 * 提供匹配方法/正则/匹配项数组/其它，返回通用匹配方法
 * @param searchKey
 */
export function createEqualsMatcher<K = any>(searchKey: SearchKey<K>): KeywordMatcher {
  var searchMatcher = createSearchMatcher(searchKey as any);
  if (searchMatcher) {
    return searchMatcher;
  }
  if (Constant$.IS_ARR(searchKey)) {
    // console.error('isArray', searchKey);
    const searchMatcher = Constant$.MAP(searchKey, key => createEqualsMatcher(key));
    return function (key) {
      return Constant$.SOME(searchMatcher, match => match(key));
    };
  }
  // console.error('else', searchKey);
  return function (key) {
    return isEqual(searchKey, key);
  };
}
