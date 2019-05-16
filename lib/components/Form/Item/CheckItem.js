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
import Row from "antd/lib/row";
import "antd/lib/row/style/css.js";
import Col from "antd/lib/col";
import "antd/lib/col/style/css.js";
import Checkbox from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style/css';
// import Switch, { SwitchProps } from 'antd/lib/switch';
// import 'antd/lib/switch/style/css';
import 'element-theme-default/lib/switch.css';
import { Switch } from 'element-react';
import * as React from 'react';
import { commonInjectItem } from "./commonInjectItem";
import { useOptionsStore } from './OptionsUtil';
import { Observer } from "mobx-react-lite";
export var CheckItem = commonInjectItem(function (props) { return React.createElement(Check, __assign({}, props)); });
var Check = function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, onChange = _a.onChange, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig", "onChange"]);
    var store = useOptionsStore(itemConfig);
    // console.log(other, optionStore, optionStore.displayOptions)
    return (React.createElement(Observer, null, function () {
        return React.createElement(Checkbox.Group, __assign({}, other, { style: __$hoisted_o0, onChange: onChange, options: store.displayOptions }),
            React.createElement(Row, null,
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "A" }, "A")),
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "B" }, "B")),
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "C" }, "C")),
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "D" }, "D")),
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "E" }, "E"))));
    }));
};
var OSwitch = function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig"]);
    console.log(other);
    return React.createElement(Switch, __assign({}, other));
};
export var SwitchItem = commonInjectItem(function (props) { return React.createElement(OSwitch, __assign({}, props, { onText: '', offText: '' })); });
var __$hoisted_o0 = { width: '100%' };
//# sourceMappingURL=CheckItem.js.map