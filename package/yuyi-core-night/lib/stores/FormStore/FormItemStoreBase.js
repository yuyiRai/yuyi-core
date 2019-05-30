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
import { ItemConfig } from "..";
import { computed, observable } from 'mobx';
import { CommonStore } from "../ItemConfig/interface";
import { autobind } from 'core-decorators';
var FormItemStoreCore = /** @class */ (function (_super) {
    __extends(FormItemStoreCore, _super);
    function FormItemStoreCore(formStore, code) {
        var _this = _super.call(this) || this;
        _this.code = code;
        _this.setFormStore(formStore);
        return _this;
    }
    Object.defineProperty(FormItemStoreCore.prototype, "itemConfig", {
        get: function () {
            return this.formStore.configStore.getItemConfig(this.code);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormItemStoreCore.prototype, "hasError", {
        get: function () {
            return this.formStore.hasErrors(this.code);
        },
        enumerable: true,
        configurable: true
    });
    FormItemStoreCore.prototype.setFormStore = function (formStore) {
        this.formStore = formStore;
    };
    __decorate([
        observable.ref,
        __metadata("design:type", String)
    ], FormItemStoreCore.prototype, "code", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], FormItemStoreCore.prototype, "formStore", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", ItemConfig),
        __metadata("design:paramtypes", [])
    ], FormItemStoreCore.prototype, "itemConfig", null);
    __decorate([
        computed,
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], FormItemStoreCore.prototype, "hasError", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormItemStoreCore.prototype, "setFormStore", null);
    return FormItemStoreCore;
}(CommonStore));
export { FormItemStoreCore };
//# sourceMappingURL=FormItemStoreBase.js.map