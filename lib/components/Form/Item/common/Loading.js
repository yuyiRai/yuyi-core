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
import Spin from "antd/lib/spin";
import "antd/lib/spin/style/css.js";
import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css.js";
import { commonInjectItem } from '../commonInjectItem';
var antIcon = React.createElement(Icon, { type: "loading", style: { fontSize: 24 }, spin: true });
export var Loading = function (_a) {
    var spinning = _a.spinning, loading = _a.loading, children = _a.children, props = __rest(_a, ["spinning", "loading", "children"]);
    return React.createElement(Spin, __assign({}, props, { delay: 100, indicator: antIcon, spinning: Utils.isBooleanFilter(loading, spinning) }), children);
};
export var FormItemLoading = commonInjectItem(function (_a) {
    var itemConfig = _a.itemConfig, formStore = _a.formStore, antdForm = _a.antdForm, code = _a.code, other = __rest(_a, ["itemConfig", "formStore", "antdForm", "code"]);
    return React.createElement(Loading, __assign({ loading: itemConfig.loading }, other), other.children);
});
export default Loading;
//# sourceMappingURL=Loading.js.map