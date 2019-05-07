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
var antd_1 = require("antd");
var mobx_react_lite_1 = require("mobx-react-lite");
var OptionsUtil_1 = require("../OptionsUtil");
var commonInjectItem_1 = require("../commonInjectItem");
var styled_components_1 = __importDefault(require("styled-components"));
var ToolTipContainer_1 = require("../OptionsUtil/ToolTipContainer");
var rc_tween_one_1 = require("rc-tween-one");
require("rc-tween-one/dist/rc-tween-one.js");
exports.SearchItem = commonInjectItem_1.commonInjectItem(function (props) {
    return React.createElement(exports.OSearchItem, __assign({}, props, { center: true }));
});
exports.OSearchItem = styled_components_1.default(function (props) {
    var antdForm = props.antdForm, formStore = props.formStore, code = props.code, itemConfig = props.itemConfig, other = __rest(props, ["antdForm", "formStore", "code", "itemConfig"]);
    var searchStore = OptionsUtil_1.useSearchStore(itemConfig);
    var _a = __read(React.useState(undefined), 2), visible = _a[0], changeVisible = _a[1];
    var _b = __read(React.useState(false), 2), tagin = _b[0], changeTagin = _b[1];
    var _c = OptionsUtil_1.useOptionsStore(itemConfig, function (store) {
        return store.displayOptions.map(function (d) { return React.createElement(antd_1.Select.Option, { title: d.label, key: d.key, value: d.value }, d.label); });
    }), transformOption = _c.transformOption, displayOptions = _c.displayOptions, selectedLablesConfig = _c.selectedLablesConfig, hasSelectedTag = _c.hasSelectedTag;
    var trigger = tagin ? ['click'] : ['hover'];
    console.log(props, displayOptions, transformOption, Utils.valuesToLabels(displayOptions, props.value), trigger);
    var hint = (React.createElement(rc_tween_one_1.TweenOneGroup, { enter: {
            scale: 0.8, opacity: 0, type: 'from', duration: 100,
            onComplete: function (e) {
                e.target.setAttribute('style', '');
            },
        }, leave: { opacity: 0, width: 0, scale: 0, duration: 200 }, appear: false }, selectedLablesConfig.map(function (v) {
        return React.createElement(antd_1.Tag, { key: v.label, color: "blue", closable: true, onClose: function (e) {
                e.preventDefault();
                e.stopPropagation();
                other.onChange(v.remove(e), transformOption);
                console.log(e);
                if (!tagin)
                    changeTagin(true);
            } }, v.label);
    })));
    return (React.createElement(mobx_react_lite_1.Observer, null, function () {
        return React.createElement(ToolTipContainer_1.ValueHintContainer, { value: hint, visible: hasSelectedTag ? visible : false, trigger: trigger },
            React.createElement(antd_1.Select, __assign({ mode: 'tags', showSearch: true, defaultActiveFirstOption: false, showArrow: true, filterOption: searchStore.filterOption, onSearch: searchStore.onSearch, notFoundContent: itemConfig.loading ? React.createElement(antd_1.Spin, { size: "small" }) : undefined, loading: itemConfig.loading, dropdownClassName: 'dropmenu123' }, other, { onChange: function (e) {
                    props.onChange(e, transformOption);
                    if (!tagin)
                        changeTagin(true);
                }, onDropdownVisibleChange: function (open) {
                    changeVisible(open ? open : (tagin ? false : undefined));
                    if (tagin)
                        changeTagin(false);
                } }), transformOption));
    }));
})(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: block !important;\n  dropmenu123 {\n    text-align: ", ";\n  }\n"], ["\n  display: block !important;\n  dropmenu123 {\n    text-align: ", ";\n  }\n"])), function (props) { return props.center ? 'center' : undefined; });
var templateObject_1;
