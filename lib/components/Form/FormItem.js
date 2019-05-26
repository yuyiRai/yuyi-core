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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import Utils from "../../utils";
import Col from "antd/lib/col";
import "antd/lib/col/style/css.js";
import AntFormItem from 'antd/lib/form/FormItem';
import 'antd/lib/form/style/css';
import { autobind } from 'core-decorators';
import set from "lodash/set";
import { action, autorun, computed, reaction, runInAction } from 'mobx';
import { inject, observer, Provider } from 'mobx-react';
import { createTransformer, expr } from 'mobx-utils';
import * as React from 'react';
import { FormItemStoreCore } from './FormStore/FormItemStoreBase';
import { ItemSwitch } from './Item';
import { FormItemLoading } from './Item/common/Loading';
export var ChildrenContext = React.createContext({
    children: null
});
export var OAntFormItem = observer(function (props) {
    var itemConfig = props.itemConfig, children = props.children, other = __rest(props, ["itemConfig", "children"]);
    return React.createElement(AntFormItem, __assign({ colon: itemConfig.isViewOnly, label: itemConfig.label }, other), children);
});
var FormItemStore = /** @class */ (function (_super) {
    __extends(FormItemStore, _super);
    function FormItemStore(formStore, code) {
        var _this = _super.call(this, formStore, code) || this;
        _this.getFieldDecoratorOptions = createTransformer(function (itemConfig) {
            // console.log('update fieldDecorator options', itemConfig.rule)
            console.log('get fieldDecorator', _this.hasError);
            return {
                validateTrigger: ['onBlur', 'onChange'].concat(_this.hasError ? ['onInput'] : []),
                rules: itemConfig.rules, initialValue: itemConfig.value, getValueProps: function (value) {
                    // console.log('value filter', itemConfig.code, value, itemConfig);
                    return {
                        value: Utils.isNotEmptyValueFilter(itemConfig.computed !== false ? itemConfig.computed : undefined, itemConfig.currentComponentValue, itemConfig.currentValue, value)
                    };
                }
            };
        }, { debugNameGenerator: function () { return 'getFieldDecoratorOptions'; } });
        _this.setFormStore(formStore);
        _this.setAntdForm(formStore.antdForm);
        _this.ruleWatcher = reaction(function () { return _this.itemConfig.rules; }, function (rules) {
            // console.log('ruleWatcher', rule)
            _this.itemConfig.updateVersion();
            formStore.updateError(code);
            var value = Utils.cloneDeep(_this.itemConfig.currentValue);
            // this.antdForm.resetFields([this.code])
            if (_this.antdForm.getFieldError(_this.code)) {
                _this.antdForm.setFields(set({}, _this.code, { value: value }));
                // this.antdForm.validateFields([this.code])
            }
        });
        return _this;
    }
    Object.defineProperty(FormItemStore.prototype, "antdForm", {
        get: function () {
            return this.formStore.antdFormMap.get(this.code);
        },
        enumerable: true,
        configurable: true
    });
    FormItemStore.prototype.setAntdForm = function (antdForm) {
        this.formStore.setAntdForm(antdForm, this.code);
    };
    FormItemStore.prototype.init = function () {
        var _this = this;
        var formStore = this.formStore;
        // reaction(() => this.fieldDecorator, () => {
        //   console.log('fieldDecorator change', code)
        // })
        this.validateReset = autorun(function () {
            if (!_this.hasError || !_this.itemConfig.rules) {
                formStore.reactionAntdForm(function (antdForm) {
                    // console.log('updateVersion', code, this.antdForm.getFieldError(code))
                    _this.itemConfig.updateVersion();
                    _this.setAntdForm(antdForm);
                });
            }
            // this.antdForm.validateFields([code])
        });
    };
    FormItemStore.prototype.dispose = function () {
        this.ruleWatcher();
        this.validateReset();
    };
    Object.defineProperty(FormItemStore.prototype, "fieldDecorator", {
        get: function () {
            // console.log('get fieldDecorator')
            var _a = this, code = _a.code, antdForm = _a.antdForm;
            // trace()
            return this.itemConfig.$version > -1 && antdForm.getFieldDecorator(code, this.decoratorOptions);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemStore.prototype, "decoratorOptions", {
        get: function () {
            return this.getFieldDecoratorOptions(this.itemConfig);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemStore.prototype, "Component", {
        get: function () {
            var _a = this, code = _a.code, antdForm = _a.antdForm, itemConfig = _a.itemConfig;
            var type = itemConfig.type, displayProps = itemConfig.displayProps;
            // console.log('getComponent');
            return React.createElement(ItemSwitch, { type: type, code: code, antdForm: antdForm, disabled: displayProps.isDisabled, placeholder: itemConfig.placeholder });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemStore.prototype, "renderer", {
        get: function () {
            var itemConfig = this.itemConfig;
            // const { label } = itemConfig
            // console.log('get renderer', itemConfig.$version)
            return function (children) {
                return (React.createElement(Provider, { itemConfig: itemConfig },
                    React.createElement(FormItemContainer, { itemConfig: itemConfig }, children)));
            };
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "antdForm", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemStore.prototype, "setAntdForm", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormItemStore.prototype, "init", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormItemStore.prototype, "dispose", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "fieldDecorator", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "decoratorOptions", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "Component", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "renderer", null);
    return FormItemStore;
}(FormItemStoreCore));
export { FormItemStore };
var FormItem = /** @class */ (function (_super) {
    __extends(FormItem, _super);
    function FormItem(props) {
        var _this = _super.call(this, props) || this;
        // console.log('FormItem init', props);
        _this.state = {
            instance: _this,
            init: false
        };
        return _this;
    }
    FormItem.prototype.componentDidMount = function () {
        this.props.store.init();
    };
    FormItem.prototype.componentWillUnmount = function () {
        var _this = this;
        runInAction(function () { return _this.props.store.dispose(); });
    };
    FormItem.prototype.render = function () {
        var _a = this.props, code = _a.code, store = _a.store, other = __rest(_a, ["code", "store"]);
        var itemConfig = store.itemConfig, hasError = store.hasError;
        // console.log('remder', store.itemConfig.code, store.itemConfig.rule);
        // console.log(this.store.itemConfig.label)
        return store.renderer(React.createElement(FormItemLoading, { code: code },
            React.createElement(OAntFormItem, __assign({ help: itemConfig.displayProps.isShowMessage ? undefined : React.createElement("span", { style: { display: 'none' } }), itemConfig: itemConfig }, other, { style: itemConfig.displayProps.formItemStyle, validateStatus: hasError ? 'error' : 'success', hasFeedback: !['check', 'checkOne', 'radio', 'radioOne', 'group', 'textArea', 'textarea'].includes(itemConfig.type) }), store.fieldDecorator(React.cloneElement(store.Component)))));
    };
    FormItem = __decorate([
        inject(function (stores, props, context) {
            // console.log('fromitem get store', stores, props, context)
            var formStore = stores.formStore;
            var store = formStore.registerItemStore(props.code, function () { return new FormItemStore(formStore, props.code); });
            return { store: store };
        }),
        observer,
        __metadata("design:paramtypes", [Object])
    ], FormItem);
    return FormItem;
}(React.Component));
export default FormItem;
var FormItemContainer = /** @class */ (function (_super) {
    __extends(FormItemContainer, _super);
    function FormItemContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastContainerProps = {};
        _this.styleTransform = createTransformer(function (itemConfig) {
            // console.log('FormItemContainer style change')
            return { display: itemConfig.hidden ? 'none' : undefined };
        });
        _this.propsTransform = createTransformer(function (itemConfig) {
            // console.log('FormItemContainer props change')
            var type = itemConfig.type, _a = itemConfig.displayProps, colSpan = _a.colSpan, useColumn = _a.useColumn, lg = itemConfig.lg, sm = itemConfig.sm, xs = itemConfig.xs, offset = itemConfig.offset;
            return { type: type, displayProps: { colSpan: colSpan, useColumn: useColumn }, lg: lg, sm: sm, xs: xs, offset: offset };
        });
        return _this;
    }
    Object.defineProperty(FormItemContainer.prototype, "style", {
        get: function () {
            var itemConfig = this.props.itemConfig;
            return {
                display: expr(function () { return itemConfig.hidden ? 'none' : undefined; }),
                maxHeight: itemConfig.type !== 'textarea' && itemConfig.displayProps.colSpan <= 12 && '34px'
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemContainer.prototype, "containerProps", {
        get: function () {
            var itemConfig = this.props.itemConfig;
            return this.propsTransform(itemConfig);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemContainer.prototype, "renderer", {
        get: function () {
            // console.log('FormItemContainer container change')
            var _a = this.containerProps, type = _a.type, _b = _a.displayProps, colSpan = _b.colSpan, useColumn = _b.useColumn, lg = _a.lg, sm = _a.sm, xs = _a.xs, offset = _a.offset;
            if (useColumn === false) {
                return this.props.children;
            }
            if (type === 'address') {
                return (React.createElement(Col, { className: 'use-item-col', lg: lg || 16, sm: 24, offset: offset, style: this.style }, this.props.children));
            }
            return (React.createElement(Col, { className: 'use-item-col', lg: colSpan, sm: sm || 12, xs: xs || 24, offset: offset, style: this.style }, this.props.children));
        },
        enumerable: true,
        configurable: true
    });
    FormItemContainer.prototype.render = function () {
        return this.renderer;
    };
    FormItemContainer.contextType = ChildrenContext;
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemContainer.prototype, "style", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemContainer.prototype, "containerProps", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemContainer.prototype, "renderer", null);
    FormItemContainer = __decorate([
        observer
    ], FormItemContainer);
    return FormItemContainer;
}(React.Component));
export { FormItemContainer };
//# sourceMappingURL=FormItem.js.map