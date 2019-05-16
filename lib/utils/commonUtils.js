var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import castArray from "lodash/castArray";
import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import isEqual from "lodash/isEqual";
import isFunction from "lodash/isFunction";
import isRegExp from "lodash/isRegExp";
import concat from "lodash/concat";
import isString from "lodash/isString";
import keys from "lodash/keys";
import last from "lodash/last";
import property from "lodash/property";
import reduce from "lodash/reduce";
import escapeRegExp from "lodash/escapeRegExp";
import stubArray from "lodash/stubArray";
import takeRight from "lodash/takeRight";
import toArray from "lodash/toArray";
import toString from "lodash/toString";
import values from "lodash/values";
import { EventEmitter } from './EventEmitter';
import { HttpBox } from './HttpBox';
import Utils from '.';
import { typeFilterUtils } from './TypeLib';
// const _ = {
//   filter,map,forEach
// }
if (!Object.keys) {
    Object.keys = keys;
}
if (!Object.values) {
    Object.values = values;
}
export function jsxIf(bool, when, elseValue) {
    if ((Utils.isFunctionFilter(bool) || (function () { return bool; }))()) {
        return when;
    }
    else {
        return elseValue;
    }
}
export default {
    jsxIf: jsxIf,
    stubArray: stubArray,
    stubFunction: function () { },
    stubObject: function () {
        return {};
    },
    /**
     * cast computed
     * @param {*} functionOrValue
     * @param  {...any} computedArgs 计算用参数
     */
    castComputed: function (functionOrValue) {
        var computedArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            computedArgs[_i - 1] = arguments[_i];
        }
        return isFunction(functionOrValue) ? functionOrValue.apply(void 0, __spread(computedArgs)) : functionOrValue;
    },
    castFunction: function (value) {
        return isFunction(value) ? value : function () { return value; };
    },
    castString: function (value) {
        return isString(value) ? value : toString(value);
    },
    argShifter: function (todoFunc, startIndex) {
        if (startIndex === void 0) { startIndex = 1; }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return todoFunc.apply(void 0, __spread(takeRight(args, args.length - startIndex)));
        };
    },
    modelValidator: function (fieldName, validator) {
        var fieldSearcher = property(fieldName);
        if (isRegExp(validator)) {
            return function (model) { return validator.test(fieldSearcher(model)); };
        }
        else if (isFunction(validator)) {
            return function (model) { return validator(fieldSearcher(model), model, fieldName, validator); };
        }
        else {
            return function (model) { return isEqual(fieldSearcher(model), validator); };
        }
    },
    getTestArray: function (length) {
        var arr = [];
        for (var i = length; i > 0; i--) {
            arr[i - 1] = i;
        }
        return arr;
    },
    arrayMap: function (array, iteratee) {
        var length = array.length;
        var result = Array(length);
        while (length--) {
            result[length] = iteratee(array[length], length);
        }
        return result;
    },
    arrayMap2: function (array, iteratee) {
        var rLength = array.length % 8, length = rLength, pLength = array.length - rLength, result = Array(array.length);
        while (length--) {
            result[length] = iteratee(array[length], length);
        }
        while (pLength--) {
            var index = rLength + pLength;
            result[index] = iteratee(array[index], index);
        }
        return result;
    },
    arrayMap3: function (array, iteratee) {
        var index = -1, length = array.length, result = Array(length);
        while (++index < length) {
            result[index] = iteratee(array[index], index, array);
        }
        return result;
    },
    arrayMapDive: function (array, iteratee) {
        var rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
        while (length--) {
            if (array[length])
                result[length] = iteratee(array[length], length, array);
        }
        while (pLength) {
            var wlength = 8;
            var tmp = rLength + pLength;
            while (wlength) {
                var index = tmp - wlength--;
                if (array[index])
                    result[index] = iteratee(array[index], index, array);
            }
            pLength -= 8;
        }
        return result;
    },
    arrayMapToKeysDive: function (array, key) {
        var rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
        while (length--) {
            result[length] = Utils.isObject(array[length]) ? array[length][key] : undefined;
        }
        while (pLength) {
            var wlength = 8;
            var tmp = rLength + pLength;
            while (wlength) {
                var index = tmp - wlength--;
                result[index] = Utils.isObject(array[index]) ? array[index][key] : undefined;
            }
            pLength -= 8;
        }
        return result;
    },
    arrayForEachDive: function (array, iteratee) {
        var rLength = array.length % 8, length = rLength, pLength = (array.length - rLength);
        while (length--) {
            iteratee(array[length], length, array);
        }
        while (pLength) {
            var wlength = 8;
            var tmp = rLength + pLength;
            while (wlength) {
                var index = tmp - wlength--;
                iteratee(array[index], index, array);
            }
            pLength -= 8;
        }
    },
    arrayPush: function (array, values) {
        var values2 = values;
        var index = 0, length = values2.length, offset = array.length;
        while (index < length) {
            // debugger
            array[offset + index] = values2[index++];
        }
        return array;
    },
    arrayPushDive: function (arrayTarget, array) {
        var rLength = array.length % 8, tLength = values.length;
        var length = rLength, pLength = array.length - rLength, offset = 0;
        while (length--) {
            arrayTarget[tLength + offset++] = array[rLength - length - 1];
        }
        var maxPlangth = rLength + pLength + 8;
        while (pLength) {
            var tmp = maxPlangth - pLength;
            var length_1 = 8;
            while (length_1) {
                arrayTarget[tLength + offset++] = array[tmp - length_1--];
            }
            pLength -= 8;
        }
    },
    // test(length: number, pi = 8) {
    //   var test = Utils.getTestArray(length)
    //   var test2 = (item: any, index: any) => item > length / 2
    //   var test3 = (item: any, index: any) => Utils.arrayMapDive(test, test2)
    //   setTimeout(() => {
    //     console.time('arrayMap')
    //     Utils.arrayMap(test, test3)
    //     console.timeEnd('arrayMap')
    //   }, 0)
    //   setTimeout(() => {
    //     console.time('arrayMap2')
    //     Utils.arrayMap2(test, test3)
    //     console.timeEnd('arrayMap2')
    //   }, 0)
    //   setTimeout(() => {
    //     console.time('arrayMap3')
    //     Utils.arrayMap3(test, test3)
    //     console.timeEnd('arrayMap3')
    //   }, 0)
    //   setTimeout(() => {
    //     console.time('arrayMapDive')
    //     Utils.arrayMapDive(test, test3)
    //     console.timeEnd('arrayMapDive')
    //   }, 0)
    //   setTimeout(() => {
    //     console.time('_.map')
    //     _.map(test, test3)
    //     console.timeEnd('_.map')
    //   }, 0)
    //   setTimeout(() => {
    //     console.time('arrayFilter')
    //     Utils.arrayFilter(test, test3)
    //     console.timeEnd('arrayFilter')
    //   }, 0)
    //   setTimeout(() => {
    //     console.time('arrayFilterDive')
    //     Utils.arrayFilterDive(test, test3)
    //     console.timeEnd('arrayFilterDive')
    //   }, 0)
    //   setTimeout(() => {
    //     console.time('_.filter')
    //     _.filter(test, test3)
    //     console.timeEnd('_.filter')
    //   }, 0)
    //   setTimeout(() => {
    //     console.time('arrayForEachDive')
    //     var r8 = []
    //     Utils.arrayForEachDive(test, (item: any, index: any) => {
    //       r8.push(test3(item, index))
    //     })
    //     console.timeEnd('arrayForEachDive')
    //   }, 0)
    //   setTimeout(() => {
    //     console.time('_.forEach')
    //     var r8 = []
    //     _.forEach(test, (item, index) => {
    //       r8.push(test3(item, index))
    //     })
    //     console.timeEnd('_.forEach')
    //   }, 0)
    // },
    arrayFilter: function (array, predicate) {
        var length = array.length;
        var result = [];
        while (length--) {
            var value = array[length];
            predicate(value, length, array) && result.push(value);
        }
        return result;
    },
    arrayFilterDive: function (array, iteratee) {
        var rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = [];
        while (length--) {
            var index = rLength - length - 1;
            iteratee(array[index], index, array) && result.push(array[index]);
        }
        var maxPlangth = rLength + pLength + 8;
        while (pLength) {
            var wlength = 8;
            var tmp = maxPlangth - pLength;
            while (wlength) {
                var index = (tmp - wlength--);
                iteratee(array[index], index, array) && result.push(array[index]);
            }
            pLength -= 8;
        }
        return result;
    },
    validateModelField: function (model, fieldName, validator) {
        return Utils.modelValidator(fieldName, validator)(model);
    },
    castArray: function (value, allowEmpty) {
        if (allowEmpty === void 0) { allowEmpty = true; }
        return allowEmpty ? castArray(value) : (Utils.isNotEmptyValue(value) ? castArray(value) : []);
    },
    castObjectArray: function (objOrArr, allowEmpty) {
        if (allowEmpty === void 0) { allowEmpty = true; }
        return typeFilterUtils.isArrayFilter(objOrArr, allowEmpty
            ? Utils.isObject(objOrArr) && [objOrArr]
            : Utils.isNotEmptyObject(objOrArr) && [objOrArr]) || [];
    },
    createGroupWith: function (list, keyOrWith) {
        return reduce(Utils.isArrayFilter(list, []), function (map, item) {
            var mapKey = isString(keyOrWith) ? item[keyOrWith] : (isFunction(keyOrWith) ? keyOrWith(item) : "default");
            map[mapKey] = typeFilterUtils.isArrayFilter(map[mapKey], []);
            map[mapKey].push(item);
            return map;
        }, {});
    },
    getEventEmitter: function () {
        return new EventEmitter();
    },
    waitingPromise: function (time, emitValue, isError) {
        if (isError === void 0) { isError = false; }
        return new Promise(function (resolve, reject) {
            setTimeout(isError ? reject : resolve, time, emitValue);
        });
    },
    /**
     * 组件返回
     * @param { { $router: any, $route: any } } instance
     * @param {*} params
     * @param { boolean } isConfirm 是否是经过确认的离开
     */
    pathReturn: function (instance, params, isConfirm, useBack) {
        if (useBack) {
            return instance.$router.back();
        }
        var _a = Utils.isObjectFilter(params) || {}, _b = _a.query, query = _b === void 0 ? {} : _b, _c = _a.path, pathSet = _c === void 0 ? undefined : _c, other = __rest(_a, ["query", "path"]);
        var path = instance.$route.path.split('\/');
        path.pop(); // 吐出当前页
        instance.$router.push(__assign({}, other, { path: path.join('\/'), query: __assign({}, typeFilterUtils.isObjectFilter(query, {}), { force: isConfirm === false || isConfirm === true }) }));
    },
    HttpBox: HttpBox,
    testEmitter: new EventEmitter(),
    last: last,
    cloneDeep: cloneDeep,
    toArray: toArray,
    toString: toString,
    isEqual: function (valueA, valueB, noStrict) {
        if (noStrict === void 0) { noStrict = false; }
        var ia = Utils.isNotEmptyValueFilter;
        if (noStrict) {
            return ia(valueA) === ia(valueB) || isEqual(ia(valueA), ia(valueB));
        }
        else if (valueA === valueB) {
            return true;
        }
        return isEqual(valueA, valueB);
    },
    reduce: reduce,
    forEach: forEach,
    concat: concat,
    escapeRegExp: escapeRegExp
};
//# sourceMappingURL=commonUtils.js.map