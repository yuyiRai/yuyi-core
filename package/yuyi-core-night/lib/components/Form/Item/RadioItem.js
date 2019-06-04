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
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import Radio from 'antd/lib/radio';
import 'antd/lib/radio/style/css';
import { commonInjectItem } from "./commonInjectItem";
// import Utils from '../../../utils';
// import classnames from 'classnames'
// import { VueInReact } from 'vuera'
import styled from 'styled-components';
import { useOptionsStoreProps } from './OptionsUtil';
var App = function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig"]);
    var RadioGroup = useOptionsStoreProps(itemConfig, Radio.Group);
    return (React.createElement(RadioGroup, __assign({}, other)));
};
var StyledItem = styled(App).withConfig({ displayName: "StyledItem", componentId: "sc-l0h7uz" })(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\n"], ["\n\n"])));
export var RadioItem = commonInjectItem(StyledItem);
export var RadioOneItem = commonInjectItem(function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig"]);
    return (React.createElement(Radio.Group, __assign({}, other, { options: [
            { label: itemConfig.YLabel || '是', value: '1' },
            { label: itemConfig.NLabel || '否', value: '0' },
        ] })));
});
export default App;
var templateObject_1;
//# sourceMappingURL=RadioItem.js.map