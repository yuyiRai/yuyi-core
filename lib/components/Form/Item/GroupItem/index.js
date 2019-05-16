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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import Row from "antd/lib/row";
import "antd/lib/row/style/css.js";
import set from "lodash/set";
import * as React from 'react';
import { ItemSwitchType } from '..';
import { FormItemContainer } from '../../FormItem';
import { commonInjectItem } from '../commonInjectItem';
import styled from 'styled-components';
var InnerRow = styled(Row).withConfig({ displayName: "InnerRow", componentId: "sc-1pekww9" })(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100% !important;\n"], ["\n  width: 100% !important;\n"])));
var GroupItem = commonInjectItem(function (props) {
    var antdForm = props.antdForm, formStore = props.formStore, code = props.code, itemConfig = props.itemConfig, value = props.value, other = __rest(props, ["antdForm", "formStore", "code", "itemConfig", "value"]);
    var itemType = Utils.reduce(itemConfig.childrenConfig, function (obj, config, key) {
        var Component = ItemSwitchType(config.type);
        var children = (React.createElement(Component, __assign({ code: config.code, itemConfig: config, onChange: function (v) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var changeV = set(Utils.cloneDeep(value), config.keyInnerCode, v);
                console.log.apply(console, __spread(['GroupItem', 'change', value], args));
                other.onChange(changeV);
            }, value: config.currentComponentValue, placeholder: config.placeholder }, { antdForm: antdForm, formStore: formStore })));
        return __spread(obj, [(React.createElement(FormItemContainer, { key: key, itemConfig: config }, children))]);
    }, []);
    console.log('GroupItem', value, itemConfig.childrenConfig, itemConfig, antdForm, formStore, code, __assign({}, other));
    return React.createElement(InnerRow, null, itemType);
});
// export class OGroupItem extends React.Component<IGroupItemProps> {
//   render() {
//   }
// }
export default GroupItem;
var templateObject_1;
//# sourceMappingURL=index.js.map