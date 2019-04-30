"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var row_1 = __importDefault(require("antd/lib/row"));
require("antd/lib/row/style/css");
var mobx_react_1 = require("mobx-react");
var React = __importStar(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var FormItem_1 = __importDefault(require("./FormItem"));
var util_1 = require("./util");
var formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18, offset: 1 } };
var Form = /** @class */ (function (_super) {
    __extends(Form, _super);
    function Form() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            itemChildren: [],
            lastConfig: [],
            form: null
        };
        return _this;
    }
    Form.getDerivedStateFromProps = function (nextProps, prevState) {
        var form = nextProps.form, storeForm = nextProps.storeForm;
        if (storeForm !== prevState.lastConfig) {
            console.log(Utils);
            console.log(storeForm.configList, prevState.lastConfig, storeForm.configList === prevState.lastConfig);
            prevState.itemChildren = (React.createElement(For, { index: 'i', each: "config", of: storeForm.configList },
                React.createElement(FormItem_1.default, __assign({}, formItemLayout, { key: i, code: config.code })))
            // storeForm.configList.map(config => {
            //   return <FormItem {...formItemLayout} key={config.code} code={config.code}></FormItem>
            // })
            );
            // prevState.a = (
            //   <For each="config" of={storeForm.configList} index="i">
            //     <FormItem {...formItemLayout} key={config.code} code={config.code}></FormItem>
            //   </For>
            // )
            prevState.form = form;
            prevState.lastConfig = storeForm;
            storeForm.setAntdForm(form);
        }
        storeForm.receiveAntdForm(form);
        console.log('getDerivedStateFromProps');
        return prevState;
    };
    // @Utils.computed get itemChildren(){
    //   const { storeForm } = this.props
    //   return storeForm.configList.map(config => {
    //     return <FormItem {...formItemLayout} key={config.code} code={config.code}></FormItem>
    //   })
    // }
    Form.prototype.render = function () {
        var form = this.state.form;
        var _a = this.props, children = _a.children, className = _a.className;
        console.log(form, children);
        return (React.createElement(mobx_react_1.Provider, { antdForm: form },
            React.createElement(React.Fragment, null,
                React.createElement(If, { condition: true }, "good taste in music"),
                React.createElement(row_1.default, { className: className }, this.state.itemChildren),
                React.createElement("div", null, children))));
    };
    Form = __decorate([
        mobx_react_1.observer
    ], Form);
    return Form;
}(React.Component));
exports.default = Form;
exports.StyledForm = styled_components_1.default(Form)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-color: #f522d2;\n  .has-error .el-input__inner, .has-error .el-input__inner:hover {\n    border-color: #f5222d !important;\n  }\n  .el-input__inner:not(.is-disabled) {\n    &.is-active, &.is-hover, &:hover, &:focus {\n      border-color: #40a9ff;\n      transition: all 0.3s;\n    }\n    &.is-active, &:focus {\n      border-right-width: 1px !important;\n      outline: 0;\n      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);    \n    }\n  }\n  .has-error .el-input__inner:focus:not(.is-disabled) {\n    border-color: #ff4d4f;\n    box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);\n  }\n"], ["\n  border-color: #f522d2;\n  .has-error .el-input__inner, .has-error .el-input__inner:hover {\n    border-color: #f5222d !important;\n  }\n  .el-input__inner:not(.is-disabled) {\n    &.is-active, &.is-hover, &:hover, &:focus {\n      border-color: #40a9ff;\n      transition: all 0.3s;\n    }\n    &.is-active, &:focus {\n      border-right-width: 1px !important;\n      outline: 0;\n      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);    \n    }\n  }\n  .has-error .el-input__inner:focus:not(.is-disabled) {\n    border-color: #ff4d4f;\n    box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);\n  }\n"])));
exports.InjectedForm = util_1.form(exports.StyledForm);
exports.FormGroup = mobx_react_1.inject(function (stores, nextProps, context) {
    console.log('fromgroup get store', stores, nextProps, context);
    var store = stores['storeForm'];
    if (store) {
        store.setConfig(nextProps.config);
    }
    return { 'storeForm': stores['storeForm'] };
})(mobx_react_1.observer(function (props) {
    return React.createElement(exports.InjectedForm, __assign({}, props));
}));
var templateObject_1;
