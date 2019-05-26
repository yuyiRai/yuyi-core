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
import assign from "lodash/assign";
import reduce from "lodash/reduce";
import values from "lodash/values";
import { Memoize } from 'lodash-decorators';
import { action, computed, observable } from 'mobx';
import { ItemConfig } from "../../../stores";
import { KeyDataMapStore } from "../../../stores/ListStore/MapAndListStore";
import { CommonStore, FormModel, IFormItemConstructor } from "../../../stores/ItemConfig/interface";
import { FormStoreCore } from './FormStoreCore';
var ItemConfigGroupStore = /** @class */ (function (_super) {
    __extends(ItemConfigGroupStore, _super);
    function ItemConfigGroupStore(formStore) {
        var _this = _super.call(this) || this;
        _this.store = formStore;
        _this.configSourceMap = new KeyDataMapStore('code', {
            create: function (config) {
                return new ItemConfig(config, _this.store.formSource, _this, _this.store);
            },
            delete: function (itemConfig) {
                itemConfig.destory();
            },
            update: function (config, itemConfig) {
                itemConfig.setConfig(config);
                return itemConfig;
            }
        });
        return _this;
    }
    ItemConfigGroupStore.prototype.setConfigSource = function (configSource) {
        this.configSourceMap.setSourceData(configSource);
    };
    Object.defineProperty(ItemConfigGroupStore.prototype, "itemConfigGroup", {
        get: function () {
            return this.configSourceMap.targetData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroupStore.prototype, "configList", {
        get: function () {
            return this.configSourceMap.sourceValueList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroupStore.prototype, "itemConfigConstructorMap", {
        get: function () {
            return this.configSourceMap.sourceData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroupStore.prototype, "itemCodeList", {
        get: function () {
            return this.configSourceMap.keyList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroupStore.prototype, "itemCodeNameMap", {
        get: function () {
            return reduce(this.configSourceMap.sourceData, function (obj, config) {
                var _a;
                return config.nameCode ? assign(obj, (_a = {},
                    _a[config.code] = config.nameCode,
                    _a)) : obj;
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroupStore.prototype, "itemCodeNameList", {
        get: function () {
            return values(this.itemCodeNameMap);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigGroupStore.prototype.getConfig = function (code) {
        return this.configSourceMap.getSourceData(code);
    };
    ItemConfigGroupStore.prototype.getItemConfig = function (code) {
        return this.configSourceMap.getTargetData(code);
    };
    __decorate([
        observable,
        __metadata("design:type", KeyDataMapStore)
    ], ItemConfigGroupStore.prototype, "configSourceMap", void 0);
    __decorate([
        observable,
        __metadata("design:type", FormStoreCore)
    ], ItemConfigGroupStore.prototype, "store", void 0);
    __decorate([
        Memoize,
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfigGroupStore.prototype, "setConfigSource", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroupStore.prototype, "itemConfigGroup", null);
    __decorate([
        computed,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroupStore.prototype, "configList", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroupStore.prototype, "itemConfigConstructorMap", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroupStore.prototype, "itemCodeList", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroupStore.prototype, "itemCodeNameMap", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroupStore.prototype, "itemCodeNameList", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], ItemConfigGroupStore.prototype, "getConfig", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], ItemConfigGroupStore.prototype, "getItemConfig", null);
    return ItemConfigGroupStore;
}(CommonStore));
export { ItemConfigGroupStore };
//# sourceMappingURL=ItemConfigGroupStore.js.map