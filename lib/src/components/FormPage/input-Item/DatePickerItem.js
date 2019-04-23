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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var vue_1 = __importDefault(require("vue"));
var mobx_1 = require("mobx");
var mobx_vue_1 = require("mobx-vue");
exports.checkDateToDate = function (date, itemConfig) { return (function (rule, value, callback) {
    var _a = __read(_.map(itemConfig.code.split('|'), function (code) { return itemConfig.form[code]; }), 2), start = _a[0], end = _a[1];
    if (!Utils.isNil(start) && !Utils.isNil(end) && itemConfig.type === 'dateToDate') {
        console.log('testt, check', [start, end], itemConfig);
        // console.log(start,end,value)
        if (Utils.isNotEmptyValue(end) && Utils.isNotEmptyValue(start)) {
            var endTime = new Date(end).getTime();
            var startTime = new Date(start).getTime();
            if ((endTime - startTime) > 30 * 1000 * 60 * 60 * 24) {
                console.error(itemConfig.label + "\u65F6\u957F\u8D85\u51FA" + date + "\u5929");
                throw callback(new Error(itemConfig.label + "\u65F6\u957F\u8D85\u51FA" + date + "\u5929\uFF01"));
            }
            else if (endTime < startTime) {
                throw callback(new Error(itemConfig.label + "\u622A\u6B62\u65F6\u95F4\u4E0D\u80FD\u65E9\u4E8E\u8D77\u59CB\u65F6\u95F4\uFF01"));
            }
        }
    }
    // console.log('回调3', value)
    return callback();
}); };
exports.checkFutureDate = function (itemConfig) { return (function (rule, value, callback) {
    if (Utils.isNotEmptyValue(value) && new Date().getTime() > new Date(value).getTime()) {
        return callback(new Error(itemConfig.label + "\u4E0D\u80FD\u65E9\u4E8E\u5F53\u524D\u65F6\u95F4"));
    }
    return callback();
}); };
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
    getDateRange: function (days) {
        var end = new Date();
        var start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
        return [start, end];
    }
};
exports.default = mobx_vue_1.observer(vue_1.default.component('DatePickerItem', {
    computed: {
        placeholder: function () {
            var _a = this.itemConfig, placeholder = _a.placeholder, label = _a.label;
            return placeholder ? placeholder : ('请选择' + label);
        },
        useTime: function () {
            var _a = this.itemConfig, time = _a.time, type = _a.type;
            return Utils.isEqual(type, 'dateTime') || Utils.isBooleanFilter(time, false);
        },
        dateFormatStr: function () {
            return Utils.isNotEmptyValueFilter(this.itemConfig.format, "yyyy-MM-dd" + (this.useTime ? ' HH:mm:ss' : ''));
        }
    },
    render: function (h) {
        var _a = this, value = _a.value, disabled = _a.disabled, itemConfig = _a.itemConfig, dateFormatStr = _a.dateFormatStr, pickerOptions = _a.pickerOptions, placeholder = _a.placeholder, onChange = _a.onChange;
        // console.log(this.value)
        var type = itemConfig.type, format = itemConfig.format;
        var commonProps = {
            ref: 'input',
            props: {
                'value-format': dateFormatStr,
                format: dateFormatStr,
                value: mobx_1.toJS(value),
                disabled: disabled,
                editable: false
            },
            on: {
                input: onChange
            }
        };
        if (type === 'date' || type === 'dateTime') {
            var label = itemConfig.label;
            // <!-- 日期 -->
            return (<elDatePicker type={type.toLowerCase()} {...commonProps} defaultValue={new Date()} placeholder={placeholder}/>);
        }
        else if (type === "dateToDate") {
            // <!-- 日期范围 -->
            var startPlaceholder = itemConfig.startPlaceholder, endPlaceholder = itemConfig.endPlaceholder, time = itemConfig.time;
            return (<elDatePicker type='daterange' {...commonProps} unlinkPanels startPlaceholder={startPlaceholder || "起始时间"} endPlaceholder={endPlaceholder || "截止时间"} pickerOptions={pickerOptions}/>);
        }
        else {
            return null;
        }
    },
    methods: {
        onChange: function (value) {
            if (Utils.isNotEmptyString(value) && this.itemConfig.format === 'yyyy-MM-dd HH:mm')
                value += ':00';
            console.log('change', value);
            this.$emit('change', value);
        }
    },
    data: function () {
        return {
            pickerOptions: {
                shortcuts: __spread([{
                        text: '最近一周',
                        onClick: function (picker) {
                            picker.$emit('pick', exports.DateUtils.getDateRange(7));
                        }
                    }, {
                        text: '最近一个月',
                        onClick: function (picker) {
                            picker.$emit('pick', exports.DateUtils.getDateRange(30));
                        }
                    }], this.options)
            },
        };
    },
    props: {
        value: { required: true },
        itemConfig: {
            type: Object,
            required: true
        },
        value: {},
        options: {
            type: Array,
            default: function () { return ([]); }
        },
        disabled: Boolean
    }
}));
//# sourceMappingURL=DatePickerItem.js.map