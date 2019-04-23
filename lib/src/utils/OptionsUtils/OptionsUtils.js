var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        var searchMatcher_1 = map(searchKey, function (key) { return createEqualsMatcher(key); });
        return function (key) {
            return some(searchMatcher_1, function (match) { return match(key); });
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
        var label = item.label, value = item.value;
        var name_1 = typeFilterUtils.isNotEmptyValueFilter(label, value, item);
        return createEqualsMatcher(labelSearcher)(name_1, value, item);
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
        var label = item.label;
        var value = typeFilterUtils.isNotEmptyValueFilter(item.value, item);
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
        var label = item.label;
        var value = typeFilterUtils.isNotEmptyValueFilter(item.value, item);
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
        var label = item.label, value = item.value;
        var name_2 = typeFilterUtils.isNotEmptyValueFilter(label, value, item);
        return keyMatcher(name_2, value, item);
    }
    return false;
}
export function safeGetOptions(optionList, searchKey, keyMatcherFunc, single) {
    if (single === void 0) { single = false; }
    if (isNotEmptyArray(optionList)) {
        var keyMatcher_1 = createEqualsMatcher(searchKey);
        return ((single ? find : filter)(optionList, function (item) { return keyMatcherFunc(keyMatcher_1, item); })) || (single ? undefined : []);
    }
    return (single ? undefined : []);
}
/**
 * 通过Label从optionList中获取匹配的option
 * @param optionList
 * @param searchName
 * @param single
 */
export function getOptionsByLabel(optionList, searchName, single) {
    if (single === void 0) { single = false; }
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
export function getOptionsByKey(optionList, searchKey, single) {
    if (single === void 0) { single = false; }
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
        var items = getOptionsByValue(option, selectedValue, false);
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
    var itemList = getOptionsByLabel(option, searchName, false);
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
    var i = getOptionsByLabel(optionList, label, true);
    return ((i instanceof Object) && !Utils.isArray(i)) ? i.value : undefined;
}
/**
 *
 * @param optionList
 * @param value
 */
export function valueToLabel(optionList, value) {
    var i = getOptionsByValue(optionList, value, true);
    return ((i instanceof Object) && !Utils.isArray(i)) ? i.label : undefined;
}
/**
 * 批量转换value到label
 * @param options
 * @param value
 * @param joinKey
 */
export function valuesToLabels(options, value, joinKey) {
    var result = Utils.isArrayFilter(typeFilterUtils.isArrayFilter(Utils.arrayMapToKeysDive(getOptionsByValue(options, value) || [], 'label'), [])) || [];
    return !isNil(joinKey) ? join(result, joinKey) : result;
}
/**
 * 批量转换label到value
 * @param options
 * @param label
 * @param joinKey
 */
export function labelsToValues(options, label, joinKey) {
    var result = Utils.castArray(typeFilterUtils.isArrayFilter(Utils.arrayMapToKeysDive(getOptionsByLabel(options, label) || [], 'value'), []));
    return !isNil(joinKey) ? join(result, joinKey) : result;
}
/**
 *
 * @param codeType
 * @param valueLabel
 * @param valueKey
 */
export function getCodeListByKey(codeType, valueLabel, valueKey) {
    if (valueLabel === void 0) { valueLabel = false; }
    if (valueKey === void 0) { valueKey = false; }
    var isStrF = typeFilterUtils.isStringFilter, isArrayFilter = typeFilterUtils.isArrayFilter;
    if (isArray(codeType)) {
        return function (keyWord, isOnlySearch) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (isOnlySearch && !Utils.isNotEmptyString(keyWord)) {
                        return [2 /*return*/, codeType];
                    }
                    return [2 /*return*/, castArray(getOptionsByKey(codeType, new RegExp(keyWord)))];
                });
            });
        };
    }
    else if (isFunction(codeType)) {
        return function (keyWord, isOnlySearch) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, codeType(keyWord)];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, map(isArrayFilter(res, []) || [], function (_a, index) {
                                    var value = _a.codeCode, label = _a.codeName, nativeLabel = _a.label;
                                    return ({ label: isStrF(label, nativeLabel), value: valueLabel ? label : value, key: valueKey ? value : index });
                                })];
                    }
                });
            });
        };
    }
    return function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    };
}
export default {
    getCodeListByKey: getCodeListByKey,
    getOptionsByLabel: getOptionsByLabel,
    getOptionsByValue: getOptionsByValue,
    isOptionsItemSelected: isOptionsItemSelected,
    createEqualsMatcher: createEqualsMatcher,
    isLabelMatchedItem: isLabelMatchedItem,
    valueToLabel: valueToLabel,
    labelToValue: labelToValue,
    valuesToLabels: valuesToLabels,
    labelsToValues: labelsToValues,
    isValueMatchedItem: isValueMatchedItem,
    isLabelMatchedItemByMatcher: isLabelMatchedItemByMatcher,
    isValueMatchedItemByMatcher: isValueMatchedItemByMatcher,
    optionsSelectedMatch: optionsSelectedMatch
};
//# sourceMappingURL=OptionsUtils.js.map