import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/input-number.css';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/date-picker.css';
export declare const ElDatePickerItem: any;
export declare const DatePickerItem: {
    computed: {
        placeholder(): any;
        useTime(): boolean;
        dateFormatStr(): any;
    };
    render(h: any): any;
    methods: {
        onChange(value: any): void;
    };
    data(): {
        pickerOptions: {
            shortcuts: any[];
        };
    };
    props: {
        itemConfig: {
            type: ObjectConstructor;
            required: boolean;
        };
        value: {};
        options: {
            type: ArrayConstructor;
            default: () => any[];
        };
        disabled: BooleanConstructor;
    };
};
//# sourceMappingURL=DateItem.d.ts.map