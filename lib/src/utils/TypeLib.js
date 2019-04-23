/* eslint-disable */
import { EventEmitter } from './EventEmitter';
import { filter, isArray, isBoolean, isArrayLike, isEmpty, isFunction, isNaN, isNil, isNumber as isNumberLodash, isObject, isString, map, values } from 'lodash';
import { toJS } from 'mobx';
// Array.prototype.map = ()
/**
 * 是否为空或异常值，不包括0
 * 空值: null/undefined/''
 * 不包括空对象/空数组
 * @param {*} value
 */
export function isEmptyValue(value) {
    return value === '' || isNil(value) || isNaN(value);
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
    return isArray(value) && filter(value, i => isNotEmptyValue(i)).length > 0;
}
export function isEmptyArrayStrict(value) {
    return isArray(value) && filter(value, i => isNotEmptyValue(i)).length === 0;
}
export function isEmptyData(value) {
    return !isBoolean(value) && !isNumberLodash(value) && (isEmptyArrayStrict(value) || isEmpty(value));
}
export function isNotEmptyData(value) {
    return isBoolean(value) || isNumberLodash(value) || !(isEmptyArrayStrict(value) || isEmpty(value));
}
export function isEmptyObject(value, checkValue = false) {
    return isObject(value) && !isArray(value) && (checkValue ? filter(values(value), v => isNotEmptyData(v)).length === 0 : isEmpty(value));
}
export function isNotEmptyObject(value) {
    return isObject(value) && !isArray(value) && !isEmpty(value);
}
export function isEventEmitter(emitter) {
    return emitter instanceof EventEmitter;
}
export const typeUtils = {
    isArrayLike,
    isArray,
    isBoolean,
    isObject(value) {
        return isObject(value) && !isArray(value);
    },
    isNumber,
    isString,
    isEmptyData,
    isNotEmptyData,
    isEventEmitter,
    /**
     * 判断非空字符串
     * @param {*} str
     */
    isNotEmptyString(str) {
        return isString(str) && str.length > 0;
    },
    isFunction,
    isNotFunction(func) {
        return !isFunction(func);
    },
    isNil,
    isNaN,
    isNotNaN(v) {
        return !isNaN(v);
    },
    isNilAll(...valueArr) {
        return filter(map(valueArr, value => isNil(value)), is => is).length === valueArr.length;
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
    toJS
};
import { assign, reduce } from 'lodash';
export function todoFilter(handler) {
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
/**
 *
 */
export const typeFilterUtils = reduce(typeUtils, function (group, func, key) {
    return assign(group, {
        [key + "Filter"]: todoFilter(func)
    });
}, {});
// const a = typeFilterUtils.isArrayFilter<string>(1);
//# sourceMappingURL=TypeLib.js.map