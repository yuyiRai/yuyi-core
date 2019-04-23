/* eslint-disable */
import { merge, of } from 'rxjs';
import { debounceTime, filter, map, takeUntil, tap, distinctUntilKeyChanged, distinctUntilChanged } from 'rxjs/operators';
// import 'Reflect-metadata';

import { observable, computed, action, autorun, extendObservable, reaction, trace } from 'mobx';
import { ItemConfig } from './input-Item/ItemConfig';
import CommonDto from '@/utils/Utils/CommonDto.js'
import EventEmitter from '../../utils/EventEmitter';
import getFilter from './input-Item/CommonFilter';
import { autobind } from 'core-decorators';

export class DisplayConfig {
  @observable itemConfig
  @observable.ref props
  
  @action init(itemConfig, props){
    this.itemConfig = itemConfig;
    this.props = props;
    return this;
  }
  @computed get isInlineMessage() {
    return this.itemConfig.inline || this.itemConfig.name === this.itemConfig.code
  }
  @computed get isShowMessage() {
    return !this.itemConfig.isViewOnly && ![this.itemConfig.showMessage, this.props.showMessage].some(i => i === false)
  }
  @computed get textAlign() {
    return Utils.isStringFilter(this.itemConfig.textAlign, this.props.textAlign)
  }
  @computed get isDisabled() {
    return this.props.disabled || this.itemConfig.disabled
  }
  @computed.struct get showSize() {
    return this.props.size || this.itemConfig.size
  }
  @computed get label() {
    const { useLabel, label } = this.itemConfig
    if (useLabel == false || label == undefined)
      return undefined
    return label + (this.itemConfig.isViewOnly ? ":" : "")
  }
  @computed get coltal() {
    return 24 / (this.props.columnCount || 3)
  }
  @computed get colSpan() {
    return Math.round(((this.itemConfig.col || 1) + (this.itemConfig.offectRight || 0) / 8) * this.coltal)
  }
  @computed.struct get formItemStyle() {
    // trace()
    const { colSpan, itemConfig, showSize: viewSize, textAlign } = this;
    return {
      width: `${(colSpan-(itemConfig.offectRight))/colSpan*100}%`,
      height: `${itemConfig.height}`,
      marginBottom: viewSize == "mini" ? 0 : undefined,
      textAlign
    }
  }
  @computed get prefix() {
    return this.itemConfig.prefix
  }
  @computed get suffix() {
    return this.itemConfig.suffix
  }
  @computed get useColumn() {
    return this.props.useColumn
  }
}

export const ValueChangeEventOptions = {
  /**
   * @type {boolean}
   */
  isInit: null,
  /**
   * @type { boolean }
   */
  isComputed: null
}

export class ValueChangeEvent {
  /**
   * 
   * @param {*} source 
   * @param {*} value 
   * @param {*} config 
   * @param { typeof ValueChangeEventOptions } options 
   */
  constructor(source, value, config = {}, options) {
    this.code = config.code;
    this.value = Utils.cloneDeep(value);
    this.config = config,
    this.isInit = options.isInit
    this.changeSource = options.isComputed ? 'computed' : undefined
    this.emitSource = source
  }
  code;
  value;
  config;
  isInit;
  emitSource;
  /**
   * @type {'input'|'form'|'computed'}
   */
  changeSource;
}

const util = {
  isValueChange(a, b) {
    return !(_.isEqual(a, b) || (_.isNil(a) && _.isNil(b)))
  },
  isValidRes(res) {
    return (res instanceof Object) && (res.config instanceof Object)
  },
  setChangeSource(changeSource) {
    return function (value) {
      return Object.assign(value, {changeSource: value.changeSource || changeSource})
    }
  }
}

