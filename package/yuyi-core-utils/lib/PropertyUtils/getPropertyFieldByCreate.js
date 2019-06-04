/**
 * @module PropertyUtils
 */
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
import includes from "lodash/includes";
import reduce from "lodash/reduce";
import Utils from '..';
/**
 * 从对象中提取成员，不存在则新建一个成员（默认为一个空对象）
 * 提取对象逐渐深入，一个对象一次只能提取一个成员（或他的子成员的子成员）
 * @param main 键值对
 * @param proteryNames 属性描述
 * @typeparam V 返回值类型
 *
 * @group PropertyUtils
 * @example
 * const obj = {}
 * const a = getPropertyFieldByCreate(obj, 'a', ['a'], ['a', 'b'])
 *
 * console.log(a) // 'b'
 * console.log(obj) // {"a":{"a":{"a":"b"}}}
 *
 */
export function getPropertyFieldByCreate(main) {
    var proteryNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        proteryNames[_i - 1] = arguments[_i];
    }
    var isObject = Utils.isObject, isEmptyValue = Utils.isEmptyValue, isNotEmptyArray = Utils.isNotEmptyArray, isString = Utils.isString;
    return reduce(proteryNames, function (final, next, index, list) {
        if (isString(next)) {
            if (isEmptyValue(final[next])) {
                final[next] = {};
            }
            return final[next];
        }
        if (!isObject(next)) {
            return undefined;
        }
        else if (isNotEmptyArray(next)) {
            var _a = __read(next, 2), keyName = _a[0], defaultValue = _a[1];
            if (isEmptyValue(final[keyName])) {
                final[keyName] = (defaultValue === undefined ? (index < list.length - 1 ? {} : undefined) : defaultValue);
            }
            return final[keyName];
        }
        else {
            return undefined;
        }
    }, main);
}
/**
 * 代码解释器，返回getPropertyFieldByCreate解释数组
 * @param keyStr
 * @param defaultValue
 * @return 二维数组
 * @group PropertyUtils
 * @example
 * const matcher = getExpressByStr('a[1].b[0].d', 123)
 * console.log(matcher) // [ ["a", []] , [1, {}] , ["b", []] , [0, {}] , ["d", 123] ]
 */
export function getExpressByStr(keyStr, defaultValue) {
    var paramList = __spread((keyStr.match(/(.*?)\.|(.*?)\[(.*)\]|(.+?)$/ig, ''))).map(function (i) { return i.split(/\[|\]|\[\]|\./ig).filter(function (i) { return !includes(['', '.'], i); }); });
    return reduce(paramList, function (list, _a, reduceIndex, reduceList) {
        var _b = __read(_a), prototeryName = _b[0], indexList = _b.slice(1);
        return list.concat(__spread([
            [prototeryName, indexList.length > 0 ? [] : (reduceIndex < reduceList.length - 1 ? {} : defaultValue)]
        ], indexList.map(function (i, index) {
            // tslint:disable-next-line: radix
            return [parseInt(i), (index < indexList.length - 1 ? [] : ((index === indexList.length - 1 && reduceIndex === reduceList.length - 1) ? defaultValue : {}))];
        })));
    }, []);
}
//# sourceMappingURL=getPropertyFieldByCreate.js.map