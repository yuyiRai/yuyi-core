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
/* eslint-disable */
import { computed, extendObservable } from 'mobx';
import { SelectAndSearchStore } from './Store';
import { Utils } from "../../utils";
import map from "lodash/map";
import concat from "lodash/concat";
var SelectAndSearchViewStore = /** @class */ (function (_super) {
    __extends(SelectAndSearchViewStore, _super);
    function SelectAndSearchViewStore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.extendFromVueComponent = function (properties) {
            return extendObservable(_this, properties, {}, {});
        };
        return _this;
    }
    Object.defineProperty(SelectAndSearchViewStore.prototype, "classNames", {
        get: function () {
            var _a;
            var prefix = this.selectedLabelConveration.prefix;
            return _a = {},
                _a["input-prefix-tag-text-" + prefix.length] = prefix.length > 0,
                _a['line-height-36'] = this.itemConfig.multiple,
                _a;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchViewStore.prototype, "style", {
        get: function () {
            return {
                "width": this.itemConfig.width === 'auto' ? 15 + Utils.isStringFilter(this.shadowOption.value, '').length / 3 + "vw" : this.itemConfig.width
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchViewStore.prototype, "prefixDom", {
        get: function () {
            var prefix = this.selectedLabelConveration.prefix;
            // console.log(this.itemConfig.label, this.selectedLabelConveration)
            return Utils.isNotEmptyString(prefix) && this.tagComplier(this.selectedLabelConveration);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchViewStore.prototype, "emptyOptionsDom", {
        get: function () {
            var _a = this, displayOptions = _a.displayOptions, useEmpty = _a.useEmpty, multiple = _a.itemConfig.multiple, placeholder = _a.placeholder, type = _a.type;
            return Utils.jsxIf(useEmpty(displayOptions) && !multiple, this.optionComplier({ key: 'unselect', label: type == 'select' ? placeholder : '', value: null }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchViewStore.prototype, "displayOptionsDom", {
        get: function () {
            var _this = this;
            return map(this.displayOptions, function (item) {
                var label = SelectAndSearchStore.getConvertLabel(item.label).label;
                return _this.optionComplier({ key: item.key, label: label, value: item.value, data: item });
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectAndSearchViewStore.prototype, "popperOptionsDom", {
        get: function () {
            return concat([
                this.prefixDom,
                this.emptyOptionsDom,
            ], this.displayOptionsDom);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SelectAndSearchViewStore.prototype, "classNames", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SelectAndSearchViewStore.prototype, "style", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SelectAndSearchViewStore.prototype, "prefixDom", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SelectAndSearchViewStore.prototype, "emptyOptionsDom", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SelectAndSearchViewStore.prototype, "displayOptionsDom", null);
    __decorate([
        computed,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], SelectAndSearchViewStore.prototype, "popperOptionsDom", null);
    return SelectAndSearchViewStore;
}(SelectAndSearchStore));
export { SelectAndSearchViewStore };
//# sourceMappingURL=Viewer.js.map