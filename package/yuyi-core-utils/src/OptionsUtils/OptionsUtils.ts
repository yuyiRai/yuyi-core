import { arrayMapToKeysDive } from '@/commonUtils';
import { IsTrue, IKeyValueMap } from '../TsUtils';
import { ArrayIterator, castArray, escapeRegExp, filter, find, isArray, isEqual, isFunction, isNil, isRegExp, join, map, some } from '../LodashExtra';
import { isNotEmptyArray, isNotEmptyArrayStrict, isNotEmptyString, isNotEmptyValue, typeFilterUtils } from '../TypeLib';
import { IOptionsUtils } from './interface'

/**
 * 操作Options的工具类
 * @beta 
 */
export class OptionsUtils {
  /**
   * 提供匹配方法/正则/匹配项数组/其它，返回通用匹配方法
   * @param searchKey 
   */
  public static createEqualsMatcher<K = any>(searchKey: IOptionsUtils.SearchKey<K>): IOptionsUtils.keyMatcher {
    if (isFunction(searchKey)) {
      return searchKey;
    } else if (isRegExp(searchKey)) {
      return function (key: string) {
        return searchKey.test(key)
      };
    } else if (isArray(searchKey)) {
      const searchMatcher = map(searchKey, key => this.createEqualsMatcher(key));
      return function (key) {
        return some(searchMatcher, match => match(key));
      }
    } else {
      return function (key) {
        return isEqual(searchKey, key)
      }
    }
  }
  /**
   * 
   * @param labelSearcher 
   * @param item 
   */
  public static isLabelMatchedItem(labelSearcher: IOptionsUtils.SearchKey<string>, item: IOptionsUtils.Option): boolean {
    if (isNotEmptyValue(item)) {
      const { label, value } = item;
      const name = typeFilterUtils.isNotEmptyValueFilter(label, value, item);
      return this.createEqualsMatcher(labelSearcher)(name, value, item)
    }
    return false
  }
  /**
   * 
   * @param valueSearcher 
   * @param item 
   */
  public static isValueMatchedItem(valueSearcher: IOptionsUtils.SearchKey<string>, item: IOptionsUtils.Option): boolean {
    if (isNotEmptyValue(item)) {
      const { label } = item;
      const value = typeFilterUtils.isNotEmptyValueFilter(item.value, item);
      return this.createEqualsMatcher(valueSearcher)(value, label, item)
    }
    return false
  }

  /**
   * {@inheritDoc IOptionsUtils.KeyMatcherFunc}
   * @param keyMatcher 
   * @param item 
   */
  public static isValueMatchedItemByMatcher(keyMatcher: IOptionsUtils.keyMatcher, item: IOptionsUtils.Option): boolean {
    if (isNotEmptyValue(item)) {
      const { label } = item;
      const value = typeFilterUtils.isNotEmptyValueFilter(item.value, item);
      return keyMatcher(value, label, item)
    }
    return false
  }

