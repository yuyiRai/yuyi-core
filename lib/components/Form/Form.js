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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Row from 'antd/lib/row';
import 'antd/lib/row/style/css';
import { observer, Provider } from 'mobx-react';
import * as React from 'react';
import { CommonFormContext, NativeStore } from './CommonForm';
import { FormContainer } from './FormContainer';
import FormItem from './FormItem';
import { FormStore } from './FormStore';
import { form } from './util';
// import { Utils } from '../../build';
var defaultFormItemLayout = { labelCol: { span: 1, offset: 0 }, wrapperCol: { span: 1, offset: 0 } };
export var FormItemGroup = observer(function (props) {
    var formStore = props.formStore, _a = props.formItemLayout, formItemLayout = _a === void 0 ? defaultFormItemLayout : _a;
    return (Array.from((formStore.configStore.configList), function (config, i) { return React.createElement(FormItem, __assign({}, formItemLayout, { key: i, code: config.code })); }));
});
var Form = /** @class */ (function (_super) {
    __extends(Form, _super);
    function Form() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            lastConfig: [],
            lastStore: null,
            form: null
        };
        return _this;
    }
    Form.getDerivedStateFromProps = function (nextProps, prevState) {
        var form = nextProps.form, formStore = nextProps.formStore;
        if (formStore instanceof FormStore) {
            formStore.setConfig(nextProps.config);
            if (formStore !== prevState.lastStore) {
                // console.log(Utils, nameof<Form>())
                console.log(formStore.configStore.configList, prevState.lastConfig, formStore.configStore.configList === prevState.lastConfig);
                prevState.form = form;
                prevState.lastStore = formStore;
                prevState.lastConfig = nextProps.config;
                formStore.setAntdForm(form);
            }
            formStore.receiveAntdForm(form);
            // console.log('getDerivedStateFromProps', nextProps)
        }
        return prevState;
    };
    Form.prototype.render = function () {
        var form = this.state.form;
        var _a = this.props, children = _a.children, className = _a.className;
        // console.log(form, children)
        return (React.createElement(FormContainer, __assign({}, this.props),
            React.createElement(Provider, { antdForm: form, formStore: this.props.formStore },
                React.createElement(React.Fragment, null,
                    React.createElement(Row, { className: className },
                        React.createElement(FormItemGroup, __assign({}, this.props))),
                    React.createElement("div", null, children)))));
    };
    Form.defaultProps = {
        labelWidth: 150
    };
    Form = __decorate([
        observer
    ], Form);
    return Form;
}(React.Component));
export default Form;
export var InjectedForm = form(Form);
export var FormGroup = function (props) {
    var _a = React.useContext(CommonFormContext), formInstance = _a.formInstance, formProps = _a.formProps;
    var formStore = React.useContext(NativeStore).formStore;
    // console.log('fromgroup get store', props, formStore, formInstance, formProps)
    return formStore && React.createElement(InjectedForm, __assign({}, props, { formStore: formStore, mode: formProps.model, formInstance: formInstance }));
};
//# sourceMappingURL=Form.js.map