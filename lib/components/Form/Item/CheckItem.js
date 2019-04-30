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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var antd_1 = require("antd");
var checkbox_1 = __importDefault(require("antd/lib/checkbox"));
require("antd/lib/checkbox/style/css");
// import Switch, { SwitchProps } from 'antd/lib/switch';
// import 'antd/lib/switch/style/css';
require("element-theme-default/lib/switch.css");
var element_react_1 = require("element-react");
var React = __importStar(require("react"));
var commonInjectItem_1 = require("./commonInjectItem");
var OptionsUtil_1 = require("./OptionsUtil");
var mobx_react_lite_1 = require("mobx-react-lite");
exports.CheckItem = commonInjectItem_1.commonInjectItem(function (props) { return React.createElement(Check, __assign({}, props)); });
var Check = function (_a) {
    var antdForm = _a.antdForm, storeForm = _a.storeForm, code = _a.code, itemConfig = _a.itemConfig, onChange = _a.onChange, other = __rest(_a, ["antdForm", "storeForm", "code", "itemConfig", "onChange"]);
    var store = OptionsUtil_1.useOptionsStore(itemConfig);
    // console.log(other, optionStore, optionStore.displayOptions)
    return (React.createElement(mobx_react_lite_1.Observer, null, function () {
        return React.createElement(checkbox_1.default.Group, __assign({}, other, { style: { width: '100%' }, onChange: onChange, options: store.displayOptions }),
            React.createElement(antd_1.Row, null,
                React.createElement(antd_1.Col, { span: 8 },
                    React.createElement(checkbox_1.default, { value: "A" }, "A")),
                React.createElement(antd_1.Col, { span: 8 },
                    React.createElement(checkbox_1.default, { value: "B" }, "B")),
                React.createElement(antd_1.Col, { span: 8 },
                    React.createElement(checkbox_1.default, { value: "C" }, "C")),
                React.createElement(antd_1.Col, { span: 8 },
                    React.createElement(checkbox_1.default, { value: "D" }, "D")),
                React.createElement(antd_1.Col, { span: 8 },
                    React.createElement(checkbox_1.default, { value: "E" }, "E"))));
    }));
};
var OSwitch = function (_a) {
    var antdForm = _a.antdForm, storeForm = _a.storeForm, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "storeForm", "code", "itemConfig"]);
    console.log(other);
    return React.createElement(element_react_1.Switch, __assign({}, other));
};
exports.SwitchItem = commonInjectItem_1.commonInjectItem(function (props) { return React.createElement(OSwitch, __assign({}, props, { onText: '', offText: '' })); });
