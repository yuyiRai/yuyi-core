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
import { autobind } from 'core-decorators';
import { action, computed, observable, ObservableMap, runInAction } from 'mobx';
import { EventStoreInject } from "../EventStore";
import unset from "lodash/unset";
import { isNotEmptyArray } from "../../utils";
import { GFormStore } from './GFormStore';
import { Utils } from "../../utils";
import { ItemConfigGroupStore } from './ItemConfigGroupStore';
import produce from 'immer';
var FormStoreCore = /** @class */ (function (_super) {
    __extends(FormStoreCore, _super);
    function FormStoreCore(config) {
        var _this = _super.call(this) || this;
        _this.configStore = new ItemConfigGroupStore(_this);
        _this.formMap = observable.map({}, { deep: false });
        _this.lastFormSource = {};
        _this.formSource = {};
        _this.formItemStores = {};
        _this.errorTack = [];
        _this.errorGroup = observable.map({}, { deep: false });
        _this.setConfig(config);
        _this.observe(_this.formMap, function (change) {
            // console.log('change', change)
            if (change.type === 'update' || change.type === 'add')
                _this.formSource[change.name] = change.newValue;
            if (change.type === 'delete')
                unset(_this.formSource, change.name);
        });
        return _this;
    }
    FormStoreCore.prototype.clearValidate = function () {
        this.errorGroup.clear();
    };
    Object.defineProperty(FormStoreCore.prototype, "allFormMap", {
        get: function () {
            return GFormStore.formMap;
        },
        enumerable: true,
        configurable: true
    });
    FormStoreCore.prototype.setConfig = function (config) {
        this.configStore.setConfigSource(config);
    };
    FormStoreCore.prototype.setForm = function (formSource) {
        var _this = this;
        this.lastFormSource = produce(this.lastFormSource, function (cache) {
            _this.mapToDiff(_this.formMap, formSource, cache);
        });
        this.clearValidate();
    };
    FormStoreCore.prototype.replaceForm = function (formMap) {
        this.formMap = formMap;
    };
    FormStoreCore.prototype.registerFormKey = function (target, deep) {
        var e_1, _a;
        var _this = this;
        if (deep === void 0) { deep = false; }
        try {
            for (var _b = __values(this.configStore.itemCodeList), _c = _b.next(); !_c.done; _c = _b.next()) {
                var code = _c.value;
                this.registerKey(target, code, deep);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var _loop_1 = function (code) {
            var nameCode = this_1.configStore.itemCodeNameMap[code];
            this_1.registerGet(target, nameCode, function () {
                return _this.getValueWithName(code, nameCode);
            });
        };
        var this_1 = this;
        for (var code in this.configStore.itemCodeNameMap) {
            _loop_1(code);
        }
        return;
    };
    FormStoreCore.prototype.getValueWithName = function (code, nameCode) {
        var itemConfig = this.configStore.getItemConfig(code);
        var optionsStore = itemConfig.optionsStore;
        // debugger
        if (optionsStore && Utils.isNotEmptyString(nameCode) && nameCode !== code) {
            return optionsStore.selectedLablesStr;
        }
        return undefined;
    };
    FormStoreCore.prototype.registerItemStore = function (code, init) {
        // console.log('registerForm', form)
        // debugger
        this.formItemStores[code] = this.formItemStores[code] || init();
        // this.registerForm(this.formSource, code, this.formItemStores[code].itemConfig)
        return this.formItemStores[code];
    };
    FormStoreCore.prototype.onItemChange = function (callback) {
        this.$on('onItemChange', callback, this);
    };
    FormStoreCore.prototype.onItemChangeEmit = function (code, value) {
        this.$emit('onItemChange', code, value);
    };
    Object.defineProperty(FormStoreCore.prototype, "errors", {
        get: function () { return this.errorGroup.toPOJO(); },
        enumerable: true,
        configurable: true
    });
    FormStoreCore.prototype.getErrors = function (itemKey) { return this.errorGroup.get(itemKey); };
    FormStoreCore.prototype.hasErrors = function (itemKey) { return this.errorGroup.has(itemKey); };
    FormStoreCore.prototype.updateError = function (itemKey, errors) {
        var _this = this;
        var nextError = isNotEmptyArray(errors) ? errors : null;
        if (!Utils.isEqual(this.errorGroup.get(itemKey), nextError, true)) {
            runInAction(function () { return nextError ? _this.errorGroup.set(itemKey, nextError) : _this.errorGroup.delete(itemKey); });
        }
    };
    __decorate([
        observable,
        __metadata("design:type", ItemConfigGroupStore)
    ], FormStoreCore.prototype, "configStore", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "clearValidate", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStoreCore.prototype, "allFormMap", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "setConfig", null);
    __decorate([
        observable.shallow,
        __metadata("design:type", ObservableMap)
    ], FormStoreCore.prototype, "formMap", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], FormStoreCore.prototype, "lastFormSource", void 0);
    __decorate([
        observable.struct,
        __metadata("design:type", Object)
    ], FormStoreCore.prototype, "formSource", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "setForm", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [ObservableMap]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "replaceForm", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "registerFormKey", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "getValueWithName", null);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], FormStoreCore.prototype, "formItemStores", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Function]),
        __metadata("design:returntype", Object)
    ], FormStoreCore.prototype, "registerItemStore", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "onItemChange", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "onItemChangeEmit", null);
    __decorate([
        observable.ref,
        __metadata("design:type", Array)
    ], FormStoreCore.prototype, "errorTack", void 0);
    __decorate([
        observable.shallow,
        __metadata("design:type", ObservableMap)
    ], FormStoreCore.prototype, "errorGroup", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStoreCore.prototype, "errors", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "getErrors", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "hasErrors", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Array]),
        __metadata("design:returntype", void 0)
    ], FormStoreCore.prototype, "updateError", null);
    FormStoreCore = __decorate([
        EventStoreInject(['onItemChange']),
        __metadata("design:paramtypes", [Object])
    ], FormStoreCore);
    return FormStoreCore;
}(GFormStore));
export { FormStoreCore };
//# sourceMappingURL=FormStoreCore.js.map