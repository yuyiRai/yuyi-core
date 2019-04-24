"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const mobx_1 = require("mobx");
const Store_1 = require("./Store");
const utils_1 = __importDefault(require("../../utils"));
const lodash_1 = require("lodash");
class SelectAndSearchViewStore extends Store_1.SelectAndSearchStore {
    constructor() {
        super(...arguments);
        this.extendFromVueComponent = (properties) => {
            return mobx_1.extendObservable(this, properties, {}, {});
        };
    }
    get classNames() {
        const { prefix } = this.selectedLabelConveration;
        return {
            [`input-prefix-tag-text-${prefix.length}`]: prefix.length > 0,
            'line-height-36': this.itemConfig.multiple,
        };
    }
    get style() {
        return {
            "width": this.itemConfig.width === 'auto' ? `${15 + utils_1.default.isStringFilter(this.shadowOption.value, '').length / 3}vw` : this.itemConfig.width
        };
    }
    get prefixDom() {
        const { prefix } = this.selectedLabelConveration;
        // console.log(this.itemConfig.label, this.selectedLabelConveration)
        return utils_1.default.isNotEmptyString(prefix) && this.tagComplier(this.selectedLabelConveration);
    }
    get emptyOptionsDom() {
        const { displayOptions, useEmpty, itemConfig: { multiple }, placeholder, type } = this;
        return utils_1.default.jsxIf(useEmpty(displayOptions) && !multiple, this.optionComplier({ key: 'unselect', label: type == 'select' ? placeholder : '', value: null }));
    }
    get displayOptionsDom() {
        return lodash_1.map(this.displayOptions, item => {
            const { label } = Store_1.SelectAndSearchStore.getConvertLabel(item.label);
            return this.optionComplier({ key: item.key, label, value: item.value, data: item });
        });
    }
    get popperOptionsDom() {
        return lodash_1.concat([
            this.prefixDom,
            this.emptyOptionsDom,
        ], this.displayOptionsDom);
    }
}
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchViewStore.prototype, "classNames", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchViewStore.prototype, "style", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchViewStore.prototype, "prefixDom", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchViewStore.prototype, "emptyOptionsDom", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchViewStore.prototype, "displayOptionsDom", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], SelectAndSearchViewStore.prototype, "popperOptionsDom", null);
exports.SelectAndSearchViewStore = SelectAndSearchViewStore;
//# sourceMappingURL=Viewer.js.map