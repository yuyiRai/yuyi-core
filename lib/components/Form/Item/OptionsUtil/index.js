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
var mobx_react_lite_1 = require("mobx-react-lite");
var react_1 = __importDefault(require("react"));
require("antd/lib/input/style/css");
function useOptionsStore(itemConfig, transformer) {
    // reaction(()=>itemConfig.options, console.log)
    return mobx_react_lite_1.useAsObservableSource(itemConfig.useOptionsStore(transformer));
}
exports.useOptionsStore = useOptionsStore;
function useSearchStore(itemConfig) {
    // reaction(()=>itemConfig.options, console.log)
    return mobx_react_lite_1.useAsObservableSource(itemConfig.useSearchStore());
}
exports.useSearchStore = useSearchStore;
function useOptionsStoreProps(itemConfig, Component) {
    var _a = __read(react_1.default.useState(itemConfig.useOptionsStore()), 1), store = _a[0];
    // reaction(()=>itemConfig.options, console.log)
    return ((function (props) {
        return react_1.default.createElement(mobx_react_lite_1.Observer, { render: function () { return react_1.default.createElement(Component, __assign({}, props, { options: store.displayOptions })); } });
    }));
}
exports.useOptionsStoreProps = useOptionsStoreProps;
