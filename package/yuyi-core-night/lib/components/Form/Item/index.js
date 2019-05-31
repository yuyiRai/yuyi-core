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
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
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
export var itemType = {
    'text': InputItem,
    'textArea': TextAreaItem,
    'textarea': TextAreaItem,
    'date': DatePickerItem,
    'dateTime': DatePickerItem,
    'dateToDate': DateRangePickerItem,
    'check': CheckItem,
    'checkOne': SwitchItem,
    'switch': SwitchItem,
    'radio': RadioItem,
    'radioOne': RadioOneItem,
    'number': InputNumberItem,
    'search': SearchItem,
    'select': SearchItem,
    'cascader': CascaderItem,
    'selectTree': SelectTreeItem,
    'group': GroupItem
};
export function ItemSwitchType(type) {
    return itemType[type || 'text'];
}
export var ItemSwitch = React.forwardRef(function (_a, ref) {
    var type = _a.type, props = __rest(_a, ["type"]);
    var Component = ItemSwitchType(type);
    return React.createElement(Component, __assign({ ref: ref }, props));
});
export * from './DateItem';
export * from './InputItem';
//# sourceMappingURL=index.js.map