// import { EventStoreInject } from '../../utils/EventEmitter'
// @EventStoreInject(['value-change'])
export class FormItemPipe {
  noFormInject = false
  /**
   * 值变更事件
   * @type { EventEmitter }
   */
  $itemChange;
  /**
   * 配置变更事件
   * @type { EventEmitter }
   */
  $configChange;
  /**
   * 表单初始化事件
   * @type { EventEmitter }
   */
  $formInit;
  /**
   * 销毁事件
   * @type { EventEmitter }
   */
  $destory;
  @observable value = null;
  @observable loading = true
  @observable.ref dto;
  /**
   * @type { ItemConfig }
   */
  @observable itemConfig = {}
  @action init($itemChange, $configChange, $formInit, $destory) {
    this.$itemChange = $itemChange;
    this.$configChange = $configChange
    this.$formInit = $formInit
    this.noFormInject = !Utils.isEventEmitter($destory)
    this.$destory = this.noFormInject ? Utils.getEventEmitter() : $destory
    // console.log(this)
  }
  @autobind destory(){
    this.itemConfig.destory()
    this.$subOptions.unsubscribe()
    this.$subMain.unsubscribe()
    if(this.noFormInject) {
      // console.log('destory emmitter')
      this.$itemChange.dispose()
      this.$configChange.dispose()
      this.$formInit.dispose()
      this.$destory.emit(true)
      this.$destory.dispose()
    }
  }

  @computed get valueInForm() {
    return this.getFormItemValue();
  }
  @computed get defaultValue(){
    return this.getDefaultValue(this.itemConfig);
  }
  @computed get filter() {
    const { filter, type } = this.itemConfig
    return Utils.isFunctionFilter(filter, getFilter(Utils.isNotEmptyStringFilter(filter, type)).filter)
  }
  @computed get filterToValue() {
    const { filterToValue, type } = this.itemConfig
    return Utils.isFunctionFilter(filterToValue, getFilter(Utils.isNotEmptyStringFilter(filterToValue, type)).filterToValue)
  }
  @computed get form() {
    return Utils.isObjectFilter(this.itemConfig && this.itemConfig.form, {})
  }

  constructor() {
    reaction(() => this.itemConfig.computed, (computedValue) => {
      this.onDisabledChange()
      return computedValue !== false && this.onComputedChange(computedValue)
    }, { name: 'onComputedValue' })
    reaction(() => this.itemConfig.disabled, this.onDisabledChange, { name: 'onDisabledValue' })
    reaction(() => this.itemConfig.hidden, this.onHiddenChange, { name: 'onHiddenValue' })
  }

  @autobind onDisabledChange() {
    const { label, disabled, cleanOnDisabled } = this.itemConfig
    // console.log(label, disabled, cleanOnDisabled)
    if (disabled && cleanOnDisabled) {
      return this.onChange(null)
    }
  }

  @autobind onHiddenChange() {
    const { label, hidden, cleanOnHidden } = this.itemConfig
    // console.log(label, hidden, cleanOnHidden)
    if (hidden && cleanOnHidden!==false) {
      return this.onChange(null)
    }
  }
  
  @autobind onChange(value, isInit) {
    const res = this.getOnChangeResponse(value, this.itemConfig, {isInit})
    // debugger
    // console.log('onChange', res, this.itemConfig.label, this.form)
    this.$itemChange.emit(res)
  }
  @autobind onComputedChange(value) {
    const res = this.getOnChangeResponse(value, this.itemConfig, { isComputed: true })
    // console.log('onComputedChange', res, this.itemConfig.label, this.form)
    this.$itemChange.emit(res)
  }

  @autobind onChangeWith(value, changeCode) {
    const { itemConfig } = this
    // console.log('changeWith', changeCode, value)
    this.setValueToFormDto(value, changeCode)
    return Utils.isFunction(itemConfig.onChangeWith) && itemConfig.onChangeWith(value)
  }

  /**
   * 需要更新的config code-array
   * @return { Array<string> }
   */
  @computed get referenceCodes() {
    const { code, referenceCodes } = this.itemConfig
    const validateList = (typeof referenceCodes !== 'string') ? [ code ] : Utils.zipEmptyData([ code, ...referenceCodes.split(',') ])
    return validateList
  }

