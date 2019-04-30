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
var radio_1 = __importDefault(require("antd/lib/radio"));
require("antd/lib/radio/style/css");
var commonInjectItem_1 = require("./commonInjectItem");
// import Utils from '../../../utils';
// import classnames from 'classnames'
// import { VueInReact } from 'vuera'
var styled_components_1 = __importDefault(require("styled-components"));
var OptionsUtil_1 = require("./OptionsUtil");
var App = function (_a) {
    var antdForm = _a.antdForm, storeForm = _a.storeForm, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "storeForm", "code", "itemConfig"]);
    var RadioGroup = OptionsUtil_1.useOptionsStoreProps(itemConfig, radio_1.default.Group);
    return (React.createElement(RadioGroup, __assign({}, other)));
};
var StyledItem = styled_components_1.default(App)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\n"], ["\n\n"])));
exports.RadioItem = commonInjectItem_1.commonInjectItem(StyledItem);
exports.default = App;
var templateObject_1;
