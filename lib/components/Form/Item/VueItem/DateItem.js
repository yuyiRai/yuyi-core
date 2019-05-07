"use strict";
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
var vue_1 = __importDefault(require("vue"));
var element_ui_1 = require("element-ui");
var stores_1 = require("../../../../stores");
var utils_1 = __importDefault(require("../../../../utils"));
var vuera_1 = require("vuera");
require("element-ui/lib/theme-chalk/input.css");
require("element-ui/lib/theme-chalk/input-number.css");
require("element-ui/lib/theme-chalk/button.css");
require("element-ui/lib/theme-chalk/icon.css");
require("element-ui/lib/theme-chalk/date-picker.css");
exports.ElDatePickerItem = vuera_1.VueInReact(vue_1.default.component('ElDatePickerItem', {
    name: 'ElDatePickerItem',
    functional: true,
    render: function (h, props) {
        console.log('ElDatePickerItem', props);
        return h('span', {
            attrs: {
                class: props.props.className || undefined
            }
        }, [
            h(exports.DatePickerItem, __assign({}, props.data, { on: {
                    change: function (e) {
                        console.log(e);
                        props.props.onChange(e);
                    }
                } }), props.children)
        ]);
    }
}));
exports.DatePickerItem = {
    computed: {
        placeholder: function () {
            var _a = this.itemConfig, placeholder = _a.placeholder, label = _a.label;
            return placeholder ? placeholder : ('请选择' + label);
        },
        useTime: function () {
            var _a = this.itemConfig, time = _a.time, type = _a.type;
            return type === 'dateTime' || utils_1.default.isBooleanFilter(time, false);
        },
        dateFormatStr: function () {
            return utils_1.default.isNotEmptyValueFilter(this.itemConfig.format, "yyyy-MM-dd" + (this.useTime ? ' HH:mm:ss' : ''));
        }
    },
    render: function (h) {
        var _a = this, value = _a.value, disabled = _a.disabled, itemConfig = _a.itemConfig, dateFormatStr = _a.dateFormatStr, pickerOptions = _a.pickerOptions, placeholder = _a.placeholder, onChange = _a.onChange;
        // console.log(this.value)
        var type = itemConfig.type;
        var commonProps = {
            ref: 'input',
            props: {
                'value-format': dateFormatStr,
                format: dateFormatStr,
                value: value,
                disabled: disabled,
                editable: false,
            },
            attrs: {},
            style: {
                width: '100%' //'auto'
            },
            on: {
                input: onChange
            }
        };
        if (type === 'date' || type === 'dateTime') {
            // <!-- 日期 -->
            return (h(element_ui_1.DatePicker, __assign({}, commonProps, { props: __assign({}, commonProps.props, { type: type.toLowerCase(), unlinkPanels: true, placeholder: placeholder, size: 'small' }) })));
        }
        else if (type === "dateToDate") {
            // <!-- 日期范围 -->
            var startPlaceholder = itemConfig.startPlaceholder, endPlaceholder = itemConfig.endPlaceholder;
            return (h(element_ui_1.DatePicker, __assign({}, commonProps, { props: __assign({}, commonProps.props, { type: 'daterange', unlinkPanels: true, startPlaceholder: startPlaceholder || "起始时间", endPlaceholder: endPlaceholder || "截止时间", pickerOptions: pickerOptions, size: 'small' }) })));
        }
        else {
            return null;
        }
    },
    methods: {
        onChange: function (value) {
            if (utils_1.default.isNotEmptyString(value) && this.itemConfig.format === 'yyyy-MM-dd HH:mm')
                value += ':00';
            // console.log('change', value)
            this.$emit('change', value);
        }
    },
    data: function () {
        return {
            pickerOptions: {
                shortcuts: __spread([{
                        text: '最近一周',
                        onClick: function (picker) {
                            picker.$emit('pick', stores_1.DateUtils.getDateRange(7));
                        }
                    }, {
                        text: '最近一个月',
                        onClick: function (picker) {
                            picker.$emit('pick', stores_1.DateUtils.getDateRange(30));
                        }
                    }], this.options)
            },
        };
    },
    props: {
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
};
