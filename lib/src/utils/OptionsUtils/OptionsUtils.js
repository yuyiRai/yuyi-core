"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var lodash_1 = require("lodash");
var TypeLib_1 = require("../TypeLib");
var Utils_1 = require("../Utils");
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
        var searchMatcher_1 = lodash_1.map(searchKey, function (key) { return createEqualsMatcher(key); });
        return function (key) {
            return lodash_1.some(searchMatcher_1, function (match) { return match(key); });
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
        var label = item.label, value = item.value;
        var name_1 = TypeLib_1.typeFilterUtils.isNotEmptyValueFilter(label, value, item);
        return createEqualsMatcher(labelSearcher)(name_1, value, item);
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
        var label = item.label;
        var value = TypeLib_1.typeFilterUtils.isNotEmptyValueFilter(item.value, item);
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
        var label = item.label;
        var value = TypeLib_1.typeFilterUtils.isNotEmptyValueFilter(item.value, item);
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
        var label = item.label, value = item.value;
        var name_2 = TypeLib_1.typeFilterUtils.isNotEmptyValueFilter(label, value, item);
        return keyMatcher(name_2, value, item);
    }
    return false;
}
exports.isLabelMatchedItemByMatcher = isLabelMatchedItemByMatcher;
function safeGetOptions(optionList, searchKey, keyMatcherFunc, single) {
    if (single === void 0) { single = false; }
    if (TypeLib_1.isNotEmptyArray(optionList)) {
        var keyMatcher_1 = createEqualsMatcher(searchKey);
        return ((single ? lodash_1.find : lodash_1.filter)(optionList, function (item) { return keyMatcherFunc(keyMatcher_1, item); })) || (single ? undefined : []);
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
function getOptionsByLabel(optionList, searchName, single) {
    if (single === void 0) { single = false; }
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
function getOptionsByKey(optionList, searchKey, single) {
    if (single === void 0) { single = false; }
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
        var items = getOptionsByValue(option, selectedValue, false);
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
    var itemList = getOptionsByLabel(option, searchName, false);
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
    var i = getOptionsByLabel(optionList, label, true);
    return ((i instanceof Object) && !Utils_1.Utils.isArray(i)) ? i.value : undefined;
}
exports.labelToValue = labelToValue;
/**
 *
 * @param optionList
 * @param value
 */
function valueToLabel(optionList, value) {
    var i = getOptionsByValue(optionList, value, true);
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
    var result = Utils_1.Utils.isArrayFilter(TypeLib_1.typeFilterUtils.isArrayFilter(Utils_1.Utils.arrayMapToKeysDive(getOptionsByValue(options, value) || [], 'label'), [])) || [];
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
    var result = Utils_1.Utils.castArray(TypeLib_1.typeFilterUtils.isArrayFilter(Utils_1.Utils.arrayMapToKeysDive(getOptionsByLabel(options, label) || [], 'value'), []));
    return !lodash_1.isNil(joinKey) ? lodash_1.join(result, joinKey) : result;
}
exports.labelsToValues = labelsToValues;
/**
 *
 * @param codeType
 * @param valueLabel
 * @param valueKey
 */
function getCodeListByKey(codeType, valueLabel, valueKey) {
    if (valueLabel === void 0) { valueLabel = false; }
    if (valueKey === void 0) { valueKey = false; }
    var isStrF = TypeLib_1.typeFilterUtils.isStringFilter, isArrayFilter = TypeLib_1.typeFilterUtils.isArrayFilter;
    if (lodash_1.isArray(codeType)) {
        return function (keyWord, isOnlySearch) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (isOnlySearch && !Utils_1.Utils.isNotEmptyString(keyWord)) {
                        return [2 /*return*/, codeType];
                    }
                    return [2 /*return*/, lodash_1.castArray(getOptionsByKey(codeType, new RegExp(keyWord)))];
                });
            });
        };
    }
    else if (lodash_1.isFunction(codeType)) {
        return function (keyWord, isOnlySearch) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, codeType(keyWord)];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, lodash_1.map(isArrayFilter(res, []) || [], function (_a, index) {
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
exports.getCodeListByKey = getCodeListByKey;
exports.default = {
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