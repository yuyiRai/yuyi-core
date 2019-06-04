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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import Row from "antd/lib/row";
import "antd/lib/row/style/css.js";
import Col from "antd/lib/col";
import "antd/lib/col/style/css.js";
import Checkbox from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style/css';
// import Switch, { SwitchProps } from 'antd/lib/switch';
// import 'antd/lib/switch/style/css';
import 'element-theme-default/lib/switch.css';
import Switch from "element-react/dist/npm/es6/src/switch";
import * as React from 'react';
import { commonInjectItem } from "./commonInjectItem";
import { useOptionsStore } from './OptionsUtil';
import { Observer } from "mobx-react-lite";
// import { SlotContext } from '@/utils/SlotUtils';
import { ScopedSlot } from '../../../utils/SlotUtils';
import pullAll from "lodash/pullAll";
export var CheckItem = commonInjectItem(function (props) { return React.createElement(Check, __assign({}, props)); });
var Check = function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, onChange = _a.onChange, onBlur = _a.onBlur, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig", "onChange", "onBlur"]);
    var store = useOptionsStore(itemConfig);
    // const { scopedSlots } = React.useContext(SlotContext)
    if (itemConfig.useSlot) {
        // const slot: CheckScopedSlot = scopedSlots[itemConfig.slot]
        // const slotFactory = (options: Option, index: number) => slot({
        //   col: {
        //     data: other.value,
        //     item: options,
        //     index,
        //     props: formStore.formSource
        //   },
        //   value: other.value && other.value.includes(options.value),
        //   onChange: (checked: boolean) => {
        //     if (checked) {
        //       const nextV = Utils.isArrayFilter(other.value) || []
        //       nextV.push(options.value)
        //       onChange(nextV)
        //     } else {
        //       onChange(pullAll([...Utils.castArray(other.value)], [options.value]))
        //     }
        //   },
        //   config: itemConfig
        // })
        // return (
        //   <div className='el-checkbox-group'>
        //     <For index='i' each='option' of={store.displayOptions}>
        //       <span key={i}>{ slotFactory(option, i) }</span>
        //     </For>
        //   </div>
        // )
        var slotFactory = function (options, index) { return ({
            col: {
                data: other.value,
                item: options,
                index: index,
                props: formStore.formSource
            },
            value: other.value && other.value.includes(options.value),
            onChange: function (checked) {
                if (checked) {
                    var nextV = Utils.isArrayFilter(other.value) || [];
                    nextV.push(options.value);
                    onChange(nextV);
                }
                else {
                    onChange(pullAll(__spread(Utils.castArray(other.value)), [options.value]));
                }
            },
            config: itemConfig
        }); };
        return (React.createElement("div", { className: 'el-checkbox-group' }, Array.from((store.displayOptions), function (option, i) { return React.createElement(ScopedSlot, __assign({ key: option.value, name: itemConfig.slot }, slotFactory(option, i))); })));
    }
    return (React.createElement(Observer, null, function () {
        return React.createElement(Checkbox.Group, __assign({}, other, { style: __$hoisted_o0, onChange: function (e) {
                console.log(itemConfig.slot, e);
                onChange(e);
            }, options: store.displayOptions }),
            React.createElement(Row, null,
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "A" }, "A")),
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "B" }, "B")),
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "C" }, "C")),
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "D" }, "D")),
                React.createElement(Col, { span: 8 },
                    React.createElement(Checkbox, { value: "E" }, "E"))));
    }));
};
var OSwitch = function (_a) {
    var antdForm = _a.antdForm, formStore = _a.formStore, code = _a.code, itemConfig = _a.itemConfig, other = __rest(_a, ["antdForm", "formStore", "code", "itemConfig"]);
    console.log(other);
    return React.createElement(Switch, __assign({}, other));
};
export var SwitchItem = commonInjectItem(function (props) { return React.createElement(OSwitch, __assign({}, props, { onText: '', offText: '' })); });
var __$hoisted_o0 = { width: '100%' };
//# sourceMappingURL=CheckItem.js.map