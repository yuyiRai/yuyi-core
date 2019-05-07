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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var DateItem_1 = require("./DateItem");
var InputItem_1 = require("./InputItem");
var CheckItem_1 = require("./CheckItem");
var NumberInputItem_1 = require("./NumberInputItem");
var RadioItem_1 = require("./RadioItem");
var Search_1 = require("./Search");
function ItemSwitchType(type) {
    switch (type) {
        case 'text': return InputItem_1.InputItem;
        case 'textArea': return InputItem_1.TextAreaItem;
        case 'textarea': return InputItem_1.TextAreaItem;
        case 'date': return DateItem_1.DatePickerItem;
        case 'dateTime': return DateItem_1.DatePickerItem;
        case 'dateToDate': return DateItem_1.DateRangePickerItem;
        case 'check': return CheckItem_1.CheckItem;
        case 'checkOne': return CheckItem_1.SwitchItem;
        case 'switch': return CheckItem_1.SwitchItem;
        case 'radio': return RadioItem_1.RadioItem;
        case 'number': return NumberInputItem_1.InputNumberItem;
        case 'search': return Search_1.SearchItem;
        default: return InputItem_1.InputItem;
    }
}
exports.ItemSwitchType = ItemSwitchType;
function ItemSwitch(_a) {
    var Component = _a.Component, props = __rest(_a, ["Component"]);
    var _b = __read(react_1.default.useState(props.value), 2), state = _b[0], setstate = _b[1];
    console.log(props);
    return react_1.default.createElement(Component, __assign({}, props, { state: state, setstate: setstate }));
}
exports.ItemSwitch = ItemSwitch;
function getItemSwitch(type, props) {
    var Component = ItemSwitchType(type);
    return react_1.default.createElement(ItemSwitch, __assign({ Component: Component }, props));
}
exports.getItemSwitch = getItemSwitch;
__export(require("./InputItem"));
__export(require("./DateItem"));
