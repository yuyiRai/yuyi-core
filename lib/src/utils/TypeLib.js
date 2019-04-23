"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const EventEmitter_1 = require("./EventEmitter");
const lodash_1 = require("lodash");
const mobx_1 = require("mobx");
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
    return lodash_1.isArray(value) && lodash_1.filter(value, i => isNotEmptyValue(i)).length > 0;
}
exports.isNotEmptyArrayStrict = isNotEmptyArrayStrict;
function isEmptyArrayStrict(value) {
    return lodash_1.isArray(value) && lodash_1.filter(value, i => isNotEmptyValue(i)).length === 0;
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
function isEmptyObject(value, checkValue = false) {
    return lodash_1.isObject(value) && !lodash_1.isArray(value) && (checkValue ? lodash_1.filter(lodash_1.values(value), v => isNotEmptyData(v)).length === 0 : lodash_1.isEmpty(value));
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
    isNumber,
    isString: lodash_1.isString,
    isEmptyData,
    isNotEmptyData,
    isEventEmitter,
    /**
     * 判断非空字符串
     * @param {*} str
     */
    isNotEmptyString(str) {
        return lodash_1.isString(str) && str.length > 0;
    },
    isFunction: lodash_1.isFunction,
    isNotFunction(func) {
        return !lodash_1.isFunction(func);
    },
    isNil: lodash_1.isNil,
    isNaN: lodash_1.isNaN,
    isNotNaN(v) {
        return !lodash_1.isNaN(v);
    },
    isNilAll(...valueArr) {
        return lodash_1.filter(lodash_1.map(valueArr, value => lodash_1.isNil(value)), is => is).length === valueArr.length;
    },
    isBooleanOrNumber,
    isEmptyValue,
    isNotEmptyValue,
    isEmptyArray,
    isNotEmptyArray,
    isEmptyArrayStrict,
    isNotEmptyArrayStrict,
    isEmptyObject,
    isNotEmptyObject,
    toJS: mobx_1.toJS
};
const lodash_2 = require("lodash");
function todoFilter(handler) {
    function Filter(...values) {
        for (const v of values) {
            if (handler(v)) {
                return v;
            }
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
    return lodash_2.assign(group, {
        [key + "Filter"]: todoFilter(func)
    });
}, {});
// const a = typeFilterUtils.isArrayFilter<string>(1);
//# sourceMappingURL=TypeLib.js.map