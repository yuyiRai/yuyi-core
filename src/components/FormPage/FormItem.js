/* eslint-disable */
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import CommonDto from '@/utils/Utils/CommonDto.js'
import { ItemConfig } from './input-Item/ItemConfig';
import InputItem from './input-Item'
import { FormItemPipe, DisplayConfig } from './FormItemPipe'
import { Observer } from 'mobx-vue'
import { trace, observable, computed, action } from 'mobx';
// import 'Reflect-metadata';

@Observer
@Component({})
export default class FormItem extends Vue {
  value;
  loading = false;
  defaultFilter = {}
  errorMessageMap = {}
  noFormInject = false
  itemConfig = new ItemConfig();
  itemPipe = new FormItemPipe()
  
  @Inject({default: Utils.getEventEmitter}) onItemChangeEmit;
  @Inject({default: Utils.getEventEmitter}) onItemConfigChangeEmit;
  @Inject({default: Utils.getEventEmitter}) formInitEmitter;
  @Inject({default: false}) beforeDestroyEmitter;
  @Inject({default: () => ()=>{}}) onValidated;
  @Inject({default: Utils.stubObject}) cForm;

  @Prop({}) form;
  @Prop({type: [Boolean, CommonDto]}) dto;
  @Prop({}) i;
  @Prop({}) rules;
  @Prop({}) showMessage;
  @Prop({}) columnCount;
  @Prop({}) size;
  @Prop({}) viewOnly;
  @Prop({}) disabled;
  @Prop({}) useColumn;
  @Prop({}) textAlign;
  
  get customErrorMessage() {
    return Utils.zipEmptyData(
      Object.values({...this.errorMessageMap, itemConfig: this.itemConfig.errorMessage })
    ).join('\n')
  }
  get createChildren() {
    const { itemConfig } = this;
    return Reflect.get(this.$scopedSlots, itemConfig.slot) || (() => Reflect.get(this.$slots, itemConfig.slot))
  }
  get props() {
    return {
      ...this.$props,
      $store: this.$store,
      children: this.$slots,
      formStatus: this.cForm.formStatus
    }
  }

  @Watch('i', { immediate: true })
  @Watch('i.options', { immediate: true })
  onConfigChange(next, last) {
    this.itemConfig.setConfig(this.i)
    if(!Utils.isEqual(next, last)) {
      return this.onItemConfigChangeEmit && this.onItemConfigChangeEmit.emit({ 
        code: this.i.code, 
        i: this.i,
        options: this.i.options, 
        emitSource: this.itemPipe, 
        isInit: false,
        changeSource: 'itemConfigBase',
        changeType: 'vue update'
      })
    }
  }

  @Watch('dto')
  onDtoInit(next, last) {
    // console.log(this.dto)
    return next!==last && this.itemPipe.setDto(next)
  }
  @Watch('form')
  onFormInit(next, last) {
    return next !== last && this.formInitEmitter.emit(next)
  }


  beforeDestroy () {
    this.itemPipe.destory()
  }

  get refsItem() {
    return _.get(this.$refs, 'item.$refs.item', {
      clearValidate(){return},
    })
  }

  clearValidate() {
    return this.refsItem && (this.refsItem).clearValidate()
  }
  async forceValidate(isShowError = true, event) {
    // console.log('forceValidate', isShowError)
    const { code } = this.itemConfig
    if(!Utils.isEmptyValue(code)) {
      const result = await this.validateFieldHandler(code)
      // console.log(`validate ${this.itemConfig.label} result: ${result} ${(result===true || isShowError===false)?'clearStyle':''}`, event)
      if(result===true){
        this.clearValidateHandler(code)
      }
      return result
    }
    return false;
  }
  async clearValidateHandler(...code) {
    const item = this.refsItem;
    // console.log('clearValidateHandler', this.itemConfig.label, code)
    return item && !(item instanceof Array) && item.clearValidate(code) //item.elForm && item.elForm.clearValidate(code)
  }
  /**
   * 返回一个Promise, 发送错误信息，如果没有错误则发回true
   * @param {string} code 
   */
  validateFieldHandler(code) {
    return new Promise(r=>{
      try {
        const item = this.refsItem;
        return item && !(item instanceof Array) && item.elForm && item.elForm.validateField(code, (msg)=>{
          r(Utils.isEmptyValue(msg) ? true : msg)
        })
      } catch(e) {
        // console.error(e, code) 
      }
    })
  }
  
  onCustomValidate(type, message) {
    if(Utils.isNotEmptyString(type)) {
      this.errorMessageMap[type] = message
    }
    this.$forceUpdate()
    console.error(this.itemConfig.label, this.errorMessageMap, this.customErrorMessage)
  }
  created(){
    // console.log(this.$props)
    this.itemPipe.setDto(this.dto)
    this.itemConfig.init(this.i, this.form, this.props)
    this.viewStore.init(this)
    this.itemPipe.init(
      this.onItemChangeEmit,
      this.onItemConfigChangeEmit,
      this.formInitEmitter,
      this.beforeDestroyEmitter
    )
    this.itemPipe.setItemConfig(this.itemConfig)
    this.itemPipe.onValidate(
      Utils.createSimpleTimeBufferInput(resList => {
        const { code, isInit, emitSource, changeType, ...other } = _.last(resList)
        // debugger
        // console.log(this.itemConfig.label, resList, isInit, (changeType=="valueChange" && emitSource!=='self'),)
        return !Utils.isEmptyValue(code) && ((isInit|| ((changeType=="valueChange" && emitSource!=='self')) )? this.clearValidate() : this.forceValidate(['select', 'search'].includes(this.itemConfig.type), _.last(resList)))
      }, this, 10)
    )
    this.itemConfig.onValidate((code, isValid, errorMsg, config) => {
      this.onValidated(code, isValid, errorMsg, config)
    })
    this.itemPipe.createObservable((response)=>{
      const { code, value } = response;
      this.$emit('onItemChange', code, value, this.itemConfig)
    }, () => {
      // this.itemConfig.setConfig(this.i)
      // this.$forceUpdate()
    })
    this.formInitEmitter.emit(this.form)
  }
  viewStore = new ViewStore();
  render(h) {
    return (
      this.viewStore.formItem
    )
  }
}

