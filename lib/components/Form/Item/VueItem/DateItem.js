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
import Vue from 'vue';
import DatePicker from "element-ui/lib/date-picker";
import { DateUtils } from "../../../../stores";
import Utils from "../../../../utils";
import { VueInReact } from 'vuera';
import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/input-number.css';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/date-picker.css';
export var ElDatePickerItem = VueInReact(Vue.component('ElDatePickerItem', {
    name: 'ElDatePickerItem',
    functional: true,
    render: function (h, props) {
        // console.log('ElDatePickerItem', props)
        return h('span', {
            attrs: {
                class: props.props.className || undefined
            }
        }, [
            h(DatePickerItem, __assign({}, props.data, { on: {
                    change: function (e) {
                        console.log(e);
                        props.props.onChange(e);
                    }
                } }), props.children)
        ]);
    }
}));
export var DatePickerItem = {
    computed: {
        placeholder: function () {
            var _a = this.itemConfig, placeholder = _a.placeholder, label = _a.label;
            return placeholder ? placeholder : ('请选择' + label);
        },
        useTime: function () {
            var _a = this.itemConfig, time = _a.time, type = _a.type;
            return type === 'dateTime' || Utils.isBooleanFilter(time, false);
        },
        dateFormatStr: function () {
            return Utils.isNotEmptyValueFilter(this.itemConfig.format, "yyyy-MM-dd" + (this.useTime ? ' HH:mm:ss' : ''));
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
            return (h(DatePicker, __assign({}, commonProps, { props: __assign({}, commonProps.props, { type: type.toLowerCase(), unlinkPanels: true, placeholder: placeholder, size: 'small' }) })));
        }
        else if (type === "dateToDate") {
            // <!-- 日期范围 -->
            var startPlaceholder = itemConfig.startPlaceholder, endPlaceholder = itemConfig.endPlaceholder;
            return (h(DatePicker, __assign({}, commonProps, { props: __assign({}, commonProps.props, { type: 'daterange', unlinkPanels: true, startPlaceholder: startPlaceholder || "起始时间", endPlaceholder: endPlaceholder || "截止时间", pickerOptions: pickerOptions, size: 'small' }) })));
        }
        else {
            return null;
        }
    },
    methods: {
        onChange: function (value) {
            if (Utils.isNotEmptyString(value) && this.itemConfig.format === 'yyyy-MM-dd HH:mm')
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
                            picker.$emit('pick', DateUtils.getDateRange(7));
                        }
                    }, {
                        text: '最近一个月',
                        onClick: function (picker) {
                            picker.$emit('pick', DateUtils.getDateRange(30));
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
//# sourceMappingURL=DateItem.js.map