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
import React from 'react';
import { CascaderItem } from './Cascader';
// import { IInputItemProps, ITextAreaItemProps } from './InputItem';
import { CheckItem, SwitchItem } from './CheckItem';
import { DatePickerItem, DateRangePickerItem } from './DateItem';
import GroupItem from './GroupItem';
import { InputItem, TextAreaItem } from './InputItem';
import { InputNumberItem } from './NumberInputItem';
import { RadioItem, RadioOneItem } from './RadioItem';
import { SearchItem } from './Search';
import { SelectTreeItem } from './SelectTreeItem';
// export function ItemSwitchType(type?: 'text' | string): React.FunctionComponent<IInputItemProps>;
// export function ItemSwitchType(type: 'textArea' | 'textarea'): React.FunctionComponent<ITextAreaItemProps>;
// export function ItemSwitchType(type: 'date' | 'dateTime'): React.FunctionComponent<IDatePickerItemProps>;
// export function ItemSwitchType(type: 'dateToDate'): React.FunctionComponent<IDateRangePickerItemmProps>;
export function ItemSwitchType(type) {
    switch (type) {
        case 'text': return InputItem;
        case 'textArea': return TextAreaItem;
        case 'textarea': return TextAreaItem;
        case 'date': return DatePickerItem;
        case 'dateTime': return DatePickerItem;
        case 'dateToDate': return DateRangePickerItem;
        case 'check': return CheckItem;
        case 'checkOne': return SwitchItem;
        case 'switch': return SwitchItem;
        case 'radio': return RadioItem;
        case 'radioOne': return RadioOneItem;
        case 'number': return InputNumberItem;
        case 'search': return SearchItem;
        case 'select': return SearchItem;
        case 'cascader': return CascaderItem;
        case 'selectTree': return SelectTreeItem;
        case 'group': return GroupItem;
        default: return InputItem;
    }
}
export function ItemSwitch(_a) {
    var Component = _a.Component, props = __rest(_a, ["Component"]);
    var _b = __read(React.useState(props.value), 2), state = _b[0], setstate = _b[1];
    console.log(props);
    return React.createElement(Component, __assign({}, props, { state: state, setstate: setstate }));
}
export function getItemSwitch(type, props) {
    var Component = ItemSwitchType(type);
    return React.createElement(ItemSwitch, __assign({ Component: Component }, props));
}
export * from './DateItem';
export * from './InputItem';
//# sourceMappingURL=index.js.map