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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
import { autobind } from 'core-decorators';
import { action, computed, observable, toJS } from 'mobx';
import { createTransformer, createViewModel, expr } from 'mobx-utils';
import { FormStore } from '../../components/Form/FormStore';
import { EventStoreInject } from "../EventStore";
import { Utils } from '../../utils/Utils';
import { CommonStore } from "./interface/CommonStore";
var ItemConfigBaseConfigModel = /** @class */ (function (_super) {
    __extends(ItemConfigBaseConfigModel, _super);
    function ItemConfigBaseConfigModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.form = {};
        _this.baseConfigKeys = [];
        _this.baseConfig = { code: '_' };
        _this.baseConfigModel = createViewModel(observable(_this.baseConfig));
        _this.lastReceiveConfig = {};
        _this.configInited = false;
        return _this;
    }
    ItemConfigBaseConfigModel_1 = ItemConfigBaseConfigModel;
    Object.defineProperty(ItemConfigBaseConfigModel.prototype, "i", {
        get: function () {
            return this.baseConfigModel.model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfigModel.prototype, "type", {
        get: function () {
            return this.i.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfigModel.prototype, "code", {
        get: function () {
            return this.i.code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfigModel.prototype, "keyCode", {
        get: function () {
            return this.code.split('.')[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfigModel.prototype, "keyInnerCode", {
        get: function () {
            return this.keyCode !== this.code ? this.code.replace(this.keyCode + '.', '') : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfigModel.prototype, "children", {
        get: function () {
            var _this = this;
            return this.type === 'group' && Utils.isNotEmptyObject(this.i.children) ? Utils.reduce(this.i.children, function (obj, i, key) {
                var _a;
                return Object.assign(obj, (_a = {},
                    _a[key] = __assign({}, i, { code: _this.code + "." + i.code }),
                    _a));
            }, {}) : false;
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBaseConfigModel.prototype.setForm = function (form) {
        // console.log('setForm', form);
        // this.objectToDiff(this.form, form)
        // this.formStore = FormStore.registerForm(form, this, this.formStore)
        // if (!this.formStore.getConfig(this.code)) {
        //   this.formStore.setConfig(this.formStore.configList.concat({...this.baseConfig}))
        //   debugger
        // }
        this.form = form;
        // this.form = Utils.cloneDeep(form);
        // this.reaction(() => this.formSource[this.code], console.log)
    };
    ItemConfigBaseConfigModel.prototype.setFormStore = function (formStore) {
        if (formStore instanceof FormStore) {
            this.formStore = formStore;
            this.interceptProperty(this.formStore.formSource, this.keyCode, function (event) {
                // console.log(event, event.newValue, get(event.object, this.keyInnerCode), this.keyCode, this.keyInnerCode);
                return event;
            });
        }
    };
    Object.defineProperty(ItemConfigBaseConfigModel.prototype, "formSource", {
        get: function () {
            // console.log('this.formStore', this.formStore && this.formStore.formSource);
            return (this.formStore && this.formStore.lastFormSource) || this.form;
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBaseConfigModel.prototype.setBaseConfig = function (baseConfig, strict) {
        var e_1, _a;
        baseConfig = baseConfig && baseConfig.i ? baseConfig.i : baseConfig;
        if (!Utils.isEqual(this.baseConfig, baseConfig)) {
            if (this.configInited) {
                // if (this.label==='机构'){
                //   debugger
                // }
                for (var key in baseConfig) {
                    if (!Utils.isEqual(this.lastReceiveConfig[key], baseConfig[key])) {
                        this.baseConfig[key] = baseConfig[key];
                        this.lastReceiveConfig[key] = baseConfig[key];
                    }
                }
                // this.objectToDiff(this.baseConfig, baseConfig);
                return true;
            }
            // console.log('setBaseConfig', baseConfig, strict)
            this.baseConfig = baseConfig;
            this.baseConfigKeys = Object.keys(baseConfig);
            try {
                for (var _b = __values(this.baseConfigKeys.concat(['options', 'loading'])), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var name_1 = _c.value;
                    this.registerKey(baseConfig, name_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.baseConfigModel = createViewModel(baseConfig);
            this.observe(baseConfig, function (e) { });
            // console.log('initConfig change init', baseConfig, this);
            // this.objectToDiff(this.baseConfigModel.model, baseConfig)
            if (Utils.isFunction(baseConfig.refConfig)) {
                Reflect.apply(baseConfig.refConfig, this, [this]);
            }
            this.configInited = true;
            for (var key in baseConfig) {
                this.lastReceiveConfig[key] = baseConfig[key];
            }
            return this.baseConfig;
        }
        return false;
    };
    ItemConfigBaseConfigModel.prototype.getComputedValue = function (key, target, defaultValue) {
        var _this = this;
        if (target === void 0) { target = this.i; }
        try {
            var keyValue_1 = target[key];
            if (!(/(^refConfig$)|^(on|get(.*?))|((.*?)Method)$|(.*?)filter(.*?)/.test(key)) && (keyValue_1 instanceof Function)) {
                var computedValue = expr(function () { return keyValue_1(_this.formSource || {}, _this); });
                // if(this.code==="ciPolicyNo" && key==='required') {
                //   debugger
                // }
                return Utils.isNil(computedValue) ? defaultValue : computedValue;
            }
            return keyValue_1;
        }
        catch (e) {
            console.error(e);
            return undefined;
        }
    };
    ItemConfigBaseConfigModel.prototype.export = function () {
        return ItemConfigBaseConfigModel_1.export(this);
    };
    var ItemConfigBaseConfigModel_1;
    ItemConfigBaseConfigModel.export = createTransformer(function (config) {
        var e_2, _a;
        var model = {};
        try {
            for (var _b = __values(config.baseConfigKeys), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                model[key] = config[key];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        model.__isExportObject = true;
        return toJS(model);
    });
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], ItemConfigBaseConfigModel.prototype, "form", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Array)
    ], ItemConfigBaseConfigModel.prototype, "baseConfigKeys", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], ItemConfigBaseConfigModel.prototype, "baseConfig", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], ItemConfigBaseConfigModel.prototype, "baseConfigModel", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfigModel.prototype, "i", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfigModel.prototype, "type", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfigModel.prototype, "code", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfigModel.prototype, "keyCode", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfigModel.prototype, "keyInnerCode", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfigModel.prototype, "children", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBaseConfigModel.prototype, "setForm", null);
    __decorate([
        observable.ref,
        __metadata("design:type", FormStore)
    ], ItemConfigBaseConfigModel.prototype, "formStore", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [FormStore]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBaseConfigModel.prototype, "setFormStore", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfigModel.prototype, "formSource", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBaseConfigModel.prototype, "setBaseConfig", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBaseConfigModel.prototype, "getComputedValue", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ItemConfigBaseConfigModel.prototype, "export", null);
    ItemConfigBaseConfigModel = ItemConfigBaseConfigModel_1 = __decorate([
        EventStoreInject(['options-change'])
    ], ItemConfigBaseConfigModel);
    return ItemConfigBaseConfigModel;
}(CommonStore));
export { ItemConfigBaseConfigModel };
//# sourceMappingURL=ItemConfigBaseConfigModel.js.map