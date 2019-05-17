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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { autobind } from 'core-decorators';
import { action, computed, observable } from 'mobx';
import { Utils } from '../../utils/Utils';
import { ItemConfigBaseConfigModel } from './ItemConfigBaseConfigModel';
import { RuleStore } from './RuleConfigStore';
var ItemConfigBaseConfig = /** @class */ (function (_super) {
    __extends(ItemConfigBaseConfig, _super);
    function ItemConfigBaseConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.componentProps = {};
        _this.ruleConfig = new RuleStore(_this);
        _this.childrenConfig = {};
        return _this;
    }
    Object.defineProperty(ItemConfigBaseConfig.prototype, "code", {
        get: function () {
            return this.i.code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "label", {
        get: function () {
            return this.i.label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "type", {
        get: function () {
            return this.i.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "placeholder", {
        get: function () {
            return "\u8BF7" + (['search', 'select', 'selectTree', 'cascader'].includes(this.type) ? '选择' : '输入') + this.label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "nameCode", {
        get: function () {
            return this.i.nameCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "viewOnly", {
        get: function () {
            return this.getComputedValue('viewOnly') ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "required", {
        get: function () {
            return this.getComputedValue('required') ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "hidden", {
        get: function () {
            return this.getComputedValue('hidden') ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "disabled", {
        get: function () {
            return this.getComputedValue('disabled') ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "isViewOnly", {
        get: function () {
            // console.log(this.props)
            return this.viewOnly || (this.componentProps && (this.componentProps.viewOnly || this.componentProps.formStatus === 'view'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "rules", {
        get: function () {
            return this.isViewOnly ? [] : this.ruleConfig.getRuleList(this.i);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBaseConfig.prototype.setRules = function (v) {
        if (this.i.rule !== v)
            this.baseConfig.rule = v;
    };
    Object.defineProperty(ItemConfigBaseConfig.prototype, "options", {
        get: function () {
            return this.getOptions();
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBaseConfig.prototype.getOptions = function () {
        var a = Utils.isArrayFilter(this.i.options, this.getComputedValue('options')) || [];
        // if(this.code==='info.trree3')
        //   debugger
        // this.label === '归属车辆' && console.log('伤者类型 get options', Utils.isArrayFilter(this.$version, this.getComputedValue('options'), []))
        return a;
    };
    ItemConfigBaseConfig.prototype.setOptions = function (v) {
        if (!Utils.likeArray(this.options, v)) {
            // if(this.code==='search3')
            //   console.log('options resolve', this.i, v);
            this.baseConfig.options = v;
        }
    };
    Object.defineProperty(ItemConfigBaseConfig.prototype, "allConfig", {
        get: function () {
            return __assign({ default: this }, this.childrenConfig);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBaseConfig.prototype.setParentConfig = function (parentConfig) {
        this.parentConfig = parentConfig;
    };
    Object.defineProperty(ItemConfigBaseConfig.prototype, "_loading", {
        get: function () {
            return !this.configInited || (this.getComputedValue('loading') ? true : false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "loading", {
        get: function () {
            return Utils.reduce(this.allConfig, function (arr, config, key) {
                return __spread(arr, [config._loading]);
            }, []).includes(true);
        },
        enumerable: true,
        configurable: true
    });
    ItemConfigBaseConfig.prototype.setLoading = function (v, source) {
        // debugger
        // if(this.code==='info.trree3' && source==='toSearch') {
        // debugger
        // }
        // console.log('loading update', this.code, v, source, this);
        this.baseConfig.loading = v;
    };
    Object.defineProperty(ItemConfigBaseConfig.prototype, "loadData", {
        get: function () {
            return this.i.loadData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemConfigBaseConfig.prototype, "loadDataDeep", {
        get: function () {
            return Math.max(Utils.isNumberFilter(this.i.loadDataDeep) || 3, 2);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], ItemConfigBaseConfig.prototype, "componentProps", void 0);
    __decorate([
        observable,
        __metadata("design:type", RuleStore)
    ], ItemConfigBaseConfig.prototype, "ruleConfig", void 0);
    __decorate([
        computed.struct,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "code", null);
    __decorate([
        computed.struct,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "label", null);
    __decorate([
        computed.struct,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "type", null);
    __decorate([
        computed.struct,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "placeholder", null);
    __decorate([
        computed.struct,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "nameCode", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "viewOnly", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "required", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "hidden", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "disabled", null);
    __decorate([
        computed,
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "isViewOnly", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "rules", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBaseConfig.prototype, "setRules", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "options", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Array)
    ], ItemConfigBaseConfig.prototype, "getOptions", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBaseConfig.prototype, "setOptions", null);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], ItemConfigBaseConfig.prototype, "childrenConfig", void 0);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "allConfig", null);
    __decorate([
        observable,
        __metadata("design:type", ItemConfigBaseConfig)
    ], ItemConfigBaseConfig.prototype, "parentConfig", void 0);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [ItemConfigBaseConfig]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBaseConfig.prototype, "setParentConfig", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "_loading", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "loading", null);
    __decorate([
        action.bound,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean, String]),
        __metadata("design:returntype", void 0)
    ], ItemConfigBaseConfig.prototype, "setLoading", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "loadData", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], ItemConfigBaseConfig.prototype, "loadDataDeep", null);
    return ItemConfigBaseConfig;
}(ItemConfigBaseConfigModel));
export { ItemConfigBaseConfig };
//# sourceMappingURL=ItemConfigBaseConfig.js.map