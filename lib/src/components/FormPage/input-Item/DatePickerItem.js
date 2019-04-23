/* eslint-disable */
import Vue from 'vue';
import { toJS } from 'mobx';
import { observer } from 'mobx-vue';
export const checkDateToDate = (date, itemConfig) => ((rule, value, callback) => {
    const [start, end] = _.map(itemConfig.code.split('|'), code => itemConfig.form[code]);
    if (!Utils.isNil(start) && !Utils.isNil(end) && itemConfig.type === 'dateToDate') {
        console.log('testt, check', [start, end], itemConfig);
        // console.log(start,end,value)
        if (Utils.isNotEmptyValue(end) && Utils.isNotEmptyValue(start)) {
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
export const checkFutureDate = (itemConfig) => ((rule, value, callback) => {
    if (Utils.isNotEmptyValue(value) && new Date().getTime() > new Date(value).getTime()) {
        return callback(new Error(`${itemConfig.label}不能早于当前时间`));
    }
    return callback();
});
export const getDefaultRules = function (itemConfig) {
    return {
        dateToDate30: [{
                validator: checkDateToDate(30, itemConfig),
                trigger: ['change', 'blur'],
            }],
        futureDate: [{
                validator: checkFutureDate(itemConfig),
                trigger: 'blur'
            }]
    };
};
export const DateUtils = {
    getDateRange(days) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
        return [start, end];
    }
};
export default observer(Vue.component('DatePickerItem', {
    computed: {
        placeholder() {
            const { placeholder, label } = this.itemConfig;
            return placeholder ? placeholder : ('请选择' + label);
        },
        useTime() {
            const { time, type } = this.itemConfig;
            return Utils.isEqual(type, 'dateTime') || Utils.isBooleanFilter(time, false);
        },
        dateFormatStr() {
            return Utils.isNotEmptyValueFilter(this.itemConfig.format, `yyyy-MM-dd${this.useTime ? ' HH:mm:ss' : ''}`);
        }
    },
    render(h) {
        const { value, disabled, itemConfig, dateFormatStr, pickerOptions, placeholder, onChange } = this;
        // console.log(this.value)
        const { type, format } = itemConfig;
        const commonProps = {
            ref: 'input',
            props: {
                'value-format': dateFormatStr,
                format: dateFormatStr,
                value: toJS(value),
                disabled,
                editable: false
            },
            on: {
                input: onChange
            }
        };
        if (type === 'date' || type === 'dateTime') {
            const { label } = itemConfig;
            // <!-- 日期 -->
            return (<elDatePicker type={type.toLowerCase()} {...commonProps} defaultValue={new Date()} placeholder={placeholder}/>);
        }
        else if (type === "dateToDate") {
            // <!-- 日期范围 -->
            const { startPlaceholder, endPlaceholder, time } = itemConfig;
            return (<elDatePicker type='daterange' {...commonProps} unlinkPanels startPlaceholder={startPlaceholder || "起始时间"} endPlaceholder={endPlaceholder || "截止时间"} pickerOptions={pickerOptions}/>);
        }
        else {
            return null;
        }
    },
    methods: {
        onChange(value) {
            if (Utils.isNotEmptyString(value) && this.itemConfig.format === 'yyyy-MM-dd HH:mm')
                value += ':00';
            console.log('change', value);
            this.$emit('change', value);
        }
    },
    data() {
        return {
            pickerOptions: {
                shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            picker.$emit('pick', DateUtils.getDateRange(7));
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            picker.$emit('pick', DateUtils.getDateRange(30));
                        }
                    }, ...this.options]
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
            default: () => ([])
        },
        disabled: Boolean
    }
}));
//# sourceMappingURL=DatePickerItem.js.map