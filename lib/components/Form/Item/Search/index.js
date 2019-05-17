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
import AutoComplete from "antd/lib/auto-complete";
import "antd/lib/auto-complete/style/css.js";
import Select from "antd/lib/select";
import "antd/lib/select/style/css.js";
import Spin from "antd/lib/spin";
import "antd/lib/spin/style/css.js";
import 'antd/lib/select/style/css';
import { Observer } from 'mobx-react-lite';
import { createTransformer } from 'mobx-utils';
import * as React from 'react';
import styled from 'styled-components';
import { commonInjectItem } from '../commonInjectItem';
import { useSearchStore } from '../OptionsUtil';
import { ValueHintContainer } from '../OptionsUtil/ToolTipContainer';
import { TagGroup } from './TagGroup';
import { HeadTagAutoComplete } from './HeadTagAutoComplete';
export var SearchItem = commonInjectItem(function (props) {
    return React.createElement(OSearchItem, __assign({}, props, { center: true }));
});
export function preSwitchContainer(container) {
    return function (children, switchValue) { return switchContainer(container, children, switchValue); };
}
export function switchContainer(container, children, switchValue) {
    if (switchValue) {
        return React.cloneElement(container, container.props, children);
    }
    return children;
}
export var getSelectModel = createTransformer(function (itemConfig) {
    if (itemConfig.multiple) {
        if (itemConfig.allowCreate) {
            return 'tags';
        }
        return 'multiple';
    }
    return undefined;
});
export var getNotFoundContent = createTransformer(function (itemConfig) {
    return itemConfig.loading ? React.createElement("div", { style: __$hoisted_o0 },
        React.createElement(Spin, { size: "small" })) : undefined;
});
export var OSearchItem = styled(function (props) {
    var antdForm = props.antdForm, formStore = props.formStore, code = props.code, itemConfig = props.itemConfig, other = __rest(props, ["antdForm", "formStore", "code", "itemConfig"]);
    var isAutoComplete = (itemConfig.allowInput === true && itemConfig.type === 'search' && !itemConfig.multiple);
    var OptionItem = isAutoComplete ? AutoComplete.Option : Select.Option;
    var OptGroupItem = isAutoComplete ? AutoComplete.OptGroup : Select.OptGroup;
    var searchStore = useSearchStore(itemConfig, function (store) {
        return store.displayOptions.map(function (d) {
            return React.createElement(OptionItem, { title: d.label, key: d.key, value: d.value }, store.getOptionsLabel(d));
        });
    });
    var optionsStore = itemConfig.optionsStore;
    var mode = getSelectModel(itemConfig);
    return (React.createElement(Observer, null, function () {
        var transformOption = optionsStore.transformOption;
        // console.log(isAutoComplete, props, optionsStore.displayOptions, transformOption, itemConfig.options)
        var _a = __read(React.useState(undefined), 2), isVisible = _a[0], changeVisible = _a[1];
        var optionsList = switchContainer(React.createElement(OptGroupItem, { key: searchStore.searchHintText, label: searchStore.searchHintText }), transformOption, itemConfig.type === 'search' && Utils.isNotEmptyString(searchStore.searchHintText));
        var hint = (React.createElement(TagGroup, { labelsConfig: optionsStore.selectedLablesConfig, onClose: function (v) {
                other.onChange(v, transformOption);
            } }));
        if (isAutoComplete) {
            return (React.createElement(HeadTagAutoComplete, __assign({ tag: '123' }, other, { onSearch: searchStore.onSearch, dataSource: transformOption, allowClear: true })));
        }
        var selectElement = (React.createElement(Select, __assign({ mode: mode, allowClear: true, autoClearSearchValue: false, showSearch: itemConfig.type === 'search', defaultActiveFirstOption: false, showArrow: true, optionFilterProp: "title", onSearch: itemConfig.type === 'search' ? searchStore.onSearch : undefined, notFoundContent: getNotFoundContent(itemConfig), loading: itemConfig.loading }, other, { onDropdownVisibleChange: function (open) {
                changeVisible(open ? open : undefined);
                !open && searchStore.resetKeyword();
            } }), optionsList));
        return React.createElement(React.Fragment, null, switchContainer(React.createElement(ValueHintContainer, { value: hint, visible: optionsStore.hasSelectedTag ? isVisible : false }), selectElement, itemConfig.multiple));
    }));
}).withConfig({ displayName: "OSearchItem", componentId: "sc-sqpo6j" })(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  text-align: ", ";\n"], ["\n  text-align: ", ";\n"])), function (props) { return props.center ? 'center' : undefined; });
var __$hoisted_o0 = { textAlign: 'center' };
var templateObject_1;
//# sourceMappingURL=index.js.map