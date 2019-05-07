import { ArrayIterator } from 'lodash';
import { IKeyValueMap } from 'mobx';
export declare type SearchKey<T = any> = keyMatcher | RegExp | T[] | T;
export declare type keyMatcher = (key?: string, arg1?: any, arg2?: any) => boolean;
export declare type Option = {
    value?: string;
    label?: string;
    [key: string]: any;
};
/**
 * 提供匹配方法/正则/匹配项数组/其它，返回通用匹配方法
 * @param searchKey
 */
export declare function createEqualsMatcher<K = any>(searchKey: SearchKey<K>): keyMatcher;
/**
 *
 * @param labelSearcher
 * @param item
 */
export declare function isLabelMatchedItem(labelSearcher: SearchKey<string>, item: Option): boolean;
/**
 *
 * @param valueSearcher
 * @param item
 */
export declare function isValueMatchedItem(valueSearcher: SearchKey<string>, item: Option): boolean;
export declare type KeyMatcherFunc = (keyMatcher: keyMatcher, item: Option) => boolean;
/**
 * @type { KeyMatcherFunc }
 * @param keyMatcher
 * @param item
 */
export declare function isValueMatchedItemByMatcher(keyMatcher: keyMatcher, item: Option): boolean;
/**
 * @type { KeyMatcherFunc }
 * @param keyMatcher
 * @param item
 */
export declare function isLabelMatchedItemByMatcher(keyMatcher: keyMatcher, item: Option): boolean;
export declare function safeGetOptions<T = Option, K = string>(optionList: T[], searchKey: SearchKey<K>, keyMatcherFunc: KeyMatcherFunc, single?: boolean): T | T[] | undefined;
export declare function getOptionsByLabel<T = Option, K = string>(optionList: T[], searchName: SearchKey<K>): T[] | undefined;
export declare function getOptionsByLabel<T = Option, K = string>(optionList: T[], searchName: SearchKey<K>, single: false | undefined): T[] | undefined;
export declare function getOptionsByLabel<T = Option, K = string>(optionList: T[], searchName: SearchKey<K>, single: true): T | undefined;
export declare function getOptionsByValue<T = Option, K = string>(optionList: T[], searchValue: SearchKey<K>): T[] | undefined;
export declare function getOptionsByValue<T = Option, K = string>(optionList: T[], searchValue: SearchKey<K>, single: false | undefined): T[] | undefined;
export declare function getOptionsByValue<T = Option, K = string>(optionList: T[], searchValue: SearchKey<K>, single: true): T | undefined;
/**
 *
 * 通过Label或Value从optionList中获取匹配的option
 * @param optionList
 * @param searchValue
 * @param single
 */
export declare function getOptionsByKey<T = Option, K = string>(optionList: T[], searchKey: SearchKey<K>, single?: boolean): T | T[] | undefined;
/**
 * 判断是否选择项
 * @param option 选项
 * @param searchLabel 选项显示名称
 * @param selectedValue 当前选择值
 */
export declare function isOptionsItemSelected<T, K>(option: T[], searchName: SearchKey<K>, selectedValue: SearchKey<K>): boolean;
/**
 *
 * @param option
 * @param searchName
 */
export declare function optionsSelectedMatch<T, K>(option: T[], searchName: SearchKey<K>): keyMatcher;
export declare type RemoteSearcher = (key: string, isOnlySearch?: boolean) => Promise<Option[]>;
export declare type OptionSearcher = (key?: string, isOnlySearch?: boolean) => Promise<Option[]>;
/**
 *
 * @param optionList
 * @param label
 */
export declare function labelToValue(optionList: Option[], label: SearchKey<string>): string | undefined;
/**
 *
 * @param optionList
 * @param value
 */
export declare function valueToLabel(optionList: Option[], value: SearchKey<string>): string | undefined;
export declare function valuesToLabels(options: Option[], value: SearchKey<string>): string[];
export declare function valuesToLabels(options: Option[], value: SearchKey<string>, joinKey: string): string;
export declare function labelsToValues(options: Option[], label: SearchKey<string>): string[];
export declare function labelsToValues(options: Option[], label: SearchKey<string>, joinKey: string): string;
export declare function getCodeListByKey(codeType: Option[]): RemoteSearcher;
export declare function getCodeListByKey(codeType: OptionSearcher, optionFactory?: ArrayIterator<IKeyValueMap, Option>): RemoteSearcher;
declare const _default: {
    getCodeListByKey: typeof getCodeListByKey;
    getOptionsByLabel: typeof getOptionsByLabel;
    getOptionsByValue: typeof getOptionsByValue;
    isOptionsItemSelected: typeof isOptionsItemSelected;
    createEqualsMatcher: typeof createEqualsMatcher;
    isLabelMatchedItem: typeof isLabelMatchedItem;
    valueToLabel: typeof valueToLabel;
    labelToValue: typeof labelToValue;
    valuesToLabels: typeof valuesToLabels;
    labelsToValues: typeof labelsToValues;
    isValueMatchedItem: typeof isValueMatchedItem;
    isLabelMatchedItemByMatcher: typeof isLabelMatchedItemByMatcher;
    isValueMatchedItemByMatcher: typeof isValueMatchedItemByMatcher;
    optionsSelectedMatch: typeof optionsSelectedMatch;
};
export default _default;
