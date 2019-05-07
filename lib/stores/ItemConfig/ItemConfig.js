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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
var mobx_1 = require("mobx");
var FormStore_1 = require("../../components/Form/FormStore");
var EventStore_1 = require("../../utils/EventStore");
var ItemConfigBase_1 = require("./ItemConfigBase");
var SearchStore_1 = require("./SearchStore");
var lodash_1 = require("lodash");
var SelectAndSearchStore_1 = require("../SelectAndSearchStore");
var FormValueTransform_1 = __importDefault(require("./input/FormValueTransform"));
var ItemConfig = /** @class */ (function (_super) {
    __extends(ItemConfig, _super);
    function ItemConfig(initModel, form, componentProps) {
        if (form === void 0) { form = {}; }
        if (componentProps === void 0) { componentProps = {}; }
        var _this = _super.call(this, initModel, form, componentProps) || this;
        _this.form = {};
        _this.$version = 0;
        return _this;
    }
    ItemConfig.prototype.setSearchStore = function (searchStore) {
        this.searchStore = searchStore;
    };
    ItemConfig.prototype.useSearchStore = function (config) {
        if (config === void 0) { config = this; }
        var store = new SearchStore_1.SearchStore(config);
        this.setSearchStore(store);
        return store;
    };
    Object.defineProperty(ItemConfig.prototype, "formValueTransform", {
        get: function () {
            var _a = this.i, transformer = _a.transformer, type = _a.type;
            return Utils.isObjectFilter(transformer, FormValueTransform_1.default(Utils.isNotEmptyStringFilter(transformer, type)));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "form2Value", {
        get: function () {
            var filter = this.i.filter;
            return Utils.isFunctionFilter(filter, this.formValueTransform.F2V);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "value2Form", {
        get: function () {
            var filterToValue = this.i.filterToValue;
            return Utils.isFunctionFilter(filterToValue, this.formValueTransform.V2F);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "currentComponentValue", {
        get: function () {
            return this.form2Value(this.currentValue);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfig.prototype.useOptionsStore = function (transformer, config) {
        if (config === void 0) { config = this; }
        var store = new SelectAndSearchStore_1.OptionsStore(config, transformer);
        this.optionsStore = store;
        return store;
    };
    Object.defineProperty(ItemConfig.prototype, "keyCode", {
        get: function () {
            return this.code.split('.')[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig.prototype, "keyInnerCode", {
        get: function () {
            return this.keyCode !== this.code ? this.code.replace(this.keyCode + '.', '') : undefined;
        },
        enumerable: true,
        configurable: true
    });
    ItemConfig.prototype.setFormStore = function (formStore) {
        var _this = this;
        this.formStore = formStore;
        this.interceptProperty(this.formStore.formSource, this.keyCode, function (event) {
            console.log(event, event.newValue, lodash_1.get(event.object, _this.keyInnerCode), _this.keyCode, _this.keyInnerCode);
            return event;
        });
    };
    Object.defineProperty(ItemConfig.prototype, "formSource", {
        get: function () {
            // console.log('this.formStore', this.formStore && this.formStore.formSource);
            return (this.formStore && this.formStore.lastFormSource) || this.form;
        },
        enumerable: true,
        configurable: true
    });
    ItemConfig.prototype.export = function () {
        var e_1, _a;
        var model = {};
        try {
            for (var _b = __values(this.iKeys), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                model[key] = this[key];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return mobx_1.toJS(model);
    };
    __decorate([
        mobx_1.observable.ref,
        __metadata("design:type", Object)
    ], ItemConfig.prototype, "form", void 0);
    __decorate([
        mobx_1.observable,
        __metadata("design:type", Object)
    ], ItemConfig.prototype, "$version", void 0);
    __decorate([
        mobx_1.observable,
        __metadata("design:type", SearchStore_1.SearchStore)
    ], ItemConfig.prototype, "searchStore", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [SearchStore_1.SearchStore]),
        __metadata("design:returntype", void 0)
    ], ItemConfig.prototype, "setSearchStore", null);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfig.prototype, "useSearchStore", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "formValueTransform", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "form2Value", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "value2Form", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "currentComponentValue", null);
    __decorate([
        mobx_1.observable,
        __metadata("design:type", SelectAndSearchStore_1.OptionsStore)
    ], ItemConfig.prototype, "optionsStore", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function, Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfig.prototype, "useOptionsStore", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "keyCode", null);
    __decorate([
        mobx_1.computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "keyInnerCode", null);
    __decorate([
        mobx_1.observable.ref,
        __metadata("design:type", FormStore_1.FormStore)
    ], ItemConfig.prototype, "formStore", void 0);
    __decorate([
        mobx_1.action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [FormStore_1.FormStore]),
        __metadata("design:returntype", void 0)
    ], ItemConfig.prototype, "setFormStore", null);
    __decorate([
        mobx_1.computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig.prototype, "formSource", null);
    ItemConfig = __decorate([
        EventStore_1.EventStoreInject(['options-change']),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], ItemConfig);
    return ItemConfig;
}(ItemConfigBase_1.ItemConfigBase));
exports.ItemConfig = ItemConfig;
