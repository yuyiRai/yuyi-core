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
import { default as getKeys } from "lodash/keys";
import reduce from "lodash/reduce";
import values from "lodash/values";
import { action, computed, observable, ObservableMap, toJS } from 'mobx';
import { ItemConfig } from "../../../stores";
import { CommonStore } from '../Interface/FormItem';
import { FormStoreCore } from './FormStoreCore';
var ItemConfigGroupStore = /** @class */ (function (_super) {
    __extends(ItemConfigGroupStore, _super);
    function ItemConfigGroupStore(formStore) {
        var _this = _super.call(this) || this;
        _this.configSource = observable.map({}, { deep: false });
        _this.itemConfigMap = observable.map({}, { deep: false });
        _this.store = formStore;
        _this.observe(_this.configSource, function (listener) {
            console.log('on-base-config-change', listener, _this);
            if (listener.type === 'add') {
                _this.itemConfigMap.set(listener.name, new ItemConfig(listener.newValue, _this.store.formSource, _this, _this.store).log('on-base-config-change'));
            }
            else if (listener.type === 'delete') {
                _this.getItemConfig(listener.name).destory();
                _this.itemConfigMap.delete(listener.name);
            }
            else {
                _this.getItemConfig(listener.name).setConfig(listener.newValue);
            }
        });
        return _this;
    }
    Object.defineProperty(ItemConfigGroupStore.prototype, "config", {
        get: function () {
            return toJS(Array.from(this.configSource.values()));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroupStore.prototype, "configList", {
        get: function () {
            return values(this.configSource.toJSON());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroupStore.prototype, "itemConfigConstructorMap", {
        get: function () {
            return this.config.reduce(function (obj, config) {
                var _a;
                return config.code ? Object.assign(obj, (_a = {},
                    _a[config.code] = config,
                    _a)) : obj;
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroupStore.prototype, "itemCodeList", {
        get: function () {
            return getKeys(this.itemConfigConstructorMap);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigGroupStore.prototype, "itemCodeNameMap", {
        get: function () {
            return this.config.reduce(function (obj, config) {
                var _a;
                return config.nameCode ? Object.assign(obj, (_a = {},
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
        return this.configSource.get(code);
    };
    ItemConfigGroupStore.prototype.getItemConfig = function (code) {
        return this.itemConfigMap.get(code);
    };
    ItemConfigGroupStore.prototype.setConfigSource = function (configSource) {
        console.log('setConfig', configSource, this, this.store);
        this.mapToDiff(this.configSource, reduce(configSource, function (object, config, key) {
            var _a;
            return (Utils.isNumber(key) || Utils.isEqual(key, config.code)) ? Object.assign(object, (_a = {}, _a[config.code] = config, _a)) : object;
        }, {}));
    };
    __decorate([
        observable,
        __metadata("design:type", FormStoreCore)
    ], ItemConfigGroupStore.prototype, "store", void 0);
    __decorate([
        observable.shallow,
        __metadata("design:type", ObservableMap)
    ], ItemConfigGroupStore.prototype, "configSource", void 0);
    __decorate([
        observable,
        __metadata("design:type", ObservableMap)
    ], ItemConfigGroupStore.prototype, "itemConfigMap", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigGroupStore.prototype, "config", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
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
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfigGroupStore.prototype, "setConfigSource", null);
    return ItemConfigGroupStore;
}(CommonStore));
export { ItemConfigGroupStore };
//# sourceMappingURL=ItemConfigGroupStore.js.map