import { observer } from 'mobx-vue'
import VueNative from 'vue'

class ViewStore {
  $createElement;
  @observable instance
  @action.bound init(instance){
    this.$createElement = instance.$createElement
    this.instance = instance;
  }

  @computed get inputItem(){
    const { form, dto } = this.instance;
    const { itemConfig, itemPipe = {}, createChildren, onCustomValidate } = this.instance;
    const inputItemProp = {
      props: { itemConfig, form, dto, itemPipe, createChildren },
      on: { 'validate': onCustomValidate }
    }
    // console.log(this.instance)
    return <InputItemObs v-loading={this.loading} ref='input' {...inputItemProp}/>;
  }

  @computed get deleteBtn(){
    const { itemConfig } = this.instance;
    return itemConfig.useDelete && <el-button class='el-form-hover-deBtn' size="mini" icon="el-icon-delete" type='primary' circle plain onClick={(...args)=>this.instance.$emit("onItemDelete", itemConfig, ...args)} />
  }
  @computed get addBtn(){
    const { itemConfig, itemPipe: { value, getFormItemValue } } = this.instance;
    return this.instance.itemPipe && itemConfig.useAdd && <el-button disabled={!this.instance.itemPipe.value} class='el-form-hover-deBtn' type='primary' size="mini" icon="el-icon-plus" circle plain 
    onClick={async ()=>{
      await itemConfig.onClick && itemConfig.onClick(value, getFormItemValue(itemConfig.nameCode))
    }}/>
  }

  @computed get formItem(){
    const {instance:{itemConfig, itemPipe}} = this;
    return <FormItemContainer itemConfig={itemConfig} itemPipe={itemPipe}><FormItemObs ref='item' itemConfig={itemConfig} itemPipe={this.instance.itemPipe}>{this.inputItem}{this.deleteBtn}{this.addBtn}</FormItemObs></FormItemContainer>
  }
}

export const InputItemObs = observer(VueNative.component('InputItemObs', {
  functional: true,
  render(h, { data: { ref }, children, parent, props: { form, dto, itemConfig, itemPipe, createChildren } }) {
    const { onChange, onChangeWith, value } = itemPipe;
    const { textAlign, isDisabled, prefix, suffix } = itemConfig.displayProps;
    // if(itemConfig.type==='address')
    //   debugger
    const inputItemProp = {
      props: {
        itemConfig, value, form, dto, style: { textAlign },
        viewOnly: itemConfig.isViewOnly, prefix, suffix,
        disabled: isDisabled,
        createChildren
      },
      on: {
        'change': onChange,
        'change-with': onChangeWith,
        // 'validate': onCustomValidate
      }
    }
    // trace(true)
    // console.log('update', value)
    return <InputItem ref={ref} v-loading={parent.loading} ref='input' {...inputItemProp}/>
  }
}))

export const FormItemObs = observer(VueNative.component('FormItemObs', {
  // functional: true,
  props: { itemConfig: ItemConfig, itemPipe: FormItemPipe },
  mounted() {
    // console.log(this.$refs.item)
    Object.defineProperty(this.$refs.item, 'fieldValue', {
      get: () => { 
        // console.log(this.itemPipe.value)
        return this.itemPipe.value
      },
      configurable: true,
      enumerable: true
    })
  },
  render() {
    const { itemConfig } = this;
    // console.log({ itemConfig, ...other })
    // trace()
    // console.log('FormItemObs update')
    const { label, showSize: size, isShowMessage: showMessage, formItemStyle, isInlineMessage } = itemConfig.displayProps;
    const FormItemProp = {
      size, label, showMessage,
      prop: itemConfig.code,
      inlineMessage: isInlineMessage,
      // error: this.customErrorMessage,
      rules: itemConfig.rule
    }
    return <elFormItem ref='item' class={`el-form-item-${itemConfig.type}`} style={formItemStyle} {...{props: FormItemProp}}>{_.get(this.$slots, 'default', [])}</elFormItem>
  }
}))

export const FormItemContainer = observer(VueNative.component('FormItemContainer', {
  // functional: true,
  props: ['itemConfig', 'itemPipe'],
  render(h) {
    const { itemConfig: { type, displayProps: { colSpan, useColumn }, lg, sm, xs, offset, hidden, itemPipe } } = this;
    // console.log('FormItemContainer change')
    const item = _.get(this.$slots.default, 'length', 0) === 1?this.$slots.default[0]:<span>{this.$slots.default}</span>
    // console.log(itemConfig.code, this.dto)
    if(type==='address') {
      return (
        useColumn!==false ? (
          <elCol class='use-item-col' lg={lg || 16} sm={24} offset={offset} v-show={!hidden}>
            { item }
          </elCol>
        ) : item
      )
    }
    return (
      useColumn!==false ? (
        <elCol class='use-item-col' lg={colSpan} sm={sm || 12} xs={xs || 24} offset={offset} v-show={!hidden}>
          { item }
        </elCol>
      ) : item
    )
  }
}))