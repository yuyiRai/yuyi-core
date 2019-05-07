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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
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
var antd_1 = require("antd");
var FormItem_1 = __importDefault(require("antd/lib/form/FormItem"));
require("antd/lib/form/style/css");
var mobx_react_1 = require("mobx-react");
var React = __importStar(require("react"));
var stores_1 = require("../../stores");
var utils_1 = __importDefault(require("../../utils"));
var Item_1 = require("./Item");
var mobx_1 = require("mobx");
var lodash_1 = require("lodash");
var mobx_utils_1 = require("mobx-utils");
var FormStore_1 = require("./FormStore");
var core_decorators_1 = require("core-decorators");
var ChildrenContext = React.createContext({
    children: null
});
exports.OAntFormItem = mobx_react_1.observer(function (props) {
    var itemConfig = props.itemConfig, children = props.children, other = __rest(props, ["itemConfig", "children"]);
    return React.createElement(FormItem_1.default, __assign({ colon: itemConfig.isViewOnly, label: itemConfig.label }, other), children);
});
var FormItemStore = /** @class */ (function () {
    function FormItemStore(formStore, code) {
        var _this = this;
        this.getFieldDecorator = function (store) {
            var code = store.code, antdForm = store.antdForm, formStore = store.formStore;
            var itemConfig = store.itemConfig;
            var value = itemConfig.value;
            var hasError = formStore.hasErrors(itemConfig.code);
            console.log('get fieldDecorator', value, hasError);
            // const { itemConfig } = this.state;
            // const { value } = itemConfig
            return antdForm.getFieldDecorator(code, _this.decoratorOptions);
        };
        this.getFieldDecoratorOptions = mobx_utils_1.createTransformer(function (itemConfig) {
            // console.log('update fieldDecorator options', itemConfig.rule)
            return {
                validateTrigger: ['onChange', 'onBlur'],
                rules: itemConfig.rule, initialValue: itemConfig.value, getValueProps: function (value) {
                    // console.log('value filter', itemConfig.code, value, itemConfig);
                    return { value: utils_1.default.isNotEmptyValueFilter(itemConfig.currentComponentValue, itemConfig.currentValue, value) };
                }
            };
        }, { debugNameGenerator: function () { return 'getFieldDecoratorOptions'; } });
        this.formStore = formStore;
        this.itemConfig = new stores_1.ItemConfig(formStore.getConfig(code), formStore.formSource, this);
        this.itemConfig.setFormStore(formStore);
        this.setAntdForm(formStore.antdForm);
        this.ruleWatcher = mobx_1.reaction(function () { return _this.itemConfig.rule; }, function (rule) {
            // console.log('ruleWatcher', rule)
            _this.itemConfig.updateVersion();
            formStore.updateError(code);
            var value = utils_1.default.cloneDeep(_this.itemConfig.currentValue);
            // this.antdForm.resetFields([this.code])
            if (_this.antdForm.getFieldError(_this.code)) {
                _this.antdForm.setFields(lodash_1.set({}, _this.code, { value: value }));
                // this.antdForm.validateFields([this.code])
            }
        });
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
    Object.defineProperty(FormItemStore.prototype, "code", {
        get: function () {
            return this.itemConfig.code;
        },
        enumerable: true,
        configurable: true
    });
    FormItemStore.prototype.init = function () {
        var _this = this;
        var _a = this, formStore = _a.formStore, code = _a.code;
        // reaction(() => this.fieldDecorator, () => {
        //   console.log('fieldDecorator change', code)
        // })
        this.validateReset = mobx_1.autorun(function () {
            if (!formStore.hasErrors(code) || !_this.itemConfig.rule) {
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
            // trace()
            return this.itemConfig.$version > -1 && this.getFieldDecorator(this);
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
            var Component = Item_1.ItemSwitchType(type);
            // console.log('getComponent');
            return React.createElement(Component, { code: code, antdForm: antdForm, disabled: displayProps.isDisabled, placeholder: itemConfig.placeholder || "\u8BF7\u8F93\u5165" + itemConfig.label });
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
                return (React.createElement(mobx_react_1.Provider, { itemConfig: itemConfig },
                    React.createElement(ChildrenContext.Provider, { value: { children: children } },
                        React.createElement(FormItemContainer, null, children))));
            };
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        mobx_1.observable,
        __metadata("design:type", stores_1.ItemConfig)
    ], FormItemStore.prototype, "itemConfig", void 0);
    __decorate([
        mobx_1.observable.ref,
        __metadata("design:type", FormStore_1.FormStore)
    ], FormItemStore.prototype, "formStore", void 0);
    __decorate([
        mobx_1.computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "antdForm", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemStore.prototype, "setAntdForm", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "code", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormItemStore.prototype, "init", null);
    __decorate([
        core_decorators_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormItemStore.prototype, "dispose", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "fieldDecorator", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "decoratorOptions", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "Component", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemStore.prototype, "renderer", null);
    return FormItemStore;
}());
exports.FormItemStore = FormItemStore;
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
        mobx_1.runInAction(function () { return _this.props.store.dispose(); });
    };
    FormItem.prototype.render = function () {
        var _a = this.props, code = _a.code, store = _a.store, other = __rest(_a, ["code", "store"]);
        // console.log('remder', store.itemConfig.code, store.itemConfig.rule);
        // console.log(this.store.itemConfig.label)
        return store.renderer(React.createElement(exports.OAntFormItem, __assign({ itemConfig: store.itemConfig }, other), store.fieldDecorator(React.cloneElement(store.Component))));
    };
    FormItem = __decorate([
        mobx_react_1.inject(function (stores, props, context) {
            console.log('fromitem get store', stores, props, context);
            var formStore = stores.formStore;
            var store = formStore.registerItemStore(props.code);
            store.itemConfig.setForm(formStore.formSource);
            return { store: store };
        }),
        mobx_react_1.observer,
        __metadata("design:paramtypes", [Object])
    ], FormItem);
    return FormItem;
}(React.Component));
exports.default = FormItem;
var FormItemContainer = /** @class */ (function (_super) {
    __extends(FormItemContainer, _super);
    function FormItemContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lastContainerProps = {};
        _this.styleTransform = mobx_utils_1.createTransformer(function (itemConfig) {
            // console.log('FormItemContainer style change')
            return { display: itemConfig.hidden ? 'none' : undefined };
        });
        _this.propsTransform = mobx_utils_1.createTransformer(function (itemConfig) {
            // console.log('FormItemContainer props change')
            var type = itemConfig.type, _a = itemConfig.displayProps, colSpan = _a.colSpan, useColumn = _a.useColumn, lg = itemConfig.lg, sm = itemConfig.sm, xs = itemConfig.xs, offset = itemConfig.offset;
            return { type: type, displayProps: { colSpan: colSpan, useColumn: useColumn }, lg: lg, sm: sm, xs: xs, offset: offset };
        });
        return _this;
    }
    Object.defineProperty(FormItemContainer.prototype, "style", {
        get: function () {
            var _this = this;
            return { display: mobx_utils_1.expr(function () { return _this.props.itemConfig.hidden ? 'none' : undefined; }) };
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
    Object.defineProperty(FormItemContainer.prototype, "children", {
        get: function () {
            // console.log('FormItemContainer children change')
            return (React.createElement(ChildrenContext.Consumer, null, function (_a) {
                var children = _a.children;
                return children;
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemContainer.prototype, "renderer", {
        get: function () {
            // console.log('FormItemContainer container change')
            var _a = this.containerProps, type = _a.type, _b = _a.displayProps, colSpan = _b.colSpan, useColumn = _b.useColumn, lg = _a.lg, sm = _a.sm, xs = _a.xs, offset = _a.offset;
            if (useColumn === false) {
                return this.children;
            }
            if (type === 'address') {
                return (React.createElement(antd_1.Col, { className: 'use-item-col', lg: lg || 16, sm: 24, offset: offset, style: this.style }, this.children));
            }
            return (React.createElement(antd_1.Col, { className: 'use-item-col', lg: colSpan, sm: sm || 12, xs: xs || 24, offset: offset, style: this.style }, this.children));
        },
        enumerable: true,
        configurable: true
    });
    FormItemContainer.prototype.render = function () {
        return this.renderer;
    };
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemContainer.prototype, "style", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemContainer.prototype, "containerProps", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemContainer.prototype, "children", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormItemContainer.prototype, "renderer", null);
    FormItemContainer = __decorate([
        mobx_react_1.inject('itemConfig'),
        mobx_react_1.observer
    ], FormItemContainer);
    return FormItemContainer;
}(React.Component));
exports.FormItemContainer = FormItemContainer;
