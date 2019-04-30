"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
require("antd/lib/input-number/style/css");
var commonInjectItem_1 = require("./commonInjectItem");
var utils_1 = __importStar(require("../../../utils"));
var classnames_1 = __importDefault(require("classnames"));
var vuera_1 = require("vuera");
var element_ui_1 = require("element-ui");
var styled_components_1 = __importDefault(require("styled-components"));
var ElInputNumber = vuera_1.VueInReact({
    functional: true,
    render: function (h, _a) {
        var data = _a.data, props = _a.props;
        return h(element_ui_1.InputNumber, __assign({}, data, { on: utils_1.zipEmptyData(__assign({}, data.on, { 'change': props.onChange, 'blur': props.onBlur })), class: props.className, attrs: __assign({}, data.attrs, { style: classnames_1.default(props.style) }) }));
    }
});
var defaultPrecision = 0;
var App = function (_a) {
    var antdForm = _a.antdForm, storeForm = _a.storeForm, code = _a.code, itemConfig = _a.itemConfig, className = _a.className, other = __rest(_a, ["antdForm", "storeForm", "code", "itemConfig", "className"]);
    var suffix = itemConfig.suffix;
    return (React.createElement("span", null,
        React.createElement(ElInputNumber, __assign({ defaultValue: 0, size: 'small', className: classnames_1.default({ 'increase-only': itemConfig.increaseOnly }, className), style: suffix ? 'width: calc(80% - 20px);' : 'width: 100%;', precision: utils_1.default.isNumberFilter(parseInt(itemConfig.numberControl), defaultPrecision), step: utils_1.default.isNumberFilter(itemConfig.step, 1 / Math.pow(10, itemConfig.numberControl || defaultPrecision)), controls: itemConfig.useControl, "controls-position": 'right', min: 0 }, other)),
        utils_1.default.jsxIf(suffix, React.createElement("span", { slot: 'suffix', style: {
                display: 'inline-block;', position: 'relative', marginLeft: '5px'
            } }, suffix))));
};
exports.InputNumberItem = commonInjectItem_1.commonInjectItem(styled_components_1.default(App)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  &.increase-only.el-input-number.is-controls-right {\n    & .el-input-number__decrease {\n      display: none;\n    }\n    & .el-input-number__increase {\n      height: calc(100% - 2px) !important;\n      border-bottom: 0;\n      border-bottom-right-radius: 10px;\n      i {    \n        top: 6px;\n        position: relative;\n        /* &:before {\n          content: '\\E62B';\n        } */\n      }\n    }\n  }\n"], ["\n  &.increase-only.el-input-number.is-controls-right {\n    & .el-input-number__decrease {\n      display: none;\n    }\n    & .el-input-number__increase {\n      height: calc(100% - 2px) !important;\n      border-bottom: 0;\n      border-bottom-right-radius: 10px;\n      i {    \n        top: 6px;\n        position: relative;\n        /* &:before {\n          content: '\\\\E62B';\n        } */\n      }\n    }\n  }\n"]))));
exports.default = App;
var templateObject_1;
