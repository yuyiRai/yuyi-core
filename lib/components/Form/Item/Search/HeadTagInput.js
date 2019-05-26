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
import Input from "antd/lib/input";
import "antd/lib/input/style/css.js";
import Tag from "antd/lib/tag";
import "antd/lib/tag/style/css.js";
import { Utils } from "../../../../utils";
import React from 'react';
import styled from 'styled-components';
var App = React.forwardRef(function (_a, ref) {
    var tag = _a.tag, other = __rest(_a, ["tag"]);
    return React.createElement(Input, __assign({ ref: ref, prefix: tag && React.createElement(Tag, { color: 'blue' }, tag) }, other));
});
export var HeadTagInput = styled(App).withConfig({ displayName: "HeadTagInput", componentId: "sc-p0dwjw" })(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  & .ant-input-prefix > .ant-tag {\n    margin-left: -5px;\n  }\n  &.ant-input-affix-wrapper {\n    & .ant-input:not(:first-child) {\n      padding-left: ", "px;\n    }\n  }\n"], ["\n  & .ant-input-prefix > .ant-tag {\n    margin-left: -5px;\n  }\n  &.ant-input-affix-wrapper {\n    & .ant-input:not(:first-child) {\n      padding-left: ", "px;\n    }\n  }\n"])), function (props) { return props.tag && Utils.getRealLength(props.tag) * 5 + 30; });
var templateObject_1;
//# sourceMappingURL=HeadTagInput.js.map