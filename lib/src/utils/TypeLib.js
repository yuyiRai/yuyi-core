"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var EventEmitter_1 = require("./EventEmitter");
var lodash_1 = require("lodash");
var mobx_1 = require("mobx");
// Array.prototype.map = ()
/**
 * 是否为空或异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param {*} value
 */
function isEmptyValue(value) {
    return value === '' || lodash_1.isNil(value) || lodash_1.isNaN(value);
}
exports.isEmptyValue = isEmptyValue;
/**
 * 是否非空且非异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param {*} value
 */
function isNotEmptyValue(value) {
    return !isEmptyValue(value);
}
exports.isNotEmptyValue = isNotEmptyValue;
function isNumber(value) {
    return lodash_1.isNumber(value) && !lodash_1.isNaN(value);
}
exports.isNumber = isNumber;
function isBooleanOrNumber(value) {
    return lodash_1.isBoolean(value) || isNumber(value);
}
exports.isBooleanOrNumber = isBooleanOrNumber;
function isEmptyArray(value) {
    return lodash_1.isArray(value) && lodash_1.isEmpty(value);
}
exports.isEmptyArray = isEmptyArray;
function isNotEmptyArray(value) {
    return lodash_1.isArray(value) && !lodash_1.isEmpty(value);
}
exports.isNotEmptyArray = isNotEmptyArray;
function isNotEmptyArrayStrict(value) {
    return lodash_1.isArray(value) && lodash_1.filter(value, function (i) { return isNotEmptyValue(i); }).length > 0;
}
exports.isNotEmptyArrayStrict = isNotEmptyArrayStrict;
function isEmptyArrayStrict(value) {
    return lodash_1.isArray(value) && lodash_1.filter(value, function (i) { return isNotEmptyValue(i); }).length === 0;
}
exports.isEmptyArrayStrict = isEmptyArrayStrict;
function isEmptyData(value) {
    return !lodash_1.isBoolean(value) && !lodash_1.isNumber(value) && (isEmptyArrayStrict(value) || lodash_1.isEmpty(value));
}
exports.isEmptyData = isEmptyData;
function isNotEmptyData(value) {
    return lodash_1.isBoolean(value) || lodash_1.isNumber(value) || !(isEmptyArrayStrict(value) || lodash_1.isEmpty(value));
}
exports.isNotEmptyData = isNotEmptyData;
function isEmptyObject(value, checkValue) {
    if (checkValue === void 0) { checkValue = false; }
    return lodash_1.isObject(value) && !lodash_1.isArray(value) && (checkValue ? lodash_1.filter(lodash_1.values(value), function (v) { return isNotEmptyData(v); }).length === 0 : lodash_1.isEmpty(value));
}
exports.isEmptyObject = isEmptyObject;
function isNotEmptyObject(value) {
    return lodash_1.isObject(value) && !lodash_1.isArray(value) && !lodash_1.isEmpty(value);
}
exports.isNotEmptyObject = isNotEmptyObject;
function isEventEmitter(emitter) {
    return emitter instanceof EventEmitter_1.EventEmitter;
}
exports.isEventEmitter = isEventEmitter;
exports.typeUtils = {
    isArrayLike: lodash_1.isArrayLike,
    isArray: lodash_1.isArray,
    isBoolean: lodash_1.isBoolean,
    isObject: lodash_1.isObject,
    // isObject<T extends object>(value?: any): value is T {
    //   return isObject(value); // && !isArray(value)
    // },
    isNumber: isNumber,
    isString: lodash_1.isString,
    isEmptyData: isEmptyData,
    isNotEmptyData: isNotEmptyData,
    isEventEmitter: isEventEmitter,
    /**
     * 判断非空字符串
     * @param {*} str
     */
    isNotEmptyString: function (str) {
        return lodash_1.isString(str) && str.length > 0;
    },
    isFunction: lodash_1.isFunction,
    isNotFunction: function (func) {
        return !lodash_1.isFunction(func);
    },
    isNil: lodash_1.isNil,
    isDate: lodash_1.isDate,
    isNaN: lodash_1.isNaN,
    isNotNaN: function (v) {
        return !lodash_1.isNaN(v);
    },
    isNilAll: function () {
        var valueArr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            valueArr[_i] = arguments[_i];
        }
        return lodash_1.filter(lodash_1.map(valueArr, function (value) { return lodash_1.isNil(value); }), function (is) { return is; }).length === valueArr.length;
    },
    isBooleanOrNumber: isBooleanOrNumber,
    isEmptyValue: isEmptyValue,
    isNotEmptyValue: isNotEmptyValue,
    isEmptyArray: isEmptyArray,
    isNotEmptyArray: isNotEmptyArray,
    isEmptyArrayStrict: isEmptyArrayStrict,
    isNotEmptyArrayStrict: isNotEmptyArrayStrict,
    isEmptyObject: isEmptyObject,
    isNotEmptyObject: isNotEmptyObject,
    toJS: mobx_1.toJS
};
var lodash_2 = require("lodash");
function todoFilter(handler) {
    function Filter() {
        var e_1, _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        try {
            for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                var v = values_1_1.value;
                if (handler(v)) {
                    return v;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return undefined;
    }
    ;
    return Filter;
}
exports.todoFilter = todoFilter;
/**
 *
 */
exports.typeFilterUtils = lodash_2.reduce(exports.typeUtils, function (group, func, key) {
    var _a;
    return lodash_2.assign(group, (_a = {},
        _a[key + "Filter"] = todoFilter(func),
        _a));
}, {});
// const a = typeFilterUtils.isArrayFilter<string>(1);
//# sourceMappingURL=TypeLib.js.map