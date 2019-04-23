/* eslint-disable */
import { computed, extendObservable, IKeyValueMap } from 'mobx';
import { SelectAndSearchStore } from './Store';
import Utils from '../../utils';

export class SelectAndSearchViewStore extends SelectAndSearchStore {
  instance;
  constructor(instance) {
    super()
    this.extendFromVueComponent(instance, {})
  }
  @computed get classNames() {
    const { prefix } = this.selectedLabelConveration
    return {
      [`input-prefix-tag-text-${prefix.length}`]: prefix.length > 0,
      'line-height-36': this.itemConfig.multiple,
    }
  }

  @computed get style() {
    return {
      "width": this.itemConfig.width === 'auto' ? `${15 + Utils.isStringFilter(this.shadowOption.value, '').length/3}vw` : this.itemConfig.width
    }
  }

  extendFromVueComponent = (instance, properties) => {
    this.instance = instance
    this.$createElement = instance.$createElement
    return extendObservable(this, properties, {}, {})
  }

  @computed get prefixDom() {
    const { prefix } = this.selectedLabelConveration
    // console.log(this.itemConfig.label, this.selectedLabelConveration)
    return Utils.isNotEmptyString(prefix) && <el-tag size='small' slot='prefix'>{prefix}</el-tag>
  }
  @computed get emptyOptionsDom() {
    const { 
      displayOptions, useEmpty, 
      itemConfig: { multiple }, 
      placeholder, type 
    } = this;
    return Utils.jsxIf(useEmpty(displayOptions) && !multiple, <elOption key="unselect" label={type == 'select' ? placeholder : ''} value={null}></elOption>)
  }
  @computed get displayOptionsDom() {
    return _.map(this.displayOptions, item => {
      const { label } = SelectAndSearchStore.getConvertLabel(item.label)
      return <elOption key={item.key} label={label} value={item.value}>{this.getOptionsDom(item)}</elOption>
    })
  }
  @computed get popperOptionsDom() {
    return _.concat([
        this.prefixDom,
        this.emptyOptionsDom,
      ], 
      this.displayOptionsDom
    )
  }
  getOptionsDom(item) {
    const { getOptionsLabel } = (this.itemConfig || {})
    const { prefix, label, suffix } = SelectAndSearchStore.getConvertLabel(item.label)
    const isError = false //Utils.isString(item.errorMsg);
    return (
      <span style={{
        color: isError ? '#f56c6c' : (item.highlight ? '#409EFF' : null),
        fontWeight: item.highlight && 700
      }}>
        {Utils.isNotEmptyString(prefix) && <el-tag disable-transitions={true} size='small'>{prefix}</el-tag>}
        {` ${_.isFunction(getOptionsLabel) ? getOptionsLabel(item) : label}`}
        {Utils.isNotEmptyString(suffix) && <el-tag type='danger' size='small'>{suffix}</el-tag>}
        {isError && <el-tag type='danger' size='small'>{item.errorMsg}</el-tag>}
      </span>
    )
  }
}

