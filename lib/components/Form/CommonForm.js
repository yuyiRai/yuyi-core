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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var FormStore_1 = require("./FormStore");
var mobx_react_1 = require("mobx-react");
exports.NativeStore = React.createContext({ storeForm: null });
var locale_provider_1 = __importDefault(require("antd/lib/locale-provider"));
var zh_CN_1 = __importDefault(require("antd/lib/locale-provider/zh_CN"));
var Form_1 = require("./Form");
var utils_1 = require("../../utils");
var CommonForm = /** @class */ (function (_super) {
    __extends(CommonForm, _super);
    function CommonForm(props) {
        var _this = _super.call(this, props) || this;
        console.log('init parsent formStore', props.formStore);
        _this.state = {
            formStore: FormStore_1.FormStore.registerForm(props.model, _this)
        };
        return _this;
    }
    CommonForm.getDerivedStateFromProps = function (nextProps, prevState) {
        var last = prevState.formStore;
        if (nextProps.formStore) {
            // console.log('getter parsent formStore', nextProps.formStore)
        }
        if (last.formSource !== nextProps.model) {
            // console.log('getDerivedStateFromProps', nextProps, prevState)
            FormStore_1.FormStore.disposedForm(prevState.formStore.formSource);
            prevState.formStore.formItemMap.delete(prevState.formStore.formSource);
        }
        if (!utils_1.Utils.isNil(nextProps.model)) {
            var formStore = FormStore_1.FormStore.registerForm(nextProps.model, prevState.formStore.instance, prevState.formStore);
            if (nextProps.config) {
                formStore.setConfig(nextProps.config);
            }
            if (utils_1.Utils.isFunction(nextProps.storeRef)) {
                nextProps.storeRef(formStore);
            }
            // console.log('formStore diff', nextProps.storeRef, formStore, prevState.formStore, formStore !== prevState.formStore)
            if (formStore !== prevState.formStore) {
                return __assign({}, prevState, { formStore: formStore });
            }
        }
        return prevState;
    };
    CommonForm.prototype.render = function () {
        var _a = this.props, children = _a.children, config = _a.config;
        return (React.createElement(locale_provider_1.default, { locale: zh_CN_1.default },
            React.createElement(exports.NativeStore.Provider, { value: { storeForm: this.state.formStore } },
                React.createElement(React.Fragment, null,
                    utils_1.Utils.isArray(config) && React.createElement(Form_1.FormGroup, { config: config }),
                    children))));
    };
    CommonForm.defaultProps = {
        model: {}
    };
    __decorate([
        utils_1.Utils.observable,
        __metadata("design:type", Object)
    ], CommonForm.prototype, "state", void 0);
    CommonForm = __decorate([
        mobx_react_1.inject(function (stores, nextProps, context) {
            console.log('CommonForm get store', stores, nextProps, context);
            return { 'storeForm': stores['storeForm'] };
        }),
        mobx_react_1.observer,
        __metadata("design:paramtypes", [Object])
    ], CommonForm);
    return CommonForm;
}(React.Component));
exports.CommonForm = CommonForm;
