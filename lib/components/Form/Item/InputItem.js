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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var input_1 = __importDefault(require("antd/lib/input"));
require("antd/lib/input/style/css");
var tooltip_1 = __importDefault(require("antd/lib/tooltip"));
var react_1 = __importDefault(require("react"));
var commonInjectItem_1 = require("./commonInjectItem");
var utils_1 = require("../../../utils");
var util_1 = require("util");
var inev = utils_1.Utils.isNotEmptyValueFilter;
function useShadowValue(initValue, props) {
    var itemConfig = props.itemConfig, onChange = props.onChange, onBlur = props.onBlur, currentValue = props.value;
    var state = react_1.default.useState(initValue);
    var _a = __read(react_1.default.useState(initValue), 2), lastV = _a[0], setLastV = _a[1]; // 记录最后变更的值
    var shadowValue = state[0];
    var setShadowValue = state[1];
    react_1.default.useEffect(function () {
        if (inev(lastV) !== inev(currentValue)) {
            console.log('input: change props value', inev(lastV), inev(currentValue));
            setShadowValue(currentValue);
            setLastV(currentValue);
        }
    }, [currentValue, lastV, setShadowValue, setLastV]);
    if (itemConfig.watchInput) {
        return {
            value: shadowValue,
            onChange: function (e) {
                var nextValue = e.target.value;
                setShadowValue(nextValue);
                onChange(e);
                if (lastV !== nextValue) { // 记录最后变更的值
                    setLastV(nextValue);
                }
            },
            onBlur: onBlur
        };
    }
    else {
        return {
            value: shadowValue,
            onChange: function (e) {
                setShadowValue(e.target.value);
            },
            onBlur: function (e) {
                if (inev(e.target.value) !== inev(currentValue)) {
                    onChange(e);
                    if (lastV !== e.target.value) // 记录最后变更的值
                        setLastV(e.target.value);
                }
                util_1.isFunction(onBlur) && onBlur(e);
            }
        };
    }
}
exports.useShadowValue = useShadowValue;
exports.InputItem = commonInjectItem_1.commonInjectItem(function (props) { return react_1.default.createElement(Text, __assign({}, props)); });
exports.TextAreaItem = commonInjectItem_1.commonInjectItem(function (props) { return react_1.default.createElement(Area, __assign({}, props)); });
var Text = function (props) {
    var antdForm = props.antdForm, storeForm = props.storeForm, code = props.code, itemConfig = props.itemConfig, other = __rest(props, ["antdForm", "storeForm", "code", "itemConfig"]);
    var _a = useShadowValue(itemConfig.currentValue, props), value = _a.value, onChange = _a.onChange, onBlur = _a.onBlur;
    // console.log('fieldDecoratorOption', itemConfig.label, value, other.value, other);
    return (react_1.default.createElement(tooltip_1.default, { trigger: ['focus', 'hover'], title: value, placement: "topLeft" },
        react_1.default.createElement(input_1.default, __assign({ allowClear: true }, other, { onChange: onChange, value: value, onBlur: onBlur, suffix: itemConfig.suffix, maxLength: itemConfig.maxLength }))));
    // return <Input {...other}/>
};
var Area = function (props) {
    var antdForm = props.antdForm, storeForm = props.storeForm, code = props.code, itemConfig = props.itemConfig, other = __rest(props, ["antdForm", "storeForm", "code", "itemConfig"]);
    var _a = useShadowValue(other.value, props), value = _a.value, onChange = _a.onChange, onBlur = _a.onBlur;
    return (react_1.default.createElement(input_1.default.TextArea, __assign({}, other, { rows: !itemConfig.autoSize && 4, value: value, onChange: onChange, onBlur: onBlur, autosize: itemConfig.autoSize })));
};
exports.default = Text;
