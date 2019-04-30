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
var _1 = __importDefault(require("./"));
var CommonDto_1 = __importDefault(require("./CommonDto"));
function zipEmptyData(object, isRemoveRepeat) {
    if (isRemoveRepeat === void 0) { isRemoveRepeat = true; }
    return lodash_1.isArray(object)
        ? _1.default.pipe(lodash_1.filter(object, function (v) { return _1.default.isNotEmptyValue(v); }), function (list) { return _1.default.jsxIf(isRemoveRepeat, Array.from(new Set(list)), list); })
        : lodash_1.reduce(lodash_1.filter(lodash_1.keys(object), function (k) { return _1.default.isNotEmptyValue(object[k]); }), function (o, key) {
            var _a;
            return lodash_1.assign(o, (_a = {}, _a[key] = object[key], _a));
        }, {});
}
exports.zipEmptyData = zipEmptyData;
exports.CustomUtils = {
    uuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    },
    createObjectKey: function (obj) {
        return lodash_1.join(lodash_1.concat(lodash_1.keys(obj), lodash_1.values(obj)));
    },
    pipe: function (data) {
        var funcArr = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            funcArr[_i - 1] = arguments[_i];
        }
        return lodash_1.reduce(funcArr, function (value, func) { return (_1.default.isFunctionFilter(func) || _1.default.stubFunction)(value); }, data);
    },
    zipEmptyData: zipEmptyData,
    zipEmptyDataNative: function (object) {
        return lodash_1.isArray(object)
            ? object.filter(function (v) { return _1.default.isNotEmptyValue(v); })
            : Object.keys(object)
                .filter(function (k) { return _1.default.isNotEmptyValue(object[k]); })
                .reduce(function (o, k) {
                var _a;
                return Object.assign(o, (_a = {},
                    _a[k] = object[k],
                    _a));
            }, {});
    },
    downloadFile: function (fileId, fileName) {
        var a = document.createElement('a');
        a.href = "/api/file/get?id=" + fileId;
        a.download = fileName || fileId;
        a.click();
        a.remove();
    },
    // 判断两个数组是否无序相等
    likeArray: function (arr, array) {
        var e_1, _a;
        // if the other array is a falsy value, return
        if (!_1.default.isArray(array) || !_1.default.isArray(arr))
            return false;
        // compare lengths - can save a lot of time 
        if (arr.length != array.length)
            return false;
        var _loop_1 = function (v) {
            if (_1.default.isNil(lodash_1.find(array, function (item) { return _1.default.isEqual(item, v); }))) {
                return { value: false };
            }
        };
        try {
            for (var arr_1 = __values(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
                var v = arr_1_1.value;
                var state_1 = _loop_1(v);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (arr_1_1 && !arr_1_1.done && (_a = arr_1.return)) _a.call(arr_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    },
    getDtoOrFormValue: function (key, formOrDto) {
        if (formOrDto instanceof CommonDto_1.default) {
            return formOrDto.get(key);
        }
        else if (_1.default.isObject(formOrDto)) {
            return formOrDto[key];
        }
        else {
            return undefined;
        }
    },
    jsGetAge: function (strBirthday) {
        var returnAge;
        var strBirthdayArr = strBirthday.split("-");
        var birthYear = strBirthdayArr[0];
        var birthMonth = strBirthdayArr[1];
        var birthDay = strBirthdayArr[2];
        var d = new Date();
        var nowYear = d.getFullYear();
        var nowMonth = d.getMonth() + 1;
        var nowDay = d.getDate();
        if (nowYear + '' == birthYear) {
            returnAge = 0; //同年 则为0岁
        }
        else {
            var ageDiff = nowYear - parseInt(birthYear); //年之差
            if (ageDiff > 0) {
                if (nowMonth + '' == birthMonth) {
                    var dayDiff = nowDay - parseInt(birthDay); //日之差
                    if (dayDiff < 0) {
                        returnAge = ageDiff - 1;
                    }
                    else {
                        returnAge = ageDiff;
                    }
                }
                else {
                    var monthDiff = nowMonth - parseInt(birthMonth); //月之差
                    if (monthDiff < 0) {
                        returnAge = ageDiff - 1;
                    }
                    else {
                        returnAge = ageDiff;
                    }
                }
            }
            else {
                returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
            }
        }
        return returnAge; //返回周岁年龄
    },
    connectTo: function (target, source) {
        var e_2, _a;
        var keyNames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            keyNames[_i - 2] = arguments[_i];
        }
        if (_1.default.isNil(target) || _1.default.isNil(source)) {
            return false;
        }
        if (keyNames.length == 0) {
            keyNames = Object.keys(source);
        }
        var _loop_2 = function (keyName) {
            if (!Object.getOwnPropertyDescriptor(target, keyName))
                Object.defineProperty(target, keyName, {
                    get: function () {
                        return source[keyName];
                    },
                    set: function (value) {
                        source[keyName] = value;
                    }
                });
        };
        try {
            for (var keyNames_1 = __values(keyNames), keyNames_1_1 = keyNames_1.next(); !keyNames_1_1.done; keyNames_1_1 = keyNames_1.next()) {
                var keyName = keyNames_1_1.value;
                _loop_2(keyName);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (keyNames_1_1 && !keyNames_1_1.done && (_a = keyNames_1.return)) _a.call(keyNames_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return true;
    },
    getListDifferent: function (listA, listB, deep) {
        if (deep === void 0) { deep = false; }
        return {
            push: lodash_1.differenceWith(listB, listA, deep ? (function (a, b) { return lodash_1.isEqual(a, b); }) : []),
            pull: lodash_1.differenceWith(listA, listB, deep ? (function (a, b) { return lodash_1.isEqual(a, b); }) : [])
        };
    },
    createCommonDto: function (model) { return new CommonDto_1.default(model); },
    /**
     * 代码解释器，返回getInnerWarpField解释数组
     * @param { string } keyStr
     * @param { any } defaultValue
     * @return { [][] } 二维数组
     */
    getExpressByStr: function (keyStr, defaultValue) {
        var paramList = __spread((keyStr.match(/(.*?)\.|(.*?)\[(.*)\]|(.+?)$/ig, ''))).map(function (i) { return i.split(/\[|\]|\[\]|\./ig).filter(function (i) { return !['', '.'].includes(i); }); });
        return lodash_1.reduce(paramList, function (list, _a, reduceIndex, reduceList) {
            var _b = __read(_a), prototeryName = _b[0], indexList = _b.slice(1);
            return list.concat(__spread([
                [prototeryName, indexList.length > 0 ? [] : (reduceIndex < reduceList.length - 1 ? {} : defaultValue)]
            ], indexList.map(function (i, index) {
                return [parseInt(i), (index < indexList.length - 1 ? [] : ((index === indexList.length - 1 && reduceIndex === reduceList.length - 1) ? defaultValue : {}))];
            })));
        }, []);
    },
    /**
     * 从对象中提取成员，不存在则新建一个成员（默认为一个空对象）
     * 初始值可用[成员名|初始值]的形式来自定义
     * 提取对象逐渐深入，一个对象一次只能提取一个成员（或他的子成员的子成员）
     * @param { {} } main
     * @param  {...(string | [string, string | [] | {}])} proteryNames
     */
    getPropertyFieldByCreate: function (main) {
        var proteryNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            proteryNames[_i - 1] = arguments[_i];
        }
        var isObject = _1.default.isObject, isEmptyValue = _1.default.isEmptyValue, isNotEmptyArray = _1.default.isNotEmptyArray, isString = _1.default.isString;
        return lodash_1.reduce(proteryNames, function (final, next, index, list) {
            if (!isObject(next)) {
                return undefined;
            }
            else if (isNotEmptyArray(next)) {
                var _a = __read(next, 2), keyName = _a[0], defaultValue = _a[1];
                if (isEmptyValue(final[keyName])) {
                    final[keyName] = (defaultValue === undefined ? (index < list.length - 2 ? {} : undefined) : defaultValue);
                }
                return final[keyName];
            }
            else if (isString(next)) {
                if (isEmptyValue(final[next])) {
                    final[next] = {};
                }
                return final[next];
            }
            else {
                return undefined;
            }
        }, main);
    },
    getPropByPath: function (obj, path, strict) {
        if (strict === void 0) { strict = false; }
        var tempObj = obj;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');
        var keyArr = path.split('.');
        var i = 0;
        for (var len = keyArr.length; i < len - 1; ++i) {
            if (!tempObj && !strict)
                break;
            var key = keyArr[i];
            if (key in tempObj) {
                tempObj = tempObj[key];
            }
            else {
                if (strict) {
                    throw new Error('please transfer a valid prop path to form item!');
                }
                break;
            }
        }
        return {
            o: tempObj,
            k: keyArr[i],
            v: tempObj ? tempObj[keyArr[i]] : null
        };
    }
};
exports.default = exports.CustomUtils;
