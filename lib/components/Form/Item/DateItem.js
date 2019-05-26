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
import * as React from 'react';
import DatePicker from "antd/lib/date-picker";
import "antd/lib/date-picker/style/css.js";
// import 'antd/lib/date-picker/style/css';
import { inject, observer } from 'mobx-react';
import { VueWrapper } from 'vuera';
import { ElDatePickerItem } from './VueItem/DateItem';
import moment from 'moment';
import zh_CN from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import Utils from '../../../utils';
moment.locale('zh-cn');
var RangePicker = DatePicker.RangePicker;
export var DatePickerItem = inject('formStore', 'antdForm', 'itemConfig')(observer(function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig"]);
    // console.log(other)
    return React.createElement(VueWrapper, __assign({ component: ElDatePickerItem }, other, { itemConfig: itemConfig.export() }));
    // return <DatePicker {...other}/>
}));
export var DateRangePickerItem = inject('formStore', 'antdForm', 'itemConfig')(observer(function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig"]);
    // console.log(other, itemConfig)
    return React.createElement(VueWrapper, __assign({ component: ElDatePickerItem }, other, { itemConfig: itemConfig.export() }));
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
            return Utils.isEqual(type, 'dateTime') || Utils.isBooleanFilter(time, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerSwitch.prototype, "dateFormatStr", {
        get: function () {
            return Utils.isNotEmptyValueFilter(this.itemConfig.format, "yyyy-MM-dd" + (this.useTime ? ' HH:mm:ss' : ''));
        },
        enumerable: true,
        configurable: true
    });
    DatePickerSwitch.prototype.render = function () {
        return (React.createElement(RangePicker, { locale: zh_CN }));
    };
    return DatePickerSwitch;
}(React.Component));
export default DatePickerSwitch;
export var MomentUtils = {
    getDateRangeMoment: function (days) {
        var end = new Date();
        var start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
        return [start, end].map(function (v) { return moment(v); });
    }
};
export var defaultDateRangeList = {
    '最近一周': MomentUtils.getDateRangeMoment(7),
    '最近一个月': MomentUtils.getDateRangeMoment(30),
};
//# sourceMappingURL=DateItem.js.map