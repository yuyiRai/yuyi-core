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
/* eslint-disable */
import { EventEmitter } from './EventEmitter';
import filter from "lodash/filter";
import isArray from "lodash/isArray";
import isBoolean from "lodash/isBoolean";
import isArrayLike from "lodash/isArrayLike";
import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import isNaN from "lodash/isNaN";
import isNil from "lodash/isNil";
import isDate from "lodash/isDate";
import { default as isNumberLodash } from "lodash/isNumber";
import isObject from "lodash/isObject";
import isString from "lodash/isString";
import map from "lodash/map";
import values from "lodash/values";
import trim from "lodash/trim";
import { toJS } from 'mobx';
import { Utils } from '.';
// Array.prototype.map = ()
/**
 * 是否为空或异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param {*} value
 */
export function isEmptyValue(value) {
    return (Utils.isString(value) && trim(value) === '') || isNil(value) || isNaN(value);
}
/**
 * 是否非空且非异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param {*} value
 */
export function isNotEmptyValue(value) {
    return !isEmptyValue(value);
}
export function isNumber(value) {
    return isNumberLodash(value) && !isNaN(value);
}
export function isBooleanOrNumber(value) {
    return isBoolean(value) || isNumber(value);
}
export function isEmptyArray(value) {
    return isArray(value) && isEmpty(value);
}
export function isNotEmptyArray(value) {
    return isArray(value) && !isEmpty(value);
}
export function isNotEmptyArrayStrict(value) {
    return isArray(value) && filter(value, function (i) { return isNotEmptyValue(i); }).length > 0;
}
export function isEmptyArrayStrict(value) {
    return isArray(value) && filter(value, function (i) { return isNotEmptyValue(i); }).length === 0;
}
export function isEmptyData(value) {
    return !isBoolean(value) && !isNumberLodash(value) && (isEmptyArrayStrict(value) || isEmpty(value));
}
export function isNotEmptyData(value) {
    return isBoolean(value) || isNumberLodash(value) || !(isEmptyArrayStrict(value) || isEmpty(value));
}
export function isEmptyObject(value, checkValue) {
    if (checkValue === void 0) { checkValue = false; }
    return isObject(value) && !isArray(value) && (checkValue ? filter(values(value), function (v) { return isNotEmptyData(v); }).length === 0 : isEmpty(value));
}
export function isNotEmptyObject(value) {
    return isObject(value) && !isArray(value) && !isEmpty(value);
}
export function isEventEmitter(emitter) {
    return emitter instanceof EventEmitter;
}
export var typeUtils = {
    isArrayLike: isArrayLike,
    isArray: isArray,
    isBoolean: isBoolean,
    isObject: isObject,
    // isObject<T extends object>(value?: any): value is T {
    //   return isObject(value); // && !isArray(value)
    // },
    isNumber: isNumber,
    isString: isString,
    isEmptyData: isEmptyData,
    isNotEmptyData: isNotEmptyData,
    isEventEmitter: isEventEmitter,
    /**
     * 判断非空字符串
     * @param {*} str
     */
    isNotEmptyString: function (str) {
        return isString(str) && str.length > 0;
    },
    isFunction: isFunction,
    isNotFunction: function (func) {
        return !isFunction(func);
    },
    isNil: isNil,
    isDate: isDate,
    isNaN: isNaN,
    isNotNaN: function (v) {
        return !isNaN(v);
    },
    isNilAll: function () {
        var valueArr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            valueArr[_i] = arguments[_i];
        }
        return filter(map(valueArr, function (value) { return isNil(value); }), function (is) { return is; }).length === valueArr.length;
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
    toJS: toJS
};
import assign from "lodash/assign";
import reduce from "lodash/reduce";
export function todoFilter(handler) {
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
/**
 *
 */
export var typeFilterUtils = reduce(typeUtils, function (group, func, key) {
    var _a;
    return assign(group, (_a = {},
        _a[key + "Filter"] = todoFilter(func),
        _a));
}, {});
// const a = typeFilterUtils.isArrayFilter<string>(1);
//# sourceMappingURL=TypeLib.js.map