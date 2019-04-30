"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var utils_1 = __importDefault(require("../../../utils"));
exports.checkDateToDate = function (date, itemConfig) { return (function (rule, value, callback) {
    console.log('testt, check', value, itemConfig);
    var _a = __read(utils_1.default.isArrayFilter(value, lodash_1.map(itemConfig.code.split('|'), function (code) { return itemConfig.form[code]; })), 2), start = _a[0], end = _a[1];
    if (!utils_1.default.isNil(start) && !utils_1.default.isNil(end) && itemConfig.type === 'dateToDate') {
        console.log('testt, check', [start, end], itemConfig);
        // console.log(start,end,value)
        if (utils_1.default.isNotEmptyValue(end) && utils_1.default.isNotEmptyValue(start)) {
            var endTime = new Date(end).getTime();
            var startTime = new Date(start).getTime();
            if ((endTime - startTime) > 30 * 1000 * 60 * 60 * 24) {
                console.error(itemConfig.label + "\u65F6\u957F\u8D85\u51FA" + date + "\u5929");
                return callback(new Error(itemConfig.label + "\u65F6\u957F\u8D85\u51FA" + date + "\u5929\uFF01"));
            }
            else if (endTime < startTime) {
                return callback(new Error(itemConfig.label + "\u622A\u6B62\u65F6\u95F4\u4E0D\u80FD\u65E9\u4E8E\u8D77\u59CB\u65F6\u95F4\uFF01"));
            }
        }
    }
    // console.log('回调3', value)
    return callback();
}); };
exports.checkFutureDate = function (itemConfig) { return (function (rule, value, callback) {
    if (utils_1.default.isNotEmptyValue(value) && new Date().getTime() > new Date(value).getTime()) {
        return callback(new Error(itemConfig.label + "\u4E0D\u80FD\u65E9\u4E8E\u5F53\u524D\u65F6\u95F4"));
    }
    return callback();
}); };
exports.getDefaultRules = function (itemConfig) {
    return {
        dateToDate30: [{
                validator: exports.checkDateToDate(30, itemConfig),
                trigger: ['onChange'],
            }],
        futureDate: [{
                validator: exports.checkFutureDate(itemConfig),
                trigger: 'onChange'
            }]
    };
};
exports.DateUtils = {
    getDateRange: function (days) {
        var end = new Date();
        var start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
        return [start, end];
    }
};
