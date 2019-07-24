/// <reference types="lodash" />
import { IsTrue, IKeyValueMap } from '../TsUtils';
import { ArrayIterator } from '../LodashExtra';
import { IOptionsUtils } from './interface';
/**
 * 操作Options的工具类
 * @beta
 */
export declare class OptionsUtils {
    /**
     * 提供匹配方法/正则/匹配项数组/其它，返回通用匹配方法
     * @param searchKey
     */
    static createEqualsMatcher<K = any>(searchKey: IOptionsUtils.SearchKey<K>): IOptionsUtils.keyMatcher;
    /**
     *
     * @param labelSearcher
     * @param item
     */
    static isLabelMatchedItem(labelSearcher: IOptionsUtils.SearchKey<string>, item: IOptionsUtils.Option): boolean;
    /**
     *
     * @param valueSearcher
     * @param item
     */
    static isValueMatchedItem(valueSearcher: IOptionsUtils.SearchKey<string>, item: IOptionsUtils.Option): boolean;
    /**
     * {@inheritDoc IOptionsUtils.KeyMatcherFunc}
     * @param keyMatcher
     * @param item
     */
    static isValueMatchedItemByMatcher(keyMatcher: IOptionsUtils.keyMatcher, item: IOptionsUtils.Option): boolean;
    /**
     * {@inheritDoc IOptionsUtils.KeyMatcherFunc}
     * @param keyMatcher
     * @param item
     */
    static isLabelMatchedItemByMatcher(keyMatcher: IOptionsUtils.keyMatcher, item: IOptionsUtils.Option): boolean;
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
    static getOptions<TOption = IOptionsUtils.Option, FindOne extends boolean = false, TResult = IsTrue<FindOne, TOption | undefined, TOption[]>>(optionList: TOption[], searchKey: IOptionsUtils.SearchKey<any>, keyMatcherFunc: IOptionsUtils.KeyMatcherFunc, findOne?: FindOne): TResult;
    /** {@inheritDoc OptionsUtils.getOptions} */
    static getOptionsByLabel<T = IOptionsUtils.Option, K = string>(optionList: T[], searchName: IOptionsUtils.SearchKey<K>): T[];
    /** {@inheritDoc OptionsUtils.getOptions} */
    static getOptionsByLabel<T = IOptionsUtils.Option, K = string>(optionList: T[], searchName: IOptionsUtils.SearchKey<K>, findOne: true): T | undefined;
    /** {@inheritDoc OptionsUtils.getOptions} */
    static getOptionsByValue<T = IOptionsUtils.Option, K = string>(optionList: T[], searchValue: IOptionsUtils.SearchKey<K>): T[];
    /** {@inheritDoc OptionsUtils.getOptions} */
    static getOptionsByValue<T = IOptionsUtils.Option, K = string>(optionList: T[], searchValue: IOptionsUtils.SearchKey<K>, findOne: true): T | undefined;
    /**
     *
     * 通过Label或Value从optionList中获取匹配的option
     * @param optionList
     * @param searchValue
     * @param findOne
     */
    static getOptionsByKey<T = IOptionsUtils.Option, K = string>(optionList: T[], searchKey: IOptionsUtils.SearchKey<K>, findOne?: boolean): T | T[] | undefined;
    /**
     * 判断是否选择项
     * @param option 选项
     * @param searchLabel 选项显示名称
     * @param selectedValue 当前选择值
     */
    static isOptionsItemSelected<T, K>(option: T[], searchName: IOptionsUtils.SearchKey<K>, selectedValue: IOptionsUtils.SearchKey<K>): boolean;
    /**
     *
     * @param option
     * @param searchName
     */
    static optionsSelectedMatch<T, K>(option: T[], searchName: IOptionsUtils.SearchKey<K>): IOptionsUtils.keyMatcher;
    /**
     *
     * @param optionList
     * @param label
     */
    static labelToValue(optionList: IOptionsUtils.Option[], label: IOptionsUtils.SearchKey<string>): string | undefined;
    /**
     *
     * @param optionList
     * @param value
     */
    static valueToLabel(optionList: IOptionsUtils.Option[], value: IOptionsUtils.SearchKey<string>): string | undefined;
    static valuesToLabels(options: IOptionsUtils.Option[], value: IOptionsUtils.SearchKey<string>): string[];
    static valuesToLabels(options: IOptionsUtils.Option[], value: IOptionsUtils.SearchKey<string>, joinKey: string): string;
    static labelsToValues(options: IOptionsUtils.Option[], label: IOptionsUtils.SearchKey<string>): string[];
    static labelsToValues(options: IOptionsUtils.Option[], label: IOptionsUtils.SearchKey<string>, joinKey: string): string;
    static getCodeListByKey(codeType: IOptionsUtils.Option[]): IOptionsUtils.RemoteSearcher;
    static getCodeListByKey(codeType: IOptionsUtils.OptionSearcher, optionFactory?: ArrayIterator<IKeyValueMap, IOptionsUtils.Option>): IOptionsUtils.RemoteSearcher;
    static convertValueOption(valueList: string[], isFull?: boolean): IOptionsUtils.Option[];
}
//# sourceMappingURL=OptionsUtils.d.ts.map