  @action.bound setDto(dto) {
    this.dto = dto
  }
  @action.bound setItemConfig(itemConfig = this.itemConfig) {
    if(this.itemConfig !== itemConfig) {
      if(itemConfig instanceof ItemConfig)
        this.itemConfig = itemConfig 
      else {
        this.itemConfig.setConfig(itemConfig)
      }
    }
  }
  @action.bound setForm(form, source) {
    this.itemConfig.setForm(form)
  }
  /**
   * 校验回调
   * @param {*} callback 
   */
  @action.bound onValidate(callback) { 
    this.validate = callback
  }

  /**
   * 获取Form数据载入时的初始value变更
   * @param { * } form 
   */
  @autobind getFormInitValueResponse(form) {
    // this.setForm(form)
    const { computed } = this.itemConfig
    if(!Utils.isNil(computed) && computed!==false && computed!==this.value) {
      return this.getOnChangeResponse(computed, this.itemConfig, { isComputed: true })
    }
    return this.getOnChangeResponse(this.filter(this.defaultValue), this.itemConfig.i, {isInit: true})
  }

  /**
   * ItemConfig更新事件
   * @param { ItemConfig } next 
   * @param { boolean } isInit 
   */
  @action.bound getItemConfigChangeResponse(next, isInit) {
    const { code, options } = next;
    return { code, options, emitSource: this, isInit: isInit===true }
  }

  @autobind dispatchConfigUpdate(response) {
    const { isInit, emitSource, changeSource } = response
    // debugger
    return _.forEach(
      this.referenceCodes, 
      code => this.$configChange.emit({code, isInit, emitSource: code===this.itemConfig.code?'self':emitSource, form: this.form, changeType: 'valueChange', changeSource })
    )
  }

  @autobind createObservable(callback, callback2) {
    this.$subOptions = merge(this.$configChange.pipe(
      // 筛选属于自己的更新
      filter(({code, ...other}) => this.itemConfig.code === code),
      tap(this.loadingStart),
      debounceTime(20),
      takeUntil(this.$destory)
    ), of({code: this.itemConfig.code, isInit: true, changeType: 'init', changeSource: 'self'})).pipe(
      distinctUntilChanged((pre, next) => {
        return _.isEqual(pre.i, next.i) && next.changeType!=='valueChange'
      }),
      tap(({i, emitSource}) => this.setItemConfig(i, emitSource)),
      // tap(({code, isInit, changeSource, changeType, ...other})=>{
      //   console.log(`config update, ${this.itemConfig.label}/${code}, isInit=${isInit} from ${changeType}->${changeSource}`, other, this.itemConfig)
      // }),
      // filter(({changeType, emitSource}) => changeType!=='valueChange' || (changeType==='valueChange' && emitSource===this)),
      map(this.validate),
      takeUntil(this.$destory),
      tap(this.loadingEnd),
    ).subscribe(callback2)
    
    this.$subMain = merge(
      this.$formInit.pipe(
        // filter(form => !_.isEqual(form, this.itemConfig.form)),
        tap(form=>this.setForm(form)),
        map(this.getFormInitValueResponse),
        map(util.setChangeSource('form')),
        takeUntil(this.$destory),
        // tap(res=>console.log(res))
      ), // 初始值
      this.$itemChange.pipe(
        map(util.setChangeSource('input')),
        takeUntil(this.$destory),
      ) // 值更新事件
    ).pipe(
      filter(util.isValidRes),
      // map((res) => {
      //   // debugger
      //   const {value, code} = res
      //   if(this.itemConfig.code === code) {
      //     const { computed } = this.itemConfig
      //     if(!Utils.isNil(computed) && computed!==false && computed!==this.value) {
      //       return { ...res, value: computed, changeSource: 'computed'}
      //     } else if (util.isValueChange(value, this.value))
      //       return res
      //   }
      //   return false
      // }),
      filter(({code, value}) => this.itemConfig.code === code && util.isValueChange(value, this.value) ),
      takeUntil(this.$destory),
    ).subscribe(res => {
      const { value, code } = res
      // const { config, isInit, changeSource } = res
      // const { label } = config;
      // const hint = `${this.value} => ${value}`
      // console.log(`${label}/${code} change ${hint} isInit=${isInit}  by ${changeSource}`, this.referenceCodes, this.form)//, this.form, response)

      this.value = value
      this.value2FormValue(value)
      callback(res)
      this.dispatchConfigUpdate(res)
    })
  }
  @action.bound loadingStart() {
    this.loading = true
  }
  @action.bound loadingEnd() {
    this.loading = false
    this.itemConfig.updateVersion()
  }

  /**
   * 取得值变更响应事件
   * @param {*} value 
   * @param {*} config 
   * @param { typeof ValueChangeEventOptions } options 
   */
  @autobind getOnChangeResponse(value, config = this.itemConfig, { isInit = false, isComputed = false }) {
    return new ValueChangeEvent(this, value, config, { isInit, isComputed })
  }

  
  @action.bound value2FormValue(value) {
    if (Utils.isEmptyValue(value)) {
      return this.setValueInForm(null)
    }
    const toValue = this.filterToValue(value)
    if (toValue instanceof Array) {
      this.setValueInForm(toValue.map(i => (i == '' ? null : i)))
    } else {
      this.setValueInForm((toValue === null || toValue === '') ? null : toValue)
    }
  }

  @action.bound setValueInForm(v) {
    const { type, code } = this.itemConfig
    if (type == 'dateToDate') {
      const [ codeA, codeB ] = code.split('|') || [null, null]
      const [ valueA, valueB ] = v || [null, null]
      this.setValueToFormDto(valueA, codeA, true)
      this.setValueToFormDto(valueB, codeB, true)
      // this.setValueToFormDto(v, code, true)
    } else {
      this.setValueToFormDto(v, code, true)
    }
    this.itemConfig.onChange && this.itemConfig.onChange(v, this.lastFormValue, this.form, this.itemConfig)
    this.lastFormValue = v
  }
  
  @action setValueToFormDto(value, key = this.itemConfig.code, safe = false) {
    const { dto, form } = this;
    if(dto instanceof CommonDto) {
      return dto.set(key, (!safe || Utils.isNotEmptyValue(value)) ? value : null)
    } else if(form) {
      return form[key] = (!safe || Utils.isNotEmptyValue(value)) ? value : null
    }
  }

  @action.bound setCustomValidate(type, message) {
    if(Utils.isNotEmptyString(type)) {
      this.errorMessageMap[type] = message
    }
  }

  /**
   * 从form或dto对象中取值
   * @param { string } code 键值
   */
  @autobind getFormItemValue(code = this.itemConfig.code) {
    const formOrDto = this.dto ? this.dto : this.form;
    const { type } = this.itemConfig
    if (type == 'dateToDate') {
      const [a, b] = this.itemConfig.code.split('|') || [undefined, undefined]
      return [Utils.getDtoOrFormValue(a, formOrDto) || '', Utils.getDtoOrFormValue(b, formOrDto) || '']
    }
    // code==='submitTime' && console.log(code, _.cloneDeep(formOrDto.export())[code])
    return Utils.getDtoOrFormValue(code, formOrDto)
  }

  /**
   * 获取默认值（表单有合法的值取表单，没有则取配置的默认值）
   * @param { ItemConfig } config
   */
  @autobind getDefaultValue({ label, value, type }) {
    // console.log({...this.form}, this.valueInForm)
    // debugger
    // 初始值 
    const initValue = Utils.isEmptyValue(value) ? (type==="checkOne"?"0":undefined) : value
    // 如果表单中的值为非空，取表单，否则取默认值设定
    const notEmptyValue = Utils.isNotEmptyData(this.valueInForm) ? this.valueInForm : initValue
    const defaultValue = (notEmptyValue === 0 ? "0" : notEmptyValue)
    // console.log(`${label} defaultValue: value/${value}  initValue/${initValue} valueInForm/${this.valueInForm} notEmptyValue/${notEmptyValue} defaultValue/${defaultValue} = ${this.valueInForm} ${Utils.isEmptyValue(value)}`, 
    // this.i)
    return defaultValue
  }
}


