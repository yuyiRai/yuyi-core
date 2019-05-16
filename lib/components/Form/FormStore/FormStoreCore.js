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
import { autobind } from 'core-decorators';
import { action, computed, extendObservable, observable, ObservableMap, runInAction } from 'mobx';
import { EventStoreInject } from "../../../stores/EventStore";
import { isNotEmptyArray } from "../../../utils";
import { GFormStore } from './GFormStore';
import { ItemConfigGroupStore } from './ItemConfigGroupStore';
var FormStoreCore = /** @class */ (function (_super) {
    __extends(FormStoreCore, _super);
    function FormStoreCore(config) {
        var _this = _super.call(this) || this;
        _this.configStore = new ItemConfigGroupStore(_this);
        _this.formMap = observable.map({}, { deep: false });
        _this.formSource = {};
        _this.formSourceTrack = [];
        _this.formItemStores = {};
        _this.errorTack = [];
        _this.errorGroup = observable.map({}, { deep: false });
        _this.configStore.setConfigSource(config || []);
        return _this;
    }
    Object.defineProperty(FormStoreCore.prototype, "lastFormSource", {
        get: function () {
            return this.formSourceTrack[this.formSourceTrack.length - 1] || this.formSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormStoreCore.prototype, "form", {
        get: function () {
            return extendObservable({}, this.formMap.toPOJO());
        },
        enumerable: true,
        configurable: true
    });
    FormStoreCore.prototype.registerItemStore = function (code, Constructor) {
        // console.log('registerForm', form)
        // debugger
        var This = this;
        this.formItemStores[code] = this.formItemStores[code] || new Constructor(This, code);
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
        observable.shallow,
        __metadata("design:type", ObservableMap)
    ], FormStoreCore.prototype, "formMap", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], FormStoreCore.prototype, "formSource", void 0);
    __decorate([
        observable,
        __metadata("design:type", Array)
    ], FormStoreCore.prototype, "formSourceTrack", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStoreCore.prototype, "lastFormSource", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], FormStoreCore.prototype, "form", null);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], FormStoreCore.prototype, "formItemStores", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
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