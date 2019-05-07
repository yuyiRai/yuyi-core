"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var React = __importStar(require("react"));
// import DatePicker from 'antd/lib/date-picker';
var antd_1 = require("antd");
// import 'antd/lib/date-picker/style/css';
var mobx_react_1 = require("mobx-react");
var vuera_1 = require("vuera");
var DateItem_1 = require("./VueItem/DateItem");
var moment_1 = __importDefault(require("moment"));
var zh_CN_1 = __importDefault(require("antd/lib/date-picker/locale/zh_CN"));
require("moment/locale/zh-cn");
var utils_1 = __importDefault(require("../../../utils"));
moment_1.default.locale('zh-cn');
var RangePicker = antd_1.DatePicker.RangePicker;
exports.DatePickerItem = mobx_react_1.inject('formStore', 'antdForm', 'itemConfig')(mobx_react_1.observer(function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig"]);
    // console.log(other)
    return React.createElement(vuera_1.VueWrapper, __assign({ component: DateItem_1.ElDatePickerItem }, other, { itemConfig: itemConfig.export() }));
    // return <DatePicker {...other}/>
}));
exports.DateRangePickerItem = mobx_react_1.inject('formStore', 'antdForm', 'itemConfig')(mobx_react_1.observer(function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig"]);
    // console.log(other, itemConfig)
    return React.createElement(vuera_1.VueWrapper, __assign({ component: DateItem_1.ElDatePickerItem }, other, { itemConfig: itemConfig.export() }));
    // return <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" locale={zh_CN} {...other} defaultPickerValue={itemConfig.defaultValue} ranges={defaultDateRangeList}/>
}));
var DatePickerSwitch = /** @class */ (function (_super) {
    __extends(DatePickerSwitch, _super);
    function DatePickerSwitch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DatePickerSwitch.prototype, "itemConfig", {
        get: function () {
            return this.props.itemConfig || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerSwitch.prototype, "placeholder", {
        get: function () {
            var _a = this.itemConfig, placeholder = _a.placeholder, label = _a.label;
            return placeholder ? placeholder : ('请选择' + label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerSwitch.prototype, "useTime", {
        get: function () {
            var _a = this.itemConfig, time = _a.time, type = _a.type;
            return utils_1.default.isEqual(type, 'dateTime') || utils_1.default.isBooleanFilter(time, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerSwitch.prototype, "dateFormatStr", {
        get: function () {
            return utils_1.default.isNotEmptyValueFilter(this.itemConfig.format, "yyyy-MM-dd" + (this.useTime ? ' HH:mm:ss' : ''));
        },
        enumerable: true,
        configurable: true
    });
    DatePickerSwitch.prototype.render = function () {
        return (React.createElement(RangePicker, { locale: zh_CN_1.default }));
    };
    return DatePickerSwitch;
}(React.Component));
exports.default = DatePickerSwitch;
exports.MomentUtils = {
    getDateRangeMoment: function (days) {
        var end = new Date();
        var start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
        return [start, end].map(function (v) { return moment_1.default(v); });
    }
};
exports.defaultDateRangeList = {
    '最近一周': exports.MomentUtils.getDateRangeMoment(7),
    '最近一个月': exports.MomentUtils.getDateRangeMoment(30),
};
