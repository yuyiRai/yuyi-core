var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import * as React from 'react';
import 'antd/lib/input-number/style/css';
import { commonInjectItem } from "./commonInjectItem";
import Utils, { zipEmptyData } from '../../../utils';
import classnames from 'classnames';
import { VueInReact } from 'vuera';
import InputNumber from "element-ui/lib/input-number";
import styled from 'styled-components';
var ElInputNumber = VueInReact({
    functional: true,
    render: function (h, _a) {
        var data = _a.data, props = _a.props;
        return h(InputNumber, __assign({}, data, { on: zipEmptyData(__assign({}, data.on, { 'change': props.onChange, 'blur': props.onBlur })), class: props.className, attrs: __assign({}, data.attrs, { style: classnames(props.style) }) }));
    }
});
var defaultPrecision = 0;
var App = function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, className = _a.className, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig", "className"]);
    var suffix = itemConfig.suffix;
    return (React.createElement("span", null,
        React.createElement(ElInputNumber, __assign({ defaultValue: 0, size: 'small', className: classnames({ 'increase-only': itemConfig.increaseOnly }, className), style: suffix ? 'width: calc(80% - 20px);' : 'width: 100%;', precision: Utils.isNumberFilter(parseInt(itemConfig.numberControl), defaultPrecision), step: Utils.isNumberFilter(itemConfig.step, 1 / Math.pow(10, itemConfig.numberControl || defaultPrecision)), controls: itemConfig.useControl, "controls-position": 'right', min: 0 }, other)),
        Utils.jsxIf(suffix, React.createElement("span", { slot: 'suffix', style: __$hoisted_o0 }, suffix))));
};
export var InputNumberItem = commonInjectItem(styled(App)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  &.increase-only.el-input-number.is-controls-right {\n    & .el-input-number__decrease {\n      display: none;\n    }\n    & .el-input-number__increase {\n      height: calc(100% - 2px) !important;\n      border-bottom: 0;\n      border-bottom-right-radius: 10px;\n      i {    \n        top: 6px;\n        position: relative;\n        /* &:before {\n          content: '\\E62B';\n        } */\n      }\n    }\n  }\n"], ["\n  &.increase-only.el-input-number.is-controls-right {\n    & .el-input-number__decrease {\n      display: none;\n    }\n    & .el-input-number__increase {\n      height: calc(100% - 2px) !important;\n      border-bottom: 0;\n      border-bottom-right-radius: 10px;\n      i {    \n        top: 6px;\n        position: relative;\n        /* &:before {\n          content: '\\\\E62B';\n        } */\n      }\n    }\n  }\n"]))));
export default App;
var __$hoisted_o0 = {
    display: 'inline-block;', position: 'relative', marginLeft: '5px'
};
var templateObject_1;
//# sourceMappingURL=NumberInputItem.js.map