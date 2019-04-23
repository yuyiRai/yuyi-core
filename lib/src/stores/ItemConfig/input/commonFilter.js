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
/* eslint-disable */
var ParseUtils_1 = require("../../../utils/ParseUtils");
var utils_1 = __importDefault(require("../../../utils"));
var CommonValueFilter = /** @class */ (function () {
    function CommonValueFilter(type) {
        this.type = type;
    }
    Object.defineProperty(CommonValueFilter.prototype, "filter", {
        get: function () {
            switch (this.type) {
                case 'group':
                    return this.groupFilter;
                case 'check':
                    return this.groupFilter;
                case 'checkOne':
                    return function (v) { return v === '1'; };
                case 'dateTime':
                    return function (v) { return utils_1.default.isDate(v) ? v :
                        (utils_1.default.isNotEmptyString(v)
                            ? (v.length < 11 ? (v + " 00:00:00") : v)
                            : undefined); };
                case 'dateToDate':
                    return function (v) { return utils_1.default.isArrayFilter(v, []).filter(function (i) { return utils_1.default.isNotEmptyValue(i); }); };
            }
            return this.normalFilter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonValueFilter.prototype, "filterToValue", {
        get: function () {
            switch (this.type) {
                case 'group':
                    return this.groupFilterToValue;
                case 'check':
                    return this.groupFilterToValue;
                case 'checkOne':
                    return function (v) {
                        return v === true ? '1' : '0';
                    };
                case 'dateTime':
                    return function (v) { return utils_1.default.isDate(v) ? v :
                        (utils_1.default.isNotEmptyString(v)
                            ? (v.length < 11 ? (v + " 00:00:00") : v)
                            : undefined); };
                case 'dateToDate':
                    return function (v) {
                        var _a = __read(utils_1.default.isArrayFilter(v, []).filter(function (i) { return utils_1.default.isNotEmptyValue(i); }), 2), s = _a[0], e = _a[1];
                        if (utils_1.default.isNotEmptyValue(s) && utils_1.default.isNotEmptyValue(e)) {
                            return ["" + s + (s.length < 11 ? ' 00:00:00' : ''), "" + (s.length < 11 ? ParseUtils_1.parseTime(new Date(new Date(e).setTime(new Date(e + ' 00:00:00').getTime() - 1))) : '')];
                        }
                        return [s, e];
                    };
            }
            return this.normalFilter;
        },
        enumerable: true,
        configurable: true
    });
    CommonValueFilter.prototype.normalFilter = function (value) {
        return utils_1.default.isNotEmptyValueFilter(value, null);
    };
    CommonValueFilter.prototype.groupFilter = function (string) {
        return utils_1.default.isNotEmptyString(string) ? string.split(',').filter(function (i) { return utils_1.default.isNotEmptyString(i); }) : [];
    };
    CommonValueFilter.prototype.groupFilterToValue = function (array) {
        return utils_1.default.isArrayFilter(array, []).filter(function (i) { return utils_1.default.isNotEmptyString(i); }).join(',');
    };
    return CommonValueFilter;
}());
exports.CommonValueFilter = CommonValueFilter;
function getFilter(type) {
    return new CommonValueFilter(type);
}
exports.default = getFilter;
//# sourceMappingURL=commonFilter.js.map