  /**
   * {@inheritDoc IOptionsUtils.KeyMatcherFunc}
   * @param keyMatcher 
   * @param item 
   */
  public static isLabelMatchedItemByMatcher(keyMatcher: IOptionsUtils.keyMatcher, item: IOptionsUtils.Option): boolean {
    if (isNotEmptyValue(item)) {
      const { label, value } = item;
      const name = typeFilterUtils.isNotEmptyValueFilter(label, value, item);
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
   * {@link (OptionsUtils:namespace).getOptions | IOptionsUtils.getOptions()}
   */
  public static getOptions<
    TOption = IOptionsUtils.Option,
    FindOne extends boolean = false,
    TResult = IsTrue<FindOne, TOption | undefined, TOption[]>
  >(
    optionList: TOption[],
    searchKey: IOptionsUtils.SearchKey<any>,
    keyMatcherFunc: IOptionsUtils.KeyMatcherFunc,
    findOne?: FindOne
  ): TResult {
    if (isNotEmptyArray(optionList)) {
      const keyMatcher = this.createEqualsMatcher(searchKey)
      return ((findOne ? find : filter)(
        optionList,
        item => keyMatcherFunc(keyMatcher, item))
      ) || (findOne ? undefined : []) as any;
    }
    return findOne ? undefined : [] as any;
  }

  /** {@inheritDoc OptionsUtils.getOptions} */
  public static getOptionsByLabel<T = IOptionsUtils.Option, K = string>(optionList: T[], searchName: IOptionsUtils.SearchKey<K>): T[];

  /** {@inheritDoc OptionsUtils.getOptions} */
  public static getOptionsByLabel<T = IOptionsUtils.Option, K = string>(optionList: T[], searchName: IOptionsUtils.SearchKey<K>, findOne: true): T | undefined;

  public static getOptionsByLabel<T = IOptionsUtils.Option, K = string, O extends boolean = false>(optionList: T[], searchName: IOptionsUtils.SearchKey<K>, findOne?: O) {
    return this.getOptions(optionList, searchName, this.isLabelMatchedItemByMatcher, findOne)
  }

  /** {@inheritDoc OptionsUtils.getOptions} */
  public static getOptionsByValue<T = IOptionsUtils.Option, K = string>(optionList: T[], searchValue: IOptionsUtils.SearchKey<K>): T[]
  
  /** {@inheritDoc OptionsUtils.getOptions} */
  public static getOptionsByValue<T = IOptionsUtils.Option, K = string>(optionList: T[], searchValue: IOptionsUtils.SearchKey<K>, findOne: true): T | undefined
  
  public static getOptionsByValue<T = IOptionsUtils.Option, K = string>(optionList: T[], searchValue: IOptionsUtils.SearchKey<K>, findOne?: boolean) {
    return this.getOptions(optionList, searchValue, this.isValueMatchedItemByMatcher, findOne)
  }

  /**
   * 
   * 通过Label或Value从optionList中获取匹配的option
   * @param optionList 
   * @param searchValue 
   * @param findOne 
   */
  public static getOptionsByKey<T = IOptionsUtils.Option, K = string>(optionList: T[], searchKey: IOptionsUtils.SearchKey<K>, findOne: boolean = false): T | T[] | undefined {
    return this.getOptions(optionList, searchKey, function (keyMatcher, item) {
      return this.isLabelMatchedItemByMatcher(keyMatcher, item) || this.isValueMatchedItemByMatcher(keyMatcher, item)
    }, findOne)
  }

  /**
   * 判断是否选择项
   * @param option 选项
   * @param searchLabel 选项显示名称
   * @param selectedValue 当前选择值
   */
  public static isOptionsItemSelected<T, K>(option: T[], searchName: IOptionsUtils.SearchKey<K>, selectedValue: IOptionsUtils.SearchKey<K>): boolean {
    if (isNotEmptyArray(option)) {
      const items = this.getOptionsByValue(option, selectedValue);
      return !isNil(this.getOptionsByLabel(castArray(items), searchName, true))
    }
    return false;
  }
  /**
   * 
   * @param option 
   * @param searchName 
   */
  public static optionsSelectedMatch<T, K>(option: T[], searchName: IOptionsUtils.SearchKey<K>): IOptionsUtils.keyMatcher {
    const itemList = this.getOptionsByLabel(option, searchName);
    if (isNotEmptyArrayStrict(itemList)) {
      return function (selectedValue) {
        return !isNil(this.getOptionsByValue(castArray(itemList), selectedValue, true))
      };
    }
    return function () { return false; };
  }




  /**
   * 
   * @param optionList 
   * @param label 
   */
  public static labelToValue(optionList: IOptionsUtils.Option[], label: IOptionsUtils.SearchKey<string>): string | undefined {
    const i: IOptionsUtils.Option | undefined = this.getOptionsByLabel<IOptionsUtils.Option, string>(optionList, label, true)
    return ((i instanceof Object) && !isArray(i)) ? i.value : undefined
  }

  /**
   * 
   * @param optionList 
   * @param value 
   */
  public static valueToLabel(optionList: IOptionsUtils.Option[], value: IOptionsUtils.SearchKey<string>): string | undefined {
    const i: IOptionsUtils.Option | undefined = this.getOptionsByValue<IOptionsUtils.Option, string>(optionList, value, true)
    return ((i instanceof Object) && !isArray(i)) ? i.label : undefined
  }


  public static valuesToLabels(options: IOptionsUtils.Option[], value: IOptionsUtils.SearchKey<string>): string[];
  public static valuesToLabels(options: IOptionsUtils.Option[], value: IOptionsUtils.SearchKey<string>, joinKey: string): string;
  /**
   * 批量转换value到label
   * @param options 
   * @param value 
   * @param joinKey 
   */
  public static valuesToLabels(options: IOptionsUtils.Option[], value: IOptionsUtils.SearchKey<string>, joinKey?: string): string | string[] {
    const result: string[] = typeFilterUtils.isArrayFilter(typeFilterUtils.isArrayFilter(
      arrayMapToKeysDive(
        this.getOptionsByValue(options, value) || [],
        'label'
      ), []
    )) || []
    return !isNil(joinKey) ? join(result, joinKey) : result
  }

  public static labelsToValues(options: IOptionsUtils.Option[], label: IOptionsUtils.SearchKey<string>): string[];
  public static labelsToValues(options: IOptionsUtils.Option[], label: IOptionsUtils.SearchKey<string>, joinKey: string): string
  /**
   * 批量转换label到value
   * @param options 
   * @param label 
   * @param joinKey 
   */
  public static labelsToValues(options: IOptionsUtils.Option[], label: IOptionsUtils.SearchKey<string>, joinKey?: string): string | string[] {
    const result: string[] = castArray(typeFilterUtils.isArrayFilter(
      arrayMapToKeysDive(
        this.getOptionsByLabel(options, label) || [],
        'value'
      ), []
    ))
    return !isNil(joinKey) ? join(result, joinKey) : result
  }



  public static getCodeListByKey(codeType: IOptionsUtils.Option[]): IOptionsUtils.RemoteSearcher
  public static getCodeListByKey(codeType: IOptionsUtils.OptionSearcher, optionFactory?: ArrayIterator<IKeyValueMap, IOptionsUtils.Option>): IOptionsUtils.RemoteSearcher
  /**
   * 
   * @param codeType 
   * @param valueLabel 
   * @param valueKey 
   */
  public static getCodeListByKey(codeType: IOptionsUtils.Option[] | IOptionsUtils.OptionSearcher, optionFactory?: ArrayIterator<IKeyValueMap, IOptionsUtils.Option>): IOptionsUtils.RemoteSearcher {
    // debugger
    const { isArrayFilter } = typeFilterUtils
    if (isArray(codeType)) {
      return async function (keyWord: string, isOnlySearch?: boolean): Promise<IOptionsUtils.Option[]> {
        if (isOnlySearch && !isNotEmptyString(keyWord)) {
          return codeType
        }
        return castArray(this.getOptionsByKey(codeType, new RegExp(escapeRegExp(keyWord))))
      }
    } else if (isFunction(codeType)) {
      return async function (keyWord: string, isOnlySearch?: boolean): Promise<IOptionsUtils.Option[]> {
        const res = isArrayFilter(await codeType(keyWord, isOnlySearch)) || [];
        return optionFactory ? map(res, optionFactory) : res
      }
    }
    return async function () { return [] }
  }

  public static convertValueOption(valueList: string[], isFull: boolean = false): IOptionsUtils.Option[] {
    return map(valueList, value => Object.assign({ value }, isFull ? { label: value } : {}))
  }
}