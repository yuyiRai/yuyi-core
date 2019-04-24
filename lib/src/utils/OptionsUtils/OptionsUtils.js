"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const lodash_1 = require("lodash");
const TypeLib_1 = require("../TypeLib");
const Utils_1 = require("../Utils");
/**
 * 提供匹配方法/正则/匹配项数组/其它，返回通用匹配方法
 * @param searchKey
 */
function createEqualsMatcher(searchKey) {
    if (lodash_1.isFunction(searchKey)) {
        return searchKey;
    }
    else if (lodash_1.isRegExp(searchKey)) {
        return function (key) {
            return searchKey.test(key);
        };
    }
    else if (lodash_1.isArray(searchKey)) {
        const searchMatcher = lodash_1.map(searchKey, key => createEqualsMatcher(key));
        return function (key) {
            return lodash_1.some(searchMatcher, match => match(key));
        };
    }
    else {
        return function (key) {
            return lodash_1.isEqual(searchKey, key);
        };
    }
}
exports.createEqualsMatcher = createEqualsMatcher;
/**
 *
 * @param labelSearcher
 * @param item
 */
function isLabelMatchedItem(labelSearcher, item) {
    if (TypeLib_1.isNotEmptyValue(item)) {
        const { label, value } = item;
        const name = TypeLib_1.typeFilterUtils.isNotEmptyValueFilter(label, value, item);
        return createEqualsMatcher(labelSearcher)(name, value, item);
    }
    return false;
}
exports.isLabelMatchedItem = isLabelMatchedItem;
/**
 *
 * @param valueSearcher
 * @param item
 */
function isValueMatchedItem(valueSearcher, item) {
    if (TypeLib_1.isNotEmptyValue(item)) {
        const { label } = item;
        const value = TypeLib_1.typeFilterUtils.isNotEmptyValueFilter(item.value, item);
        return createEqualsMatcher(valueSearcher)(value, label, item);
    }
    return false;
}
exports.isValueMatchedItem = isValueMatchedItem;
/**
 * @type { KeyMatcherFunc }
 * @param keyMatcher
 * @param item
 */
function isValueMatchedItemByMatcher(keyMatcher, item) {
    if (TypeLib_1.isNotEmptyValue(item)) {
        const { label } = item;
        const value = TypeLib_1.typeFilterUtils.isNotEmptyValueFilter(item.value, item);
        return keyMatcher(value, label, item);
    }
    return false;
}
exports.isValueMatchedItemByMatcher = isValueMatchedItemByMatcher;
/**
 * @type { KeyMatcherFunc }
 * @param keyMatcher
 * @param item
 */
function isLabelMatchedItemByMatcher(keyMatcher, item) {
    if (TypeLib_1.isNotEmptyValue(item)) {
        const { label, value } = item;
        const name = TypeLib_1.typeFilterUtils.isNotEmptyValueFilter(label, value, item);
        return keyMatcher(name, value, item);
    }
    return false;
}
exports.isLabelMatchedItemByMatcher = isLabelMatchedItemByMatcher;
function safeGetOptions(optionList, searchKey, keyMatcherFunc, single = false) {
    if (TypeLib_1.isNotEmptyArray(optionList)) {
        const keyMatcher = createEqualsMatcher(searchKey);
        return ((single ? lodash_1.find : lodash_1.filter)(optionList, item => keyMatcherFunc(keyMatcher, item))) || (single ? undefined : []);
    }
    return (single ? undefined : []);
}
exports.safeGetOptions = safeGetOptions;
/**
 * 通过Label从optionList中获取匹配的option
 * @param optionList
 * @param searchName
 * @param single
 */
function getOptionsByLabel(optionList, searchName, single = false) {
    return safeGetOptions(optionList, searchName, isLabelMatchedItemByMatcher, single);
}
exports.getOptionsByLabel = getOptionsByLabel;
/**
 * 通过Value从optionList中获取匹配的option
 * @param optionList
 * @param searchValue
 * @param single
 */
function getOptionsByValue(optionList, searchValue, single) {
    return safeGetOptions(optionList, searchValue, isValueMatchedItemByMatcher, single);
}
exports.getOptionsByValue = getOptionsByValue;
/**
 *
 * 通过Label或Value从optionList中获取匹配的option
 * @param optionList
 * @param searchValue
 * @param single
 */
