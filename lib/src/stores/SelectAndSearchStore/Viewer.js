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
import Utils from '../../utils';
export class SelectAndSearchViewStore extends SelectAndSearchStore {
    constructor(instance) {
        super();
        this.extendFromVueComponent = (instance, properties) => {
            this.instance = instance;
            this.$createElement = instance.$createElement;
            return extendObservable(this, properties, {}, {});
        };
        this.extendFromVueComponent(instance, {});
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
            "width": this.itemConfig.width === 'auto' ? `${15 + Utils.isStringFilter(this.shadowOption.value, '').length / 3}vw` : this.itemConfig.width
        };
    }
    get prefixDom() {
        const { prefix } = this.selectedLabelConveration;
        // console.log(this.itemConfig.label, this.selectedLabelConveration)
        return Utils.isNotEmptyString(prefix) && <el-tag size='small' slot='prefix'>{prefix}</el-tag>;
    }
    get emptyOptionsDom() {
        const { displayOptions, useEmpty, itemConfig: { multiple }, placeholder, type } = this;
        return Utils.jsxIf(useEmpty(displayOptions) && !multiple, <elOption key="unselect" label={type == 'select' ? placeholder : ''} value={null}></elOption>);
    }
    get displayOptionsDom() {
        return _.map(this.displayOptions, item => {
            const { label } = SelectAndSearchStore.getConvertLabel(item.label);
            return <elOption key={item.key} label={label} value={item.value}>{this.getOptionsDom(item)}</elOption>;
        });
    }
    get popperOptionsDom() {
        return _.concat([
            this.prefixDom,
            this.emptyOptionsDom,
        ], this.displayOptionsDom);
    }
    getOptionsDom(item) {
        const { getOptionsLabel } = (this.itemConfig || {});
        const { prefix, label, suffix } = SelectAndSearchStore.getConvertLabel(item.label);
        const isError = false; //Utils.isString(item.errorMsg);
        return (<span style={{
            color: isError ? '#f56c6c' : (item.highlight ? '#409EFF' : null),
            fontWeight: item.highlight && 700
        }}>
        {Utils.isNotEmptyString(prefix) && <el-tag disable-transitions={true} size='small'>{prefix}</el-tag>}
        {` ${_.isFunction(getOptionsLabel) ? getOptionsLabel(item) : label}`}
        {Utils.isNotEmptyString(suffix) && <el-tag type='danger' size='small'>{suffix}</el-tag>}
        {isError && <el-tag type='danger' size='small'>{item.errorMsg}</el-tag>}
      </span>);
    }
}
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
//# sourceMappingURL=Viewer.js.map