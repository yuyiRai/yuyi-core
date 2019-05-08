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
require("antd/lib/select/style/css");
var mobx_react_lite_1 = require("mobx-react-lite");
var OptionsUtil_1 = require("../OptionsUtil");
var commonInjectItem_1 = require("../commonInjectItem");
var styled_components_1 = __importDefault(require("styled-components"));
var ToolTipContainer_1 = require("../OptionsUtil/ToolTipContainer");
var TagGroup_1 = require("./TagGroup");
var mobx_utils_1 = require("mobx-utils");
exports.SearchItem = commonInjectItem_1.commonInjectItem(function (props) {
    return React.createElement(exports.OSearchItem, __assign({}, props, { center: true }));
});
exports.OSearchResultGroup = function (_a) {
    var disabled = _a.disabled, props = __rest(_a, ["disabled"]);
    if (disabled) {
        return React.createElement(React.Fragment, null, props.children);
    }
    return (React.createElement(antd_1.Select.OptGroup, __assign({}, props), props.children));
};
function preSwitchContainer(Container) {
    return function (props, children, switchValue) { return switchContainer(Container, props, children, switchValue); };
}
exports.preSwitchContainer = preSwitchContainer;
function switchContainer(Container, props, children, switchValue) {
    if (switchValue) {
        return React.createElement(Container, __assign({}, props), children);
    }
    return children;
}
exports.switchContainer = switchContainer;
exports.getSelectModel = mobx_utils_1.createTransformer(function (itemConfig) {
    if (itemConfig.multiple) {
        if (itemConfig.allowCreate) {
            return 'tags';
        }
        return 'multiple';
    }
    return undefined;
});
exports.getNotFoundContent = mobx_utils_1.createTransformer(function (itemConfig) {
    return itemConfig.loading ? React.createElement("div", { style: { textAlign: 'center' } },
        React.createElement(antd_1.Spin, { size: "small" })) : undefined;
});
exports.OSearchItem = styled_components_1.default(function (props) {
    var antdForm = props.antdForm, formStore = props.formStore, code = props.code, itemConfig = props.itemConfig, other = __rest(props, ["antdForm", "formStore", "code", "itemConfig"]);
    var searchStore = OptionsUtil_1.useSearchStore(itemConfig, function (store) {
        return store.displayOptions.map(function (d) { return React.createElement(antd_1.Select.Option, { title: d.label, key: d.key, value: d.value }, d.label); });
    });
    var optionsStore = itemConfig.optionsStore;
    var transformOption = optionsStore.transformOption;
    console.log(props, optionsStore.displayOptions, transformOption);
    var mode = exports.getSelectModel(itemConfig);
    return (React.createElement(mobx_react_lite_1.Observer, null, function () {
        var _a = __read(React.useState(undefined), 2), isVisible = _a[0], changeVisible = _a[1];
        var optionsList = switchContainer(antd_1.Select.OptGroup, { key: searchStore.searchHintText }, transformOption, Utils.isNotEmptyString(searchStore.searchHintText));
        var hint = (React.createElement(TagGroup_1.TagGroup, { labelsConfig: optionsStore.selectedLablesConfig, onClose: function (v) {
                other.onChange(v, transformOption);
            } }));
        var selectElement = (React.createElement(antd_1.Select, __assign({ mode: mode, showSearch: true, defaultActiveFirstOption: false, showArrow: true, optionFilterProp: "title", 
            // filterOption={false}
            dropdownRender: mode !== 'tags' ? function (menu, props) {
                // console.log('dropdownRender', menu.props.menuItems)
                // const { menuItems, ...other } = menu.props
                // if (searchStore.searchHintText) {
                //   menu = React.cloneElement(menu, {
                //     ...other,
                //     menuItems: [menuItems[menuItems.length-1]]
                //   })
                // }
                return (React.createElement("div", null,
                    false && exports.getNotFoundContent(itemConfig),
                    menu));
            } : undefined, onSearch: searchStore.onSearch, notFoundContent: exports.getNotFoundContent(itemConfig) || 'Not Found', loading: itemConfig.loading }, other, { onDropdownVisibleChange: function (open) {
                changeVisible(open ? open : undefined);
                !open && searchStore.resetKeyword();
            } }), optionsList));
        return (React.createElement(React.Fragment, null,
            React.createElement("span", null, searchStore.keyWord),
            switchContainer(ToolTipContainer_1.ValueHintContainer, {
                value: hint,
                visible: optionsStore.hasSelectedTag ? isVisible : false
            }, selectElement, itemConfig.multiple)));
    }));
})(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: block !important;\n  text-align: ", ";\n"], ["\n  display: block !important;\n  text-align: ", ";\n"])), function (props) { return props.center ? 'center' : undefined; });
var templateObject_1;
