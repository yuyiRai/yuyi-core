import { mapToKeyValues } from '../commonUtils';
import { Constant$, ArrayIterator } from '../Constransts';
import { castArray, escapeRegExp, filter, find, isArray, isEqual, isFunction, isNil, isNotEmptyValue, isRegExp, join, map } from '../LodashExtra';
import { IKeyValueMap, IsTrue } from '../TsUtils';
import { expect$ } from '../TypeLib';
import { isNotEmptyArray, isNotEmptyArrayStrict, isNotEmptyString } from '../TypeLib/expect';
import { KeyMatcherFunc, KeywordMatcher, Option, OptionSearcher, RemoteSearcher, SearchKey } from './interface';

export { SearchKey, KeywordMatcher as keyMatcher, KeyMatcherFunc, Option, OptionSearcher, RemoteSearcher };

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
  return null
}
// export namespace OptionsUtils {
/**
 * 提供匹配方法/正则/匹配项数组/其它，返回通用匹配方法
 * @param searchKey 
 */
export function createEqualsMatcher<K = any>(searchKey: SearchKey<K>): KeywordMatcher {
  var searchMatcher = createSearchMatcher(searchKey as any)
  if (searchMatcher) {
    return searchMatcher
  }
  if (Constant$.IS_ARR(searchKey)) {
    // console.error('isArray', searchKey);
    const searchMatcher = Constant$.MAP(searchKey, key => createEqualsMatcher(key));
    return function (key) {
      return Constant$.SOME(searchMatcher, match => match(key));
    }
  }
  // console.error('else', searchKey);
  return function (key) {
    return isEqual(searchKey, key)
  }
}
/**
 * 
 * @param labelSearcher 
 * @param item 
 */
export function isLabelMatchedItem<V extends string, D extends string>(labelSearcher: SearchKey<string>, item: Option<V, D>): boolean {
  if (expect$.isNotEmptyValue(item)) {
    var { label, value } = item;
    var name = expect$.isNotEmptyValue.filter(label, value, item);
    return createEqualsMatcher(labelSearcher)(name, value, item)
  }
  return false
}

/**
 * 
 * @param valueSearcher 
 * @param item 
 */
export function isValueMatchedItem(valueSearcher: SearchKey<string>, item: Option): boolean {
  if (expect$.isNotEmptyValue(item)) {
    var { label } = item;
    var value = expect$.isNotEmptyValue.filter(item.value, item);
    return createEqualsMatcher(valueSearcher)(value, label, item)
  }
  return false
}

/**
 * {@inheritDoc KeyMatcherFunc}
 * @param keyMatcher 
 * @param item 
 */
export function isValueMatchedItemByMatcher(keyMatcher: KeywordMatcher, item: Option): boolean {
  if (isNotEmptyValue(item)) {
    const { label } = item;
    const value = expect$.isNotEmptyValue.filter(item.value, item);
    return keyMatcher(value, label, item)
  }
  return false
}

/**
 * {@inheritDoc KeyMatcherFunc}
 * @param keyMatcher 
 * @param item 
 */
export function isLabelMatchedItemByMatcher(keyMatcher: KeywordMatcher, item: Option): boolean {
  // console.error('isNotEmptyValueFilter', item);
  if (isNotEmptyValue(item)) {
    const { label, value } = item;

    const name = expect$.isNotEmptyValue.filter(label, value, item);
    // console.error('isNotEmptyValueFilter', label, value, item, name);
    return keyMatcher(name, value, item)
  }
  return false
}


/**
 * 使用关键字从optionList中获取匹配的option
 * @typeParam T - Option对象类型
 * @typeParam TOption - Option对象类型
 * @typeParam K - Option关键标识符
 * @typeParam FindOne - Option关键标识符
 * @typeParam TResult - 匹配结果
 * 
 * @param optionList - 待搜索的Options数组
 * @param keyMatcherFunc - 匹配器
 * @param searchKey - 查找关键字
 * @param searchName - label关键字
 * @param searchValue - value关键字
 * @param findOne - 是否只返回第一个（默认为返回数组）
 * @returns 返回匹配的Option
 * @remarks
 * 相关api：
 * {@link getOptions | getOptions()}
 */
export function getOptions<
  TOption extends Option = Option,
  FindOne extends boolean = false,
  TResult = IsTrue<FindOne, TOption | undefined, TOption[]>
>(
  optionList: TOption[],
  searchKey: SearchKey<any>,
  keyMatcherFunc: KeyMatcherFunc,
  findOne?: FindOne
): TResult {
  if (isNotEmptyArray(optionList)) {
    const keyMatcher = createEqualsMatcher(searchKey)
    // console.log(findOne, keyMatcher, searchKey);

    return ((findOne ? find : filter)(
      optionList,
      item => keyMatcherFunc(keyMatcher, item))
    ) || (findOne ? undefined : []) as any;
  }
  return findOne ? undefined : [] as any;
}

/** {@inheritDoc getOptions} */
export function getOptionsByLabel<T = Option, K = string>(optionList: T[], searchName: SearchKey<K>): T[];

/** {@inheritDoc getOptions} */
export function getOptionsByLabel<T = Option, K = string>(optionList: T[], searchName: SearchKey<K>, findOne: true): T | undefined;

export function getOptionsByLabel<T extends Option, K = string, O extends boolean = false>(optionList: T[], searchName: SearchKey<K>, findOne?: O) {
  return getOptions(optionList, searchName, isLabelMatchedItemByMatcher, findOne)
}

/** {@inheritDoc getOptions} */
export function getOptionsByValue<T = Option, K = string>(optionList: T[], searchValue: SearchKey<K>): T[]

/** {@inheritDoc getOptions} */
export function getOptionsByValue<T = Option, K = string>(optionList: T[], searchValue: SearchKey<K>, findOne: true): T | undefined

export function getOptionsByValue<T extends Option, K = string>(optionList: T[], searchValue: SearchKey<K>, findOne?: boolean) {
  return getOptions(optionList, searchValue, isValueMatchedItemByMatcher, findOne)
}

/**
 * 
 * 通过Label或Value从optionList中获取匹配的option
 * @param optionList - 
 * @param searchValue - 
 * @param findOne - 
 */
export function getOptionsByKey<T extends Option, K = string>(optionList: T[], searchKey: SearchKey<K>, findOne: boolean = false): T | T[] | undefined {
  return getOptions(optionList, searchKey, function (keyMatcher, item) {
    return isLabelMatchedItemByMatcher(keyMatcher, item) || isValueMatchedItemByMatcher(keyMatcher, item)
  }, findOne)
}

/**
 * 判断是否选择项
 * @param option 选项
 * @param searchLabel 选项显示名称
 * @param selectedValue 当前选择值
 */
export function isOptionsItemSelected<T, K>(option: T[], searchName: SearchKey<K>, selectedValue: SearchKey<K>): boolean {
  if (isNotEmptyArray(option)) {
    const items = getOptionsByValue(option, selectedValue);
    return !isNil(getOptionsByLabel(castArray(items), searchName, true))
  }
  return false;
}

/**
 * 
 * @param option 
 * @param searchName 
 */
export function getOptionsSelectedMatch<T, K>(option: T[], searchName: SearchKey<K>): KeywordMatcher {
  const itemList = getOptionsByLabel(option, searchName);
  if (isNotEmptyArrayStrict(itemList)) {
    return function (selectedValue) {
      return !isNil(getOptionsByValue(castArray(itemList), selectedValue, true))
    };
  }
  return function () { return false; };
}




/**
 * 转换value为label
 * @param optionList 数据项
 * @param label 允许为查询器
 */
export function labelToValue(optionList: Option[], label: SearchKey<string>): string | undefined {
  const i: Option | undefined = getOptionsByLabel<Option, string>(optionList, label, true)
  return ((i instanceof Object) && !isArray(i)) ? i.value : undefined
}

/**
 * 转换value为label
 * @param optionList 数据项
 * @param value 允许为查询器
 */
export function valueToLabel(optionList: Option[], value: SearchKey<string>): string | undefined {
  const i: Option | undefined = getOptionsByValue<Option, string>(optionList, value, true)
  return ((i instanceof Object) && !isArray(i)) ? i.label : undefined
}


export function valuesToLabels(options: Option[], value: SearchKey<string>): string[];
export function valuesToLabels(options: Option[], value: SearchKey<string>, joinKey: string): string;
/**
 * 批量转换value到label
 * @param options 
 * @param value 
 * @param joinKey 
 */
export function valuesToLabels(options: Option[], value: SearchKey<string>, joinKey?: string): string | string[] {
  const result: string[] = expect$.isArray.filter(
    mapToKeyValues(
      getOptionsByValue(options, value) || [],
      'label'
    )
  ) || [];
  return !isNil(joinKey) ? join(result, joinKey) : result
}

export function labelsToValues(options: Option[], label: SearchKey<string>): string[];
export function labelsToValues(options: Option[], label: SearchKey<string>, joinKey: string): string

/**
 * 批量转换label到value
 * @param options 
 * @param label 
 * @param joinKey 
 */
export function labelsToValues(options: Option[], label: SearchKey<string>, joinKey?: string): string | string[] {
  const result: string[] = expect$.isArray.filter(
    mapToKeyValues(
      getOptionsByLabel(options, label) || [],
      'value'
    )
  ) || [];
  return !isNil(joinKey) ? join(result, joinKey) : result
}



export function getCodeListByKey(codeType: Option[]): RemoteSearcher
export function getCodeListByKey(codeType: OptionSearcher, optionFactory?: ArrayIterator<IKeyValueMap, Option>): RemoteSearcher
/**
 * 根据关键字查询OptionsList
 * @param codeType 
 * @param valueLabel 
 * @param valueKey 
 */
export function getCodeListByKey(codeType: Option[] | OptionSearcher, optionFactory?: ArrayIterator<IKeyValueMap, Option>): RemoteSearcher {
  // debugger
  if (isArray(codeType)) {
    return async function (keyWord: string, isOnlySearch?: boolean): Promise<Option[]> {
      if (isOnlySearch && !isNotEmptyString(keyWord)) {
        return codeType
      }
      return castArray(getOptionsByKey(codeType, new RegExp(escapeRegExp(keyWord))))
    }
  } else if (isFunction(codeType)) {
    return async function (keyWord: string, isOnlySearch?: boolean): Promise<Option[]> {
      const res = expect$.isArray.filter(await codeType(keyWord, isOnlySearch)) || [];
      return optionFactory ? map(res, optionFactory) : res
    }
  }
  return async function () { return [] }
}
/**
 * 将一个数据数组转换为OptoinsList
 * @param valueList 
 * @param useLabel 是否提供label，是则label同value
 */
export function convertValueOption(valueList: (string | number)[], useLabel?: boolean): Option[] {
  return map(valueList, function (value) {
    value = value + ''
    return Constant$.OBJ_ASSIGN({ [Constant$.KEY_VAL]: value }, useLabel ? { label: value } : {})
  })
}
