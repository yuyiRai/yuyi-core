var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* eslint-disable */
import { observable, computed, action } from 'mobx';
import Utils from '../../utils';
var DisplayConfig = /** @class */ (function () {
    function DisplayConfig() {
    }
    DisplayConfig.prototype.init = function (itemConfig, props) {
        this.itemConfig = itemConfig;
        this.props = props;
        return this;
    };
    Object.defineProperty(DisplayConfig.prototype, "isInlineMessage", {
        get: function () {
            return this.itemConfig.inline || this.itemConfig.name === this.itemConfig.code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "isShowMessage", {
        get: function () {
            return !this.itemConfig.isViewOnly && ![this.itemConfig.showMessage, this.props.showMessage].some(function (i) { return i === false; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "textAlign", {
        get: function () {
            return Utils.isStringFilter(this.itemConfig.textAlign, this.props.textAlign);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "isDisabled", {
        get: function () {
            return this.props.disabled || this.itemConfig.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "showSize", {
        get: function () {
            return this.props.size || this.itemConfig.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "label", {
        get: function () {
            var _a = this.itemConfig, useLabel = _a.useLabel, label = _a.label;
            if (useLabel == false || label == undefined)
                return undefined;
            return label + (this.itemConfig.isViewOnly ? ":" : "");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "coltal", {
        get: function () {
            return 24 / (this.props.columnCount || 3);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "colSpan", {
        get: function () {
            return Math.round(((this.itemConfig.col || 1) + (this.itemConfig.offectRight || 0) / 8) * this.coltal);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "formItemStyle", {
        get: function () {
            // trace()
            var _a = this, colSpan = _a.colSpan, itemConfig = _a.itemConfig, viewSize = _a.showSize, textAlign = _a.textAlign;
            return {
                width: (colSpan - (itemConfig.offectRight)) / colSpan * 100 + "%",
                height: "" + itemConfig.height,
                marginBottom: viewSize == "mini" ? 0 : undefined,
                textAlign: textAlign
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "prefix", {
        get: function () {
            return this.itemConfig.prefix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "suffix", {
        get: function () {
            return this.itemConfig.suffix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DisplayConfig.prototype, "useColumn", {
        get: function () {
            return this.props.useColumn;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], DisplayConfig.prototype, "itemConfig", void 0);
    __decorate([
        observable.ref,
        __metadata("design:type", Object)
    ], DisplayConfig.prototype, "props", void 0);
    __decorate([
        action,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], DisplayConfig.prototype, "init", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "isInlineMessage", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "isShowMessage", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "textAlign", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "isDisabled", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "showSize", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "label", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "coltal", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "colSpan", null);
    __decorate([
        computed.struct,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "formItemStyle", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "prefix", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "suffix", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], DisplayConfig.prototype, "useColumn", null);
    return DisplayConfig;
}());
export { DisplayConfig };
//# sourceMappingURL=ItemDisplayConfig.js.map