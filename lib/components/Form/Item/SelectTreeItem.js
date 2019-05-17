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
import TreeSelect from 'antd/lib/tree-select';
import 'antd/lib/tree-select/style/css';
import { commonInjectItem } from "./commonInjectItem";
// import Utils from '../../../utils';
// import classnames from 'classnames'
// import { VueInReact } from 'vuera'
import styled from 'styled-components';
import { useSearchStore, useItemConfig } from './OptionsUtil';
import { Observer } from 'mobx-react-lite';
var App = function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, onBlur = _a.onBlur, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig", "onBlur"]);
    itemConfig = useItemConfig(itemConfig);
    var searchStore = useSearchStore(itemConfig, function (optionsStore) {
        return optionsStore.displayOptions.map(function (i) {
            return Utils.isNil(i.isLeaf) ? Object.assign(i, {
                isLeaf: false //(Utils.isArrayFilter(other.value) || []).length > Utils.isNumberFilter(itemConfig.loadDataDeep, 3)
            }) : i;
        });
    });
    var optionsStore = itemConfig.optionsStore;
    var loadData = searchStore.loadData ? function (treeNode) { return searchStore.loadData(convertTreeNodeToLoadData(treeNode.props)); } : undefined;
    console.log(itemConfig, other, optionsStore.transformOption);
    return (React.createElement(Observer, null, function () {
        return (React.createElement(TreeSelect, __assign({ allowClear: true, autoClearSearchValue: false, treeData: optionsStore.nativeTransformOption, loadData: loadData, treeDefaultExpandedKeys: Utils.castArray(other.value), treeNodeFilterProp: 'title', showCheckedStrategy: TreeSelect.SHOW_ALL, treeNodeLabelProp: 'label', 
            // onDropdownVisibleChange={visible => {
            //   !visible && other.onBlur()
            // }}
            showSearch: true }, other)));
    }));
};
var StyledItem = styled(App).withConfig({ displayName: "StyledItem", componentId: "sc-25pu0b" })(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\n"], ["\n\n"])));
export var SelectTreeItem = commonInjectItem(StyledItem);
export function convertTreeNodeToLoadData(treeNode) {
    var path = [treeNode];
    var current = treeNode.parentOption;
    while (!Utils.isNil(current)) {
        debugger;
        path.unshift(current);
        current = current.parentOption;
    }
    return path;
    // treeNode.props
}
export default App;
var templateObject_1;
//# sourceMappingURL=SelectTreeItem.js.map