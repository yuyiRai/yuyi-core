"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const lodash_1 = require("lodash");
const EventEmitter_1 = require("src/utils/EventEmitter");
const request_1 = __importStar(require("src/utils/request"));
const _1 = __importDefault(require("."));
const TypeLib_1 = require("./TypeLib");
const _ = {
    filter: lodash_1.filter, map: lodash_1.map, forEach: lodash_1.forEach
};
if (!Object.keys) {
    Object.keys = lodash_1.keys;
}
if (!Object.values) {
    Object.values = lodash_1.values;
}
function jsxIf(bool, when, elseValue) {
    if ((_1.default.isFunctionFilter(bool) || _1.default.stubFunction)()) {
        return when;
    }
    else {
        return elseValue;
    }
}
exports.jsxIf = jsxIf;
exports.default = {
    jsxIf,
    stubArray: lodash_1.stubArray,
    stubFunction() { },
    stubObject() {
        return {};
    },
    /**
     * cast computed
     * @param {*} functionOrValue
     * @param  {...any} computedArgs 计算用参数
     */
    castComputed(functionOrValue, ...computedArgs) {
        return lodash_1.isFunction(functionOrValue) ? functionOrValue(...computedArgs) : functionOrValue;
    },
    castFunction(value) {
        return lodash_1.isFunction(value) ? value : function () { return value; };
    },
    castString(value) {
        return lodash_1.isString(value) ? value : lodash_1.toString(value);
    },
    argShifter(todoFunc, startIndex = 1) {
        return function (...args) {
            return todoFunc(...lodash_1.takeRight(args, args.length - startIndex));
        };
    },
    modelValidator(fieldName, validator) {
        const fieldSearcher = lodash_1.property(fieldName);
        if (lodash_1.isRegExp(validator)) {
            return (model) => validator.test(fieldSearcher(model));
        }
        else if (lodash_1.isFunction(validator)) {
            return (model) => validator(fieldSearcher(model), model, fieldName, validator);
        }
        else {
            return (model) => lodash_1.isEqual(fieldSearcher(model), validator);
        }
    },
    getTestArray(length) {
        const arr = [];
        for (let i = length; i > 0; i--) {
            arr[i - 1] = i;
        }
        return arr;
    },
    arrayMap(array, iteratee) {
        var length = array.length;
        var result = Array(length);
        while (length--) {
            result[length] = iteratee(array[length], length);
        }
        return result;
    },
    arrayMap2(array, iteratee) {
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
    arrayMap3(array, iteratee) {
        var index = -1, length = array.length, result = Array(length);
        while (++index < length) {
            result[index] = iteratee(array[index], index, array);
        }
        return result;
    },
    arrayMapDive(array, iteratee) {
        let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
        while (length--) {
            if (array[length])
                result[length] = iteratee(array[length], length, array);
        }
        while (pLength) {
            let wlength = 8;
            const tmp = rLength + pLength;
            while (wlength) {
                const index = tmp - wlength--;
                if (array[index])
                    result[index] = iteratee(array[index], index, array);
            }
            pLength -= 8;
        }
        return result;
    },
    arrayMapToKeysDive(array, key) {
        let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = Array(array.length);
        while (length--) {
            result[length] = _1.default.isObject(array[length]) ? array[length][key] : undefined;
        }
        while (pLength) {
            let wlength = 8;
            const tmp = rLength + pLength;
            while (wlength) {
                const index = tmp - wlength--;
                result[index] = _1.default.isObject(array[index]) ? array[index][key] : undefined;
            }
            pLength -= 8;
        }
        return result;
    },
    arrayForEachDive(array, iteratee) {
        let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength);
        while (length--) {
            iteratee(array[length], length, array);
        }
        while (pLength) {
            let wlength = 8;
            const tmp = rLength + pLength;
            while (wlength) {
                const index = tmp - wlength--;
                iteratee(array[index], index, array);
            }
            pLength -= 8;
        }
    },
    arrayPush(array, values) {
        var index = -1, length = values.length, offset = array.length;
        while (++index < length) {
            array[offset + index] = values[index];
        }
        return array;
    },
    arrayPushDive(arrayTarget, array) {
        const rLength = array.length % 8, tLength = lodash_1.values.length;
        let length = rLength, pLength = array.length - rLength, offset = 0;
        while (length--) {
            arrayTarget[tLength + offset++] = array[rLength - length - 1];
        }
        const maxPlangth = rLength + pLength + 8;
        while (pLength) {
            const tmp = maxPlangth - pLength;
            let length = 8;
            while (length) {
                arrayTarget[tLength + offset++] = array[tmp - length--];
            }
            pLength -= 8;
        }
    },
    test(length, pi = 8) {
        var test = _1.default.getTestArray(length);
        var test2 = (item, index) => item > length / 2;
        var test3 = (item, index) => _1.default.arrayMapDive(test, test2);
        setTimeout(() => {
            console.time('arrayMap');
            _1.default.arrayMap(test, test3);
            console.timeEnd('arrayMap');
        }, 0);
        setTimeout(() => {
            console.time('arrayMap2');
            _1.default.arrayMap2(test, test3);
            console.timeEnd('arrayMap2');
        }, 0);
        setTimeout(() => {
            console.time('arrayMap3');
            _1.default.arrayMap3(test, test3);
            console.timeEnd('arrayMap3');
        }, 0);
        setTimeout(() => {
            console.time('arrayMapDive');
            _1.default.arrayMapDive(test, test3);
            console.timeEnd('arrayMapDive');
        }, 0);
        setTimeout(() => {
            console.time('_.map');
            _.map(test, test3);
            console.timeEnd('_.map');
        }, 0);
        setTimeout(() => {
            console.time('arrayFilter');
            _1.default.arrayFilter(test, test3);
            console.timeEnd('arrayFilter');
        }, 0);
        setTimeout(() => {
            console.time('arrayFilterDive');
            _1.default.arrayFilterDive(test, test3);
            console.timeEnd('arrayFilterDive');
        }, 0);
        setTimeout(() => {
            console.time('_.filter');
            _.filter(test, test3);
            console.timeEnd('_.filter');
        }, 0);
        setTimeout(() => {
            console.time('arrayForEachDive');
            var r8 = [];
            _1.default.arrayForEachDive(test, (item, index) => {
                r8.push(test3(item, index));
            });
            console.timeEnd('arrayForEachDive');
        }, 0);
        setTimeout(() => {
            console.time('_.forEach');
            var r8 = [];
            _.forEach(test, (item, index) => {
                r8.push(test3(item, index));
            });
            console.timeEnd('_.forEach');
        }, 0);
    },
    arrayFilter(array, predicate) {
        let length = array.length;
        const result = [];
        while (length--) {
            const value = array[length];
            predicate(value, length, array) && result.push(value);
        }
        return result;
    },
    arrayFilterDive(array, iteratee) {
        let rLength = array.length % 8, length = rLength, pLength = (array.length - rLength), result = [];
        while (length--) {
            const index = rLength - length - 1;
            iteratee(array[index], index, array) && result.push(array[index]);
        }
        let maxPlangth = rLength + pLength + 8;
        while (pLength) {
            let wlength = 8;
            const tmp = maxPlangth - pLength;
            while (wlength) {
                const index = (tmp - wlength--);
                iteratee(array[index], index, array) && result.push(array[index]);
            }
            pLength -= 8;
        }
        return result;
    },
    validateModelField(model, fieldName, validator) {
        return _1.default.modelValidator(fieldName, validator)(model);
    },
    castArray(value, allowEmpty = true) {
        return allowEmpty ? lodash_1.castArray(value) : (_1.default.isNotEmptyValue(value) ? lodash_1.castArray(value) : []);
    },
    castObjectArray(objOrArr, allowEmpty = true) {
        return TypeLib_1.typeFilterUtils.isArrayFilter(objOrArr, allowEmpty
            ? _1.default.isObject(objOrArr) && [objOrArr]
            : _1.default.isNotEmptyObject(objOrArr) && [objOrArr]) || [];
    },
    createGroupWith(list, keyOrWith) {
        return lodash_1.reduce(_1.default.isArrayFilter(list, []), function (map, item) {
            const mapKey = lodash_1.isString(keyOrWith) ? item[keyOrWith] : (lodash_1.isFunction(keyOrWith) ? keyOrWith(item) : "default");
            map[mapKey] = TypeLib_1.typeFilterUtils.isArrayFilter(map[mapKey], []);
            map[mapKey].push(item);
            return map;
        }, {});
    },
    getEventEmitter() {
        return new EventEmitter_1.EventEmitter();
    },
    waitingPromise(time, emitValue, isError = false) {
        return new Promise((resolve, reject) => {
            setTimeout(isError ? reject : resolve, time, emitValue);
        });
    },
    /**
     * 组件返回
     * @param { { $router: any, $route: any } } instance
     * @param {*} params
     * @param { boolean } isConfirm 是否是经过确认的离开
     */
    pathReturn(instance, params, isConfirm, useBack) {
        if (useBack) {
            return instance.$router.back();
        }
        const _a = _1.default.isObjectFilter(params) || {}, { query = {}, path: pathSet = undefined } = _a, other = __rest(_a, ["query", "path"]);
        const path = instance.$route.path.split('\/');
        path.pop(); // 吐出当前页
        instance.$router.push(Object.assign({}, other, { path: path.join('\/'), query: Object.assign({}, TypeLib_1.typeFilterUtils.isObjectFilter(query, {}), { force: isConfirm === false || isConfirm === true }) }));
    },
    request: request_1.default,
    nativeRequst: request_1.request,
    testEmitter: new EventEmitter_1.EventEmitter(),
    last: lodash_1.last,
    cloneDeep: lodash_1.cloneDeep,
    toArray: lodash_1.toArray,
    isEqual: lodash_1.isEqual,
    reduce: lodash_1.reduce,
    forEach: lodash_1.forEach
};
//# sourceMappingURL=commonUtils.js.map