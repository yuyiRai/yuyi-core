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
import AutoComplete from "antd/lib/auto-complete";
import "antd/lib/auto-complete/style/css.js";
import { HeadTagInput } from './HeadTagInput';
import React from 'react';
import styled from 'styled-components';
var App = function (_a) {
    var tag = _a.tag, children = _a.children, props = __rest(_a, ["tag", "children"]);
    return (React.createElement(AutoComplete, __assign({}, props),
        React.createElement(HeadTagInput, { tag: tag })));
};
export var HeadTagAutoComplete = styled(App).withConfig({ displayName: "HeadTagAutoComplete", componentId: "sc-q3c4ci" })(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  & .ant-select-selection__placeholder {\n    margin-left: ", "px !important;\n  }\n"], ["\n  & .ant-select-selection__placeholder {\n    margin-left: ", "px !important;\n  }\n"])), function (props) { return props.tag.length * 5.5 + 30; });
var templateObject_1;
//# sourceMappingURL=HeadTagAutoComplete.js.map