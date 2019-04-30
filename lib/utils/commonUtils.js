"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var lodash_1 = require("lodash");
var EventEmitter_1 = require("./EventEmitter");
var HttpBox_1 = require("./HttpBox");
var _1 = __importDefault(require("."));
var TypeLib_1 = require("./TypeLib");
// const _ = {
//   filter,map,forEach
// }
if (!Object.keys) {
    Object.keys = lodash_1.keys;
}
if (!Object.values) {
    Object.values = lodash_1.values;
}
function jsxIf(bool, when, elseValue) {
    if ((_1.default.isFunctionFilter(bool) || (function () { return bool; }))()) {
        return when;
    }
    else {
        return elseValue;
    }
}
exports.jsxIf = jsxIf;
exports.default = {
    jsxIf: jsxIf,
    stubArray: lodash_1.stubArray,
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
        return lodash_1.isFunction(functionOrValue) ? functionOrValue.apply(void 0, __spread(computedArgs)) : functionOrValue;
    },
    castFunction: function (value) {
        return lodash_1.isFunction(value) ? value : function () { return value; };
    },
    castString: function (value) {
        return lodash_1.isString(value) ? value : lodash_1.toString(value);
    },
    argShifter: function (todoFunc, startIndex) {
        if (startIndex === void 0) { startIndex = 1; }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return todoFunc.apply(void 0, __spread(lodash_1.takeRight(args, args.length - startIndex)));
        };
    },
    modelValidator: function (fieldName, validator) {
        var fieldSearcher = lodash_1.property(fieldName);
        if (lodash_1.isRegExp(validator)) {
            return function (model) { return validator.test(fieldSearcher(model)); };
        }
        else if (lodash_1.isFunction(validator)) {
            return function (model) { return validator(fieldSearcher(model), model, fieldName, validator); };
        }
        else {
            return function (model) { return lodash_1.isEqual(fieldSearcher(model), validator); };
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
            result[length] = _1.default.isObject(array[length]) ? array[length][key] : undefined;
        }
        while (pLength) {
            var wlength = 8;
            var tmp = rLength + pLength;
            while (wlength) {
                var index = tmp - wlength--;
                result[index] = _1.default.isObject(array[index]) ? array[index][key] : undefined;
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
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
            array[offset + index] = values[index];
        }
        return array;
    },
    arrayPushDive: function (arrayTarget, array) {
        var rLength = array.length % 8, tLength = lodash_1.values.length;
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
        return _1.default.modelValidator(fieldName, validator)(model);
    },
    castArray: function (value, allowEmpty) {
        if (allowEmpty === void 0) { allowEmpty = true; }
        return allowEmpty ? lodash_1.castArray(value) : (_1.default.isNotEmptyValue(value) ? lodash_1.castArray(value) : []);
    },
    castObjectArray: function (objOrArr, allowEmpty) {
        if (allowEmpty === void 0) { allowEmpty = true; }
        return TypeLib_1.typeFilterUtils.isArrayFilter(objOrArr, allowEmpty
            ? _1.default.isObject(objOrArr) && [objOrArr]
            : _1.default.isNotEmptyObject(objOrArr) && [objOrArr]) || [];
    },
    createGroupWith: function (list, keyOrWith) {
        return lodash_1.reduce(_1.default.isArrayFilter(list, []), function (map, item) {
            var mapKey = lodash_1.isString(keyOrWith) ? item[keyOrWith] : (lodash_1.isFunction(keyOrWith) ? keyOrWith(item) : "default");
            map[mapKey] = TypeLib_1.typeFilterUtils.isArrayFilter(map[mapKey], []);
            map[mapKey].push(item);
            return map;
        }, {});
    },
    getEventEmitter: function () {
        return new EventEmitter_1.EventEmitter();
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
        var _a = _1.default.isObjectFilter(params) || {}, _b = _a.query, query = _b === void 0 ? {} : _b, _c = _a.path, pathSet = _c === void 0 ? undefined : _c, other = __rest(_a, ["query", "path"]);
        var path = instance.$route.path.split('\/');
        path.pop(); // 吐出当前页
        instance.$router.push(__assign({}, other, { path: path.join('\/'), query: __assign({}, TypeLib_1.typeFilterUtils.isObjectFilter(query, {}), { force: isConfirm === false || isConfirm === true }) }));
    },
    HttpBox: HttpBox_1.HttpBox,
    testEmitter: new EventEmitter_1.EventEmitter(),
    last: lodash_1.last,
    cloneDeep: lodash_1.cloneDeep,
    toArray: lodash_1.toArray,
    isEqual: function (valueA, valueB, noStrict) {
        if (noStrict === void 0) { noStrict = false; }
        var ia = _1.default.isNotEmptyValueFilter;
        if (noStrict) {
            return ia(valueA) === ia(valueB) || lodash_1.isEqual(ia(valueA), ia(valueB));
        }
        return lodash_1.isEqual(valueA, valueB);
    },
    reduce: lodash_1.reduce,
    forEach: lodash_1.forEach,
    concat: lodash_1.concat,
    escapeRegExp: lodash_1.escapeRegExp
};
