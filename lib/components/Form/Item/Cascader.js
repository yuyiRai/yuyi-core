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
import Cascader from 'antd/lib/cascader';
import 'antd/lib/cascader/style/css';
import { commonInjectItem } from "./commonInjectItem";
// import Utils from '../../../utils';
// import classnames from 'classnames'
// import { VueInReact } from 'vuera'
import styled from 'styled-components';
import { useSearchStore, useItemConfig } from './OptionsUtil';
import { Observer } from 'mobx-react-lite';
var App = function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig"]);
    itemConfig = useItemConfig(itemConfig);
    var searchStore = useSearchStore(itemConfig, function (optionsStore) {
        return optionsStore.displayOptions.map(function (i) {
            return Utils.isNil(i.isLeaf) ? Object.assign(i, {
                isLeaf: false //(Utils.isArrayFilter(other.value) || []).length > Utils.isNumberFilter(itemConfig.loadDataDeep, 3)
            }) : i;
        });
    });
    var optionsStore = itemConfig.optionsStore;
    return (React.createElement(Observer, null, function () {
        // console.log(itemConfig, other, optionsStore.transformOption)
        return (React.createElement(Cascader, __assign({ displayRender: function (labels, selectedOptions) {
                return labels.map(function (label, i) {
                    return React.createElement("span", { key: i },
                        label,
                        i < labels.length - 1 && " / ");
                });
            }, style: __$hoisted_o0 }, other, { placeholder: itemConfig.loading ? 'loading..' : other.placeholder, options: optionsStore.transformOption, loadData: searchStore.loadData })));
    }));
};
var StyledItem = styled(App).withConfig({ displayName: "StyledItem", componentId: "sc-axhfyp" })(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\n"], ["\n\n"])));
export var CascaderItem = commonInjectItem(StyledItem);
export default App;
var __$hoisted_o0 = { width: '100%' };
var templateObject_1;
//# sourceMappingURL=Cascader.js.map