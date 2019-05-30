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
/* eslint-disable */
import { action, computed, observable, toJS } from 'mobx';
import { FormStore } from '../FormStore';
import { EventStoreInject } from "../EventStore";
import { ItemConfigBase2 } from './ItemConfigBase';
import { SearchStore } from '../ItemConfig/SearchStore';
import { createTransformer } from 'mobx-utils';
import get from "lodash/get";
import { OptionsStore2 } from '../SelectAndSearchStore';
import getTransform from '../ItemConfig/input/FormValueTransform';
var ItemConfig2 = /** @class */ (function (_super) {
    __extends(ItemConfig2, _super);
    function ItemConfig2(initModel, form, componentProps) {
        if (form === void 0) { form = {}; }
        if (componentProps === void 0) { componentProps = {}; }
        var _this = _super.call(this, initModel, form, componentProps) || this;
        _this.form = {};
        _this.$version = 0;
        return _this;
    }
    ItemConfig2_1 = ItemConfig2;
    ItemConfig2.setCommonTransformerPipe = function (func) {
        this.commonTransformerConfig = func;
    };
    Object.defineProperty(ItemConfig2, "commonTransformer", {
        get: function () {
            return createTransformer(this.commonTransformerConfig || function (_a) {
                var type = _a.type, multiple = _a.multiple;
                if (['select', 'search'].includes(type) && multiple) {
                    return 'group';
                }
                return ({
                    'check': 'group',
                    'checkOne': {
                        F2V: function (v) { return v === '1'; },
                        V2F: function (v) {
                            return v === true ? '1' : '0';
                        }
                    }
                })[type];
            });
        },
        enumerable: true,
        configurable: true
    });
    ItemConfig2.prototype.setSearchStore = function (searchStore) {
        this.searchStore = searchStore;
    };
    ItemConfig2.prototype.useSearchStore = function (transformer, config) {
        if (config === void 0) { config = this; }
        var store = this.searchStore || new SearchStore(config);
        this.setSearchStore(store);
        this.useOptionsStore(transformer, config);
        return store;
    };
    Object.defineProperty(ItemConfig2.prototype, "formValueTransform", {
        get: function () {
            return getTransform(this.code, this.transformer);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig2.prototype, "transformer", {
        get: function () {
            return this.i.transformer || ItemConfig2_1.commonTransformer(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig2.prototype, "form2Value", {
        get: function () {
            var filter = this.i.filter;
            return Utils.isFunctionFilter(filter, this.formValueTransform.F2V);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig2.prototype, "value2Form", {
        get: function () {
            var filterToValue = this.i.filterToValue;
            return Utils.isFunctionFilter(filterToValue, this.formValueTransform.V2F);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig2.prototype, "currentComponentValue", {
        get: function () {
            return this.form2Value(this.currentValue);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfig2.prototype.useOptionsStore = function (transformer, config) {
        if (config === void 0) { config = this; }
        var store = this.OptionsStore2 || new OptionsStore2(config, transformer);
        this.OptionsStore2 = store;
        return store;
    };
    Object.defineProperty(ItemConfig2.prototype, "keyCode", {
        get: function () {
            return this.code.split('.')[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfig2.prototype, "keyInnerCode", {
        get: function () {
            return this.keyCode !== this.code ? this.code.replace(this.keyCode + '.', '') : undefined;
        },
        enumerable: true,
        configurable: true
    });
    ItemConfig2.prototype.setFormStore = function (formStore) {
        var _this = this;
        this.formStore = formStore;
        this.interceptProperty(this.formStore.formSource, this.keyCode, function (event) {
            console.log(event, event.newValue, get(event.object, _this.keyInnerCode), _this.keyCode, _this.keyInnerCode);
            return event;
        });
    };
    Object.defineProperty(ItemConfig2.prototype, "formSource", {
        get: function () {
            // console.log('this.formStore', this.formStore && this.formStore.formSource);
            return (this.formStore && this.formStore.lastFormSource) || this.form;
        },
        enumerable: true,
        configurable: true
    });
    ItemConfig2.prototype.export = function () {
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
        model.__isExportObject = true;
        return toJS(model);
    };
    var ItemConfig2_1;
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], ItemConfig2.prototype, "form", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], ItemConfig2.prototype, "$version", void 0);
    __decorate([
        observable,
        __metadata("design:type", SearchStore)
    ], ItemConfig2.prototype, "searchStore", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [SearchStore]),
        __metadata("design:returntype", void 0)
    ], ItemConfig2.prototype, "setSearchStore", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function, ItemConfig2]),
        __metadata("design:returntype", void 0)
    ], ItemConfig2.prototype, "useSearchStore", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig2.prototype, "formValueTransform", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig2.prototype, "transformer", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig2.prototype, "form2Value", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig2.prototype, "value2Form", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig2.prototype, "currentComponentValue", null);
    __decorate([
        observable,
        __metadata("design:type", OptionsStore2)
    ], ItemConfig2.prototype, "OptionsStore2", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function, Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfig2.prototype, "useOptionsStore", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig2.prototype, "keyCode", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig2.prototype, "keyInnerCode", null);
    __decorate([
        observable.ref,
        __metadata("design:type", FormStore)
    ], ItemConfig2.prototype, "formStore", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [FormStore]),
        __metadata("design:returntype", void 0)
    ], ItemConfig2.prototype, "setFormStore", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfig2.prototype, "formSource", null);
    __decorate([
        observable,
        __metadata("design:type", Function)
    ], ItemConfig2, "commonTransformerConfig", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], ItemConfig2, "setCommonTransformerPipe", null);
    __decorate([
        computed,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [])
    ], ItemConfig2, "commonTransformer", null);
    ItemConfig2 = ItemConfig2_1 = __decorate([
        EventStoreInject(['options-change']),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], ItemConfig2);
    return ItemConfig2;
}(ItemConfigBase2));
export { ItemConfig2 };
//# sourceMappingURL=ItemConfig.js.map