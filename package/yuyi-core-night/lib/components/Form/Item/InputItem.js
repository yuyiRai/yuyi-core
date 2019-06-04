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
import Input from 'antd/lib/input';
import 'antd/lib/input/style/css';
import React from 'react';
import { commonInjectItem } from "./commonInjectItem";
import { Utils } from '../../../utils';
import { isFunction } from 'util';
import { ValueHintContainer } from './OptionsUtil/ToolTipContainer';
// import { SlotContext } from '../../../utils/SlotUtils';
var inev = Utils.isNotEmptyValueFilter;
export function useShadowValue(initValue, props) {
    var itemConfig = props.itemConfig, onChange = props.onChange, onBlur = props.onBlur, currentValue = props.value;
    var state = React.useState(initValue);
    var _a = __read(React.useState(initValue), 2), lastV = _a[0], setLastV = _a[1]; // 记录最后变更的值
    var shadowValue = state[0];
    var setShadowValue = state[1];
    React.useEffect(function () {
        if (inev(lastV) !== inev(currentValue)) {
            // console.log('input: change props value', inev(lastV), inev(currentValue))
            setShadowValue(currentValue);
            setLastV(currentValue);
        }
    }, [currentValue, lastV, setShadowValue, setLastV]);
    if (itemConfig.watchInput) {
        return {
            value: shadowValue,
            onChange: function (e) {
                var nextValue = e.target.value;
                setShadowValue(nextValue);
                onChange(e);
                if (lastV !== nextValue) { // 记录最后变更的值
                    setLastV(nextValue);
                }
            },
            onBlur: onBlur
        };
    }
    else {
        return {
            value: shadowValue,
            onChange: function (e) {
                setShadowValue(e.target.value);
            },
            onBlur: function (e) {
                if (inev(e.target.value) !== inev(currentValue)) {
                    onChange(e);
                    if (lastV !== e.target.value) // 记录最后变更的值
                        setLastV(e.target.value);
                }
                isFunction(onBlur) && onBlur(e);
            }
        };
    }
}
export var InputItem = commonInjectItem(function (props) { return React.createElement(Text, __assign({}, props)); });
export var TextAreaItem = commonInjectItem(function (props) { return React.createElement(Area, __assign({}, props)); });
var Text = function (props) {
    var antdForm = props.antdForm, formStore = props.formStore, code = props.code, itemConfig = props.itemConfig, other = __rest(props, ["antdForm", "formStore", "code", "itemConfig"]);
    var _a = useShadowValue(itemConfig.currentValue, props), value = _a.value, onChange = _a.onChange, onBlur = _a.onBlur;
    // console.log('fieldDecoratorOption', itemConfig.label, value, other.value, other);
    // const { slots } = React.useContext(SlotContext)
    // const Inter = slots.inter
    // console.log(slots)
    return React.createElement(React.Fragment, null, (React.createElement(ValueHintContainer, { value: value },
        React.createElement(Input, __assign({ allowClear: false }, other, { onChange: onChange, value: value, onBlur: onBlur, suffix: itemConfig.suffix, maxLength: itemConfig.maxLength })))));
    // return <Input {...other}/>
};
var Area = function (props) {
    var antdForm = props.antdForm, formStore = props.formStore, code = props.code, itemConfig = props.itemConfig, other = __rest(props, ["antdForm", "formStore", "code", "itemConfig"]);
    var _a = useShadowValue(other.value, props), value = _a.value, onChange = _a.onChange, onBlur = _a.onBlur;
    return (React.createElement(Input.TextArea, __assign({}, other, { rows: !itemConfig.autoSize && 4, value: value, onChange: onChange, onBlur: onBlur, autosize: itemConfig.autoSize })));
};
export default Text;
//# sourceMappingURL=InputItem.js.map