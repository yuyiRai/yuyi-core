"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const ParseUtils_1 = require("../../../utils/ParseUtils");
const utils_1 = __importDefault(require("../../../utils"));
class CommonValueFilter {
    constructor(type) {
        this.type = type;
    }
    get filter() {
        switch (this.type) {
            case 'group':
                return this.groupFilter;
            case 'check':
                return this.groupFilter;
            case 'checkOne':
                return (v) => v === '1';
            case 'dateTime':
                return (v) => utils_1.default.isDate(v) ? v :
                    (utils_1.default.isNotEmptyString(v)
                        ? (v.length < 11 ? (v + " 00:00:00") : v)
                        : undefined);
            case 'dateToDate':
                return (v) => utils_1.default.isArrayFilter(v, []).filter((i) => utils_1.default.isNotEmptyValue(i));
        }
        return this.normalFilter;
    }
    get filterToValue() {
        switch (this.type) {
            case 'group':
                return this.groupFilterToValue;
            case 'check':
                return this.groupFilterToValue;
            case 'checkOne':
                return (v) => {
                    return v === true ? '1' : '0';
                };
            case 'dateTime':
                return (v) => utils_1.default.isDate(v) ? v :
                    (utils_1.default.isNotEmptyString(v)
                        ? (v.length < 11 ? (v + " 00:00:00") : v)
                        : undefined);
            case 'dateToDate':
                return (v) => {
                    const [s, e] = utils_1.default.isArrayFilter(v, []).filter((i) => utils_1.default.isNotEmptyValue(i));
                    if (utils_1.default.isNotEmptyValue(s) && utils_1.default.isNotEmptyValue(e)) {
                        return [`${s}${s.length < 11 ? ' 00:00:00' : ''}`, `${s.length < 11 ? ParseUtils_1.parseTime(new Date(new Date(e).setTime(new Date(e + ' 00:00:00').getTime() - 1))) : ''}`];
                    }
                    return [s, e];
                };
        }
        return this.normalFilter;
    }
    normalFilter(value) {
        return utils_1.default.isNotEmptyValueFilter(value, null);
    }
    groupFilter(string) {
        return utils_1.default.isNotEmptyString(string) ? string.split(',').filter((i) => utils_1.default.isNotEmptyString(i)) : [];
    }
    groupFilterToValue(array) {
        return utils_1.default.isArrayFilter(array, []).filter(i => utils_1.default.isNotEmptyString(i)).join(',');
    }
}
exports.CommonValueFilter = CommonValueFilter;
function getFilter(type) {
    return new CommonValueFilter(type);
}
exports.default = getFilter;
//# sourceMappingURL=commonFilter.js.map