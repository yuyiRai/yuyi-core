var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { Utils } from "../../utils";
import LocaleProvider from 'antd/lib/locale-provider';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import * as React from 'react';
import { FormStore } from './FormStore';
export var NativeStore = React.createContext({ formStore: FormStore.prototype });
export var CommonFormContext = React.createContext({ formProps: null, formInstance: null });
var CommonForm = /** @class */ (function (_super) {
    __extends(CommonForm, _super);
    function CommonForm(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            formStore: FormStore.registerForm(props.model, _this)
        };
        return _this;
    }
    CommonForm.getDerivedStateFromProps = function (nextProps, prevState) {
        var last = prevState.formStore;
        if (!Utils.isEqual(Utils.zipEmptyData(last.formSource), Utils.zipEmptyData(nextProps.model))) {
            // console.log('getDerivedStateFromProps', nextProps, prevState)
            FormStore.disposedForm(last.formSource);
            // debugger
            FormStore.registerForm(nextProps.model, this, last);
            // prevState.formStore.formItemMap.delete(prevState.formStore.formSource)
        }
        if (!Utils.isNil(nextProps.model)) {
            var formStore = FormStore.registerForm(nextProps.model, prevState.formStore.instance, prevState.formStore);
            if (Utils.isFunction(nextProps.storeRef)) {
                nextProps.storeRef(formStore);
            }
            if (Utils.isFunction(nextProps.onItemChange)) {
                formStore.onItemChange(nextProps.onItemChange);
            }
            // console.log('formStore diff', nextProps.storeRef, formStore, prevState.formStore, formStore !== prevState.formStore)
            if (formStore !== prevState.formStore) {
                return __assign({}, prevState, { formStore: formStore });
            }
        }
        return prevState;
    };
    CommonForm.prototype.render = function () {
        var children = this.props.children;
        // const { Inter } = this
        return (React.createElement(LocaleProvider, { locale: zh_CN },
            React.createElement(CommonFormContext.Provider, { value: { formProps: this.props, formInstance: this } },
                React.createElement(NativeStore.Provider, { value: { formStore: this.state.formStore } },
                    React.createElement(React.Fragment, null, children)))));
    };
    return CommonForm;
}(React.Component));
export { CommonForm };
//# sourceMappingURL=CommonForm.js.map