function getOptionsByKey(optionList, searchKey, single = false) {
    return safeGetOptions(optionList, searchKey, function (keyMatcher, item) {
        return isLabelMatchedItemByMatcher(keyMatcher, item) || isValueMatchedItemByMatcher(keyMatcher, item);
    }, single);
}
exports.getOptionsByKey = getOptionsByKey;
/**
 * 判断是否选择项
 * @param option 选项
 * @param searchLabel 选项显示名称
 * @param selectedValue 当前选择值
 */
function isOptionsItemSelected(option, searchName, selectedValue) {
    if (TypeLib_1.isNotEmptyArray(option)) {
        const items = getOptionsByValue(option, selectedValue, false);
        return !lodash_1.isNil(getOptionsByLabel(lodash_1.castArray(items), searchName, true));
    }
    return false;
}
exports.isOptionsItemSelected = isOptionsItemSelected;
/**
 *
 * @param option
 * @param searchName
 */
function optionsSelectedMatch(option, searchName) {
    const itemList = getOptionsByLabel(option, searchName, false);
    if (TypeLib_1.isNotEmptyArrayStrict(itemList)) {
        return function (selectedValue) {
            return !lodash_1.isNil(getOptionsByValue(lodash_1.castArray(itemList), selectedValue, true));
        };
    }
    return function () { return false; };
}
exports.optionsSelectedMatch = optionsSelectedMatch;
/**
 *
 * @param optionList
 * @param label
 */
function labelToValue(optionList, label) {
    const i = getOptionsByLabel(optionList, label, true);
    return ((i instanceof Object) && !Utils_1.Utils.isArray(i)) ? i.value : undefined;
}
exports.labelToValue = labelToValue;
/**
 *
 * @param optionList
 * @param value
 */
function valueToLabel(optionList, value) {
    const i = getOptionsByValue(optionList, value, true);
    return ((i instanceof Object) && !Utils_1.Utils.isArray(i)) ? i.label : undefined;
}
exports.valueToLabel = valueToLabel;
/**
 * 批量转换value到label
 * @param options
 * @param value
 * @param joinKey
 */
function valuesToLabels(options, value, joinKey) {
    const result = Utils_1.Utils.isArrayFilter(TypeLib_1.typeFilterUtils.isArrayFilter(Utils_1.Utils.arrayMapToKeysDive(getOptionsByValue(options, value) || [], 'label'), [])) || [];
    return !lodash_1.isNil(joinKey) ? lodash_1.join(result, joinKey) : result;
}
exports.valuesToLabels = valuesToLabels;
/**
 * 批量转换label到value
 * @param options
 * @param label
 * @param joinKey
 */
function labelsToValues(options, label, joinKey) {
    const result = Utils_1.Utils.castArray(TypeLib_1.typeFilterUtils.isArrayFilter(Utils_1.Utils.arrayMapToKeysDive(getOptionsByLabel(options, label) || [], 'value'), []));
    return !lodash_1.isNil(joinKey) ? lodash_1.join(result, joinKey) : result;
}
exports.labelsToValues = labelsToValues;
/**
 *
 * @param codeType
 * @param valueLabel
 * @param valueKey
 */
function getCodeListByKey(codeType, optionFactory) {
    const { isArrayFilter } = TypeLib_1.typeFilterUtils;
    if (lodash_1.isArray(codeType)) {
        return function (keyWord, isOnlySearch) {
            return __awaiter(this, void 0, void 0, function* () {
                if (isOnlySearch && !Utils_1.Utils.isNotEmptyString(keyWord)) {
                    return codeType;
                }
                return lodash_1.castArray(getOptionsByKey(codeType, new RegExp(keyWord)));
            });
        };
    }
    else if (lodash_1.isFunction(codeType)) {
        return function (keyWord, isOnlySearch) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = isArrayFilter(yield codeType(keyWord, isOnlySearch)) || [];
                return optionFactory ? lodash_1.map(res, optionFactory) : res;
            });
        };
    }
    return function () {
        return __awaiter(this, void 0, void 0, function* () { return []; });
    };
}
exports.getCodeListByKey = getCodeListByKey;
exports.default = {
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