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
import { autobind, readonly } from 'core-decorators';
import assign from "lodash/assign";
import reduce from "lodash/reduce";
import { action, computed, keys as getKeys, observable, ObservableMap, toJS, values } from 'mobx';
import { Utils } from "../../utils";
import { CommonStore } from '../ItemConfig/interface';
var KeyDataMapStore = /** @class */ (function (_super) {
    __extends(KeyDataMapStore, _super);
    function KeyDataMapStore(keyName, transformer) {
        var _this = _super.call(this) || this;
        _this.keyName = keyName;
        _this.sourceMap = observable.map({}, { deep: false });
        _this.targetMap = observable.map({}, { deep: false });
        _this.sourceDataSnapshot = {};
        // console.log(transformer)
        _this.register(transformer);
        return _this;
    }
    Object.defineProperty(KeyDataMapStore.prototype, "sourceData", {
        get: function () {
            // const c = toJS(this.sourceMap.toPOJO())
            // return forEach(c, (value, key) => {
            //   c[key] = toJS(value)
            // })
            return toJS(this.sourceMap.toPOJO());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyDataMapStore.prototype, "targetData", {
        get: function () {
            return toJS(this.targetMap.toJSON());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyDataMapStore.prototype, "sourceValueList", {
        get: function () {
            return toJS(values(this.sourceMap));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyDataMapStore.prototype, "keyList", {
        get: function () {
            return getKeys(this.sourceMap);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyDataMapStore.prototype, "valueList", {
        get: function () {
            return toJS(values(this.targetMap));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyDataMapStore.prototype, "itemCodeNameMap", {
        get: function () {
            return reduce(this.sourceMap, function (obj, config) {
                var _a;
                return config.nameCode ? assign(obj, (_a = {},
                    _a[config.code] = config.nameCode,
                    _a)) : obj;
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyDataMapStore.prototype, "itemCodeNameList", {
        get: function () {
            return values(this.itemCodeNameMap);
        },
        enumerable: true,
        configurable: true
    });
    KeyDataMapStore.prototype.getSourceData = function (keyValue) {
        return this.sourceMap.get(keyValue);
    };
    KeyDataMapStore.prototype.getTargetData = function (keyValue) {
        return this.targetMap.get(keyValue);
    };
    KeyDataMapStore.prototype.getConfigKey = function (config) {
        return config[this.keyName];
    };
    KeyDataMapStore.prototype.setConfigKey = function (config, keyValue) {
        return config[this.keyName] = keyValue;
    };
    KeyDataMapStore.prototype.setSourceData = function (sourceData) {
        var _this = this;
        var getKey = this.getConfigKey;
        // console.log('set', sourceData)
        this.mapToDiff(this.sourceMap, reduce(sourceData, function (object, nextConfig, key) {
            if (Utils.isNumber(key) && Utils.isNil(getKey(nextConfig))) {
                _this.setConfigKey(nextConfig, (key + ''));
            }
            var keyValue = getKey(nextConfig);
            if (Utils.isString(keyValue)) {
                var patch = {};
                patch[keyValue] = nextConfig;
                assign(object, patch);
            }
            return object;
        }, {}), this.sourceDataSnapshot);
        // console.log(this.sourceMap)
    };
    KeyDataMapStore.prototype.register = function (transformer) {
        var _this = this;
        return this.observe(this.sourceMap, function (listener) {
            // console.log(listener)
            if (listener.type === 'add') {
                _this.targetMap.set(listener.name, transformer.create(listener.newValue));
            }
            else if (listener.type === 'delete') {
                transformer.delete(_this.getTargetData(listener.name), _this.getSourceData(listener.name));
                _this.targetMap.delete(listener.name);
            }
            else {
                transformer.update(listener.newValue, _this.getTargetData(listener.name));
            }
        });
    };
    __decorate([
        observable.shallow,
        readonly,
        __metadata("design:type", ObservableMap)
    ], KeyDataMapStore.prototype, "sourceMap", void 0);
    __decorate([
        observable,
        readonly,
        __metadata("design:type", ObservableMap)
    ], KeyDataMapStore.prototype, "targetMap", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], KeyDataMapStore.prototype, "sourceData", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], KeyDataMapStore.prototype, "targetData", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], KeyDataMapStore.prototype, "sourceValueList", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], KeyDataMapStore.prototype, "keyList", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], KeyDataMapStore.prototype, "valueList", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], KeyDataMapStore.prototype, "itemCodeNameMap", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], KeyDataMapStore.prototype, "itemCodeNameList", null);
    __decorate([
        autobind,
        readonly,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Object)
    ], KeyDataMapStore.prototype, "getSourceData", null);
    __decorate([
        autobind,
        readonly,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Object)
    ], KeyDataMapStore.prototype, "getTargetData", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Object)
    ], KeyDataMapStore.prototype, "getConfigKey", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", void 0)
    ], KeyDataMapStore.prototype, "setConfigKey", null);
    __decorate([
        action.bound,
        readonly,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], KeyDataMapStore.prototype, "setSourceData", null);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], KeyDataMapStore.prototype, "register", null);
    return KeyDataMapStore;
}(CommonStore));
export { KeyDataMapStore };
//# sourceMappingURL=MapAndListStore.js.map