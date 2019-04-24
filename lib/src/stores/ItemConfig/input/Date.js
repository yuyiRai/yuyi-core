"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const utils_1 = __importDefault(require("../../../utils"));
exports.checkDateToDate = (date, itemConfig) => ((rule, value, callback) => {
    const [start, end] = lodash_1.map(itemConfig.code.split('|'), code => itemConfig.form[code]);
    if (!utils_1.default.isNil(start) && !utils_1.default.isNil(end) && itemConfig.type === 'dateToDate') {
        console.log('testt, check', [start, end], itemConfig);
        // console.log(start,end,value)
        if (utils_1.default.isNotEmptyValue(end) && utils_1.default.isNotEmptyValue(start)) {
            const endTime = new Date(end).getTime();
            const startTime = new Date(start).getTime();
            if ((endTime - startTime) > 30 * 1000 * 60 * 60 * 24) {
                console.error(`${itemConfig.label}时长超出${date}天`);
                throw callback(new Error(`${itemConfig.label}时长超出${date}天！`));
            }
            else if (endTime < startTime) {
                throw callback(new Error(`${itemConfig.label}截止时间不能早于起始时间！`));
            }
        }
    }
    // console.log('回调3', value)
    return callback();
});
exports.checkFutureDate = (itemConfig) => ((rule, value, callback) => {
    if (utils_1.default.isNotEmptyValue(value) && new Date().getTime() > new Date(value).getTime()) {
        return callback(new Error(`${itemConfig.label}不能早于当前时间`));
    }
    return callback();
});
exports.getDefaultRules = function (itemConfig) {
    return {
        dateToDate30: [{
                validator: exports.checkDateToDate(30, itemConfig),
                trigger: ['change', 'blur'],
            }],
        futureDate: [{
                validator: exports.checkFutureDate(itemConfig),
                trigger: 'blur'
            }]
    };
};
exports.DateUtils = {
    getDateRange(days) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
        return [start, end];
    }
};
//# sourceMappingURL=Date.js.map