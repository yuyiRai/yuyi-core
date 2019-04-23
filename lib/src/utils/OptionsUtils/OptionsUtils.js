/* eslint-disable */
import { castArray, filter, find, isArray, isEqual, isFunction, isNil, isRegExp, join, map, some } from 'lodash';
import { isNotEmptyArray, isNotEmptyArrayStrict, isNotEmptyValue, typeFilterUtils } from '../TypeLib';
import { Utils } from '../Utils';
/**
 * 提供匹配方法/正则/匹配项数组/其它，返回通用匹配方法
 * @param searchKey
 */
export function createEqualsMatcher(searchKey) {
    if (isFunction(searchKey)) {
        return searchKey;
    }
    else if (isRegExp(searchKey)) {
        return function (key) {
            return searchKey.test(key);
        };
    }
    else if (isArray(searchKey)) {
        const searchMatcher = map(searchKey, key => createEqualsMatcher(key));
        return function (key) {
            return some(searchMatcher, match => match(key));
        };
    }
    else {
        return function (key) {
            return isEqual(searchKey, key);
        };
    }
}
/**
 *
 * @param labelSearcher
 * @param item
 */
export function isLabelMatchedItem(labelSearcher, item) {
    if (isNotEmptyValue(item)) {
        const { label, value } = item;
        const name = typeFilterUtils.isNotEmptyValueFilter(label, value, item);
        return createEqualsMatcher(labelSearcher)(name, value, item);
    }
    return false;
}
/**
 *
 * @param valueSearcher
 * @param item
 */
export function isValueMatchedItem(valueSearcher, item) {
    if (isNotEmptyValue(item)) {
        const { label } = item;
        const value = typeFilterUtils.isNotEmptyValueFilter(item.value, item);
        return createEqualsMatcher(valueSearcher)(value, label, item);
    }
    return false;
}
/**
 * @type { KeyMatcherFunc }
 * @param keyMatcher
 * @param item
 */
export function isValueMatchedItemByMatcher(keyMatcher, item) {
    if (isNotEmptyValue(item)) {
        const { label } = item;
        const value = typeFilterUtils.isNotEmptyValueFilter(item.value, item);
        return keyMatcher(value, label, item);
    }
    return false;
}
/**
 * @type { KeyMatcherFunc }
 * @param keyMatcher
 * @param item
 */
export function isLabelMatchedItemByMatcher(keyMatcher, item) {
    if (isNotEmptyValue(item)) {
        const { label, value } = item;
        const name = typeFilterUtils.isNotEmptyValueFilter(label, value, item);
        return keyMatcher(name, value, item);
    }
    return false;
}
export function safeGetOptions(optionList, searchKey, keyMatcherFunc, single = false) {
    if (isNotEmptyArray(optionList)) {
        const keyMatcher = createEqualsMatcher(searchKey);
        return ((single ? find : filter)(optionList, item => keyMatcherFunc(keyMatcher, item))) || (single ? undefined : []);
    }
    return (single ? undefined : []);
}
/**
 * 通过Label从optionList中获取匹配的option
 * @param optionList
 * @param searchName
 * @param single
 */
export function getOptionsByLabel(optionList, searchName, single = false) {
    return safeGetOptions(optionList, searchName, isLabelMatchedItemByMatcher, single);
}
/**
 * 通过Value从optionList中获取匹配的option
 * @param optionList
 * @param searchValue
 * @param single
 */
export function getOptionsByValue(optionList, searchValue, single) {
    return safeGetOptions(optionList, searchValue, isValueMatchedItemByMatcher, single);
}
/**
 *
 * 通过Label或Value从optionList中获取匹配的option
 * @param optionList
 * @param searchValue
 * @param single
 */
export function getOptionsByKey(optionList, searchKey, single = false) {
    return safeGetOptions(optionList, searchKey, function (keyMatcher, item) {
        return isLabelMatchedItemByMatcher(keyMatcher, item) || isValueMatchedItemByMatcher(keyMatcher, item);
    }, single);
}
/**
 * 判断是否选择项
 * @param option 选项
 * @param searchLabel 选项显示名称
 * @param selectedValue 当前选择值
 */
export function isOptionsItemSelected(option, searchName, selectedValue) {
    if (isNotEmptyArray(option)) {
        const items = getOptionsByValue(option, selectedValue, false);
        return !isNil(getOptionsByLabel(castArray(items), searchName, true));
    }
    return false;
}
/**
 *
 * @param option
 * @param searchName
 */
export function optionsSelectedMatch(option, searchName) {
    const itemList = getOptionsByLabel(option, searchName, false);
    if (isNotEmptyArrayStrict(itemList)) {
        return function (selectedValue) {
            return !isNil(getOptionsByValue(castArray(itemList), selectedValue, true));
        };
    }
    return function () { return false; };
}
/**
 *
 * @param optionList
 * @param label
 */
export function labelToValue(optionList, label) {
    const i = getOptionsByLabel(optionList, label, true);
    return ((i instanceof Object) && !Utils.isArray(i)) ? i.value : undefined;
}
/**
 *
 * @param optionList
 * @param value
 */
export function valueToLabel(optionList, value) {
    const i = getOptionsByValue(optionList, value, true);
    return ((i instanceof Object) && !Utils.isArray(i)) ? i.label : undefined;
}
/**
 * 批量转换value到label
 * @param options
 * @param value
 * @param joinKey
 */
export function valuesToLabels(options, value, joinKey) {
    const result = Utils.isArrayFilter(typeFilterUtils.isArrayFilter(Utils.arrayMapToKeysDive(getOptionsByValue(options, value) || [], 'label'), [])) || [];
    return !isNil(joinKey) ? join(result, joinKey) : result;
}
/**
 * 批量转换label到value
 * @param options
 * @param label
 * @param joinKey
 */
export function labelsToValues(options, label, joinKey) {
    const result = Utils.castArray(typeFilterUtils.isArrayFilter(Utils.arrayMapToKeysDive(getOptionsByLabel(options, label) || [], 'value'), []));
    return !isNil(joinKey) ? join(result, joinKey) : result;
}
/**
 *
 * @param codeType
 * @param valueLabel
 * @param valueKey
 */
export function getCodeListByKey(codeType, valueLabel = false, valueKey = false) {
    const { isStringFilter: isStrF, isArrayFilter } = typeFilterUtils;
    if (isArray(codeType)) {
        return async function (keyWord, isOnlySearch) {
            if (isOnlySearch && !Utils.isNotEmptyString(keyWord)) {
                return codeType;
            }
            return castArray(getOptionsByKey(codeType, new RegExp(keyWord)));
        };
    }
    else if (isFunction(codeType)) {
        return async function (keyWord, isOnlySearch) {
            const res = await codeType(keyWord);
            return map(isArrayFilter(res, []) || [], ({ codeCode: value, codeName: label, label: nativeLabel }, index) => ({ label: isStrF(label, nativeLabel), value: valueLabel ? label : value, key: valueKey ? value : index }));
        };
    }
    return async function () { return []; };
}
export default {
    getCodeListByKey,
    getOptionsByLabel,
    getOptionsByValue,
    isOptionsItemSelected,
    createEqualsMatcher,
    isLabelMatchedItem,
    valueToLabel,
    labelToValue,
    valuesToLabels,
    labelsToValues,
    isValueMatchedItem,
    isLabelMatchedItemByMatcher,
    isValueMatchedItemByMatcher,
    optionsSelectedMatch
};
//# sourceMappingURL=OptionsUtils.js.map