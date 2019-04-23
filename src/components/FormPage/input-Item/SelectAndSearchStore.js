/* eslint-disable */
import { observable, computed, action, runInAction, toJS, reaction } from 'mobx';
import { EventStore, EventStoreInject } from '../../../utils/EventEmitter'
import { observe, trace } from 'mobx'
import { ItemConfig } from './ItemConfig';
import { filter } from 'rxjs/operators';

@EventStoreInject(['change', 'change-with', 'options-change'], { itemConfig: ItemConfig })
export class OptionsStore {
  @observable itemConfig;
  __keyMap = {}
  __optionMap = new WeakMap()
  constructor(itemConfig) {
    this.itemConfig = itemConfig;
    if(this.itemConfig.allowInput) {
      console.log(this)
      this.$on('options-change', options => {
        // console.log(options, this.shadowOption.value)
        // if(this.itemConfig.label==='归属车辆')
        //   debugger
        this.setShadowOptionByValue(this.shadowOption.value, 'options-update')
      })
      // reaction(() => this.itemConfig.options, options => {
      //   // console.log(options, this.shadowOption.value)
      //   // if(this.itemConfig.label==='归属车辆')
      //   //   debugger
      //   this.setShadowOptionByValue(this.shadowOption.value, 'options-update')
      // }, { fireImmediately: true })
    }
  }

  @observable shadowOption = { key: Utils.uuid(), errorMsg: null, label: '', value: '', highlight: true };
  @computed get shadowOptionMode(){
    return this.itemConfig.code === this.itemConfig.nameCode ? 'text' : 'code'
  }
  /**
   * 录入值的自动转化
   * @param { string } value 
   * @param { string } label 
   */
  @action.bound async setShadowOptionByValue(value, source) {
    const options = await this.itemConfig.getOptionsSafe()
    // if(this.itemConfig.label==='交强险承保单位')
    //   debugger
    const label = Utils.isStringFilter(Utils.valueToLabel(options, value), this.itemConfig.searchName)
    this.shadowUpdateDispatcher(label, value, source)
  }

  /**
   * 录入值的自动转化
   * @param { string } value 
   * @param { string } label 
   */
  @action.bound async setShadowOption(label, source) {
    const options = await this.itemConfig.getOptionsSafe()
    // if(this.itemConfig.label==='交强险承保单位')
    //   debugger
    const value = this.labelToValue(label)
    this.shadowUpdateDispatcher(label, value, source)
  }
  
  @autobind labelToValue(label) {
    return Utils.isStringFilter(Utils.labelToValue(this.displayOptions, new RegExp(`^(\\\[(.*)\\\]|)${label}(\\\[(.*)\\\]|)$`)), label)
  }

  @autobind async shadowUpdateDispatcher(label, value, source) {
    // console.log(`setShadowOption by ${source} mode: ${this.shadowOptionMode}, value: ${value}, label: ${label}`, _.cloneDeep(this.displayOptions), _.cloneDeep(this.itemConfig.options))
    try {
      if(Utils.isNotEmptyString(value)) {
        const result = await this.itemConfig.validateHandler(value)
        // console.log(result, value)
      } else {
        throw new Error()
      }
      // console.error('shadowOption result', result, value)
      runInAction(() => this.updateShadowOption(value, label))
    } catch (error) {
      // console.log('shadowOption', error)
      if (this.shadowOption.label !== value) {
        this.shadowOption.value = value
        this.shadowOption.label = label
        this.shadowOption.errorMsg = error
      }
    }
  }

  @action.bound 
  @Utils.logger('testt')
  @Utils.timebuffer(10)
  updateShadowOption(value, label = undefined) {
    if (Utils.isString(this.shadowOption.errorMsg)) {
      this.shadowOption.errorMsg = null
    }
    if(this.itemConfig.label==='交强险承保单位')
      debugger
    if (value === this.value && this.shadowOption.value != this.value) {
      // console.log(this.selectedLablesStr)
      this.shadowOption.label = label || this.selectedLablesStr
      this.shadowOption.value = this.value
    } else if(value !== this.value){
      const shadowOptionSafe = Utils.getOptionsByValue(this.filterOptions, value, true)
      if (shadowOptionSafe) {
        this.shadowOption.label = shadowOptionSafe.label
      } else {
        const { allowCreate } = this.itemConfig
        if (Utils.isFunction(allowCreate)) {
          const { label } = allowCreate(value)
          this.shadowOption.label = Utils.isStringFilter(label, value, '')
        } else {
          this.shadowOption.label = Utils.isStringFilter(label, value, '')
        }
      }
      this.shadowOption.value = value;
    }
    // debugger
    // if (value === this.value && this.shadowOption.value != this.value) {
    //   // console.log(this.selectedLablesStr)
    //   this.shadowOption.label = label || this.selectedLablesStr
    //   this.shadowOption.value = this.value
    // } else if(value !== this.value) {
    //   if (Utils.isFunction(allowCreate)) {
    //     const { label } = allowCreate(value)
    //     this.shadowOption.label = Utils.isStringFilter(label, value, '')
    //   } else {
    //     this.shadowOption.label = Utils.isStringFilter(label, value, '')
    //   }
    //   this.shadowOption.value = Utils.isStringFilter(value, '')
    // }
    console.log(_.cloneDeep(this.shadowOption))
    return this.shadowOption = {...this.shadowOption}
  }

  @computed get isValidShadowOption() {
    return !this.itemConfig.allowInput || !Utils.isString(this.shadowOption.errorMsg)
  }

  static getOptionsKey(item, index) {
    return Utils.isStringFilter(item.id, item.key, item.value, (Utils.isObject(item) ? index : item) + '')
  }

  @computed get __optionArr() {
    const { options } = this.itemConfig
    const next = []
    // this.arrayMap(this.__optionArr, this.toConvertedOption)
    for(const item of Utils.isArrayFilter(options, [])) {
      if(!_.isNil(item)) {
        const index = next.length;
        next.push(
         Utils.isObject(item)
          ? (item.__key==null ? {...item, __key: OptionsStore.getOptionsKey(item, index)} : item)
          :{ 
            __key: OptionsStore.getOptionsKey(item, index), 
            value: item 
          }
        )
      }
    }
    return next;
  }
  @autobind toConvertedOption(item, index) {
    if(!this.__optionMap.get(item)) {
      if (!Utils.isNumber(this.__keyMap[item.__key])) {
        this.__keyMap[item.__key] = 0;
      }
      this.__keyMap[item.__key]++
      this.__optionMap.set(item, {
        ...item,
        key: `${item.__key}.${this.__keyMap[item.__key]}`,
        label: Utils.isStringFilter(item.label, item.value, (Utils.isObject(item) ? index : item) + ''),
        value: Utils.isStringFilter(item.value, (Utils.isObject(item) ? index : item) + '')
      })
    } 
    return this.__optionMap.get(item)
  }

  @computed get convertedOption() {
    // console.time(`2displayOptionsNative${this.itemConfig.label}`)
    const result = Utils.arrayMapDive(this.__optionArr, this.toConvertedOption)
    // console.timeEnd(`2displayOptionsNative${this.itemConfig.label}`)
    // console.time(`displayOptionsNative${this.itemConfig.label}`)
    // const result = [], array = this.__optionArr
    // while (result.length < array.length) {
    //   result[result.length] = (this.toConvertedOption(array[result.length], result.length, this.__keyMap, this.__optionMap))
    // }
    // console.timeEnd(`displayOptionsNative${this.itemConfig.label}`)
    return result
  }

  @computed get filterOptions() {
    // trace()
    const { filterOptions } = this.itemConfig;
    return Utils.isNotEmptyArray(filterOptions) ? Utils.arrayFilterDive(this.convertedOption, item => !filterOptions.includes(item.label)) : this.convertedOption
  }

  @computed get selectedItemIndex() {
    const value = Utils.isNotEmptyValueFilter(this.shadowOption.value, this.value)
    return _.findIndex(this.filterOptions, ({ value: v, label }) => {
      // debugger
      return _.isEqual(v, value) || (_.isEqual(label, value))
    })
  }

  @computed get displayOptions() {
    const { allowInput } = this.itemConfig;
    const defaultOptions = this.filterOptions
    if (allowInput) {
      // debugger
      // console.log('getShadowOption', defaultOptions, this.shadowOption)
      if (this.selectedItemIndex > -1) {
        return Utils.arrayMapDive(
          defaultOptions, (option, index) => this.selectedItemIndex === index ? { ...option, highlight: true } : option
        )
      } else if (Utils.isNotEmptyString(this.shadowOption.value) && !Utils.getOptionsByLabel(defaultOptions, this.shadowOption.label, true)) {
        // this.itemConfig.allowInput && console.log('shadowOption', {...this.shadowOption}, this)
        return _.concat(this.shadowOption, defaultOptions)
      }
    }
    return defaultOptions
  }
}

@EventStoreInject(['change', 'change-with', 'options-change'], { itemConfig: ItemConfig })
export class SelectAndSearchStore {
  @observable type = 'select';
  /**
   * @type { ItemConfig }
   */
  @observable itemConfig = {};
  /**
   * @type { OptionsStore }
   */
  @observable optionsStore = {};
  @observable.ref searchEventEmitter;
  /**
   * 至今为止选择过的optionList
   * @type { Array }
   */
  @observable.ref selectedOptions = [];
  @observable.ref value;
  
  // shadowOptionObserve = observe(this.shadowOption, 'value', next => console.log('shadowOption', next))

  @computed get shadowOption() {
    return this.optionsStore.shadowOption || {}
  }

  @action.bound setShadowOption(label, source) {
    this.optionsStore.setShadowOption(label, source)
  }

  @action.bound setShadowOptionByValue(value, source) {
    this.optionsStore.setShadowOptionByValue(value, source)
  }

  @computed get displayOptions() {
    return this.optionsStore.displayOptions || []
  }

  /**
   * 设置当前值
   * @param {string | Array<string>} value 
   * @param {string} source 
   */
  @action.bound setValue(value, source) {
    if (this.itemConfig.multiple) {
      const nextValue = Utils.zipEmptyData(_.castArray(value))
      if (!Utils.isEqual(nextValue, this.value)) {
        this.value = nextValue
      }
    } else {
      if (!_.isString(value))
        value = _.toString(value)
      if (value !== this.value) {
        this.value = value
        if (this.itemConfig.allowInput && value !== this.shadowOption.value) {
          this.optionsStore.setShadowOptionByValue(value, 'valueUpdate')
        }
      }
    }
  }

  /**
   * 设置配置
   * @param {'select' | 'search'} type 
   * @param { ItemConfig } itemConfig 
   */
  @action.bound setConfig(type, itemConfig) {
    this.type = ['select', 'search'].includes(type) ? type : 'select'
    this.itemConfig = (itemConfig instanceof ItemConfig) ? itemConfig : (Utils.isObject(itemConfig) ? new ItemConfig(itemConfig) : this.itemConfig)
    this.optionsStore = new OptionsStore(this.itemConfig)
    this.searchEventEmitter = Utils.createSimpleTimeBufferInput(keywordList => {
      this.remoteMethod(_.last(keywordList))
    }, this, 300)
  }
  /**
   * 
   * @param { string | string[] } key 
   */
  @autobind searchMethods(key) {
    const keyArr = _.castArray(key);
    console.log('keyword list', keyArr, this.selectedLables)
    if (Utils.isNotEmptyArray(keyArr) && (keyArr!== this.selectedLables) && !Utils.likeArray(keyArr, this.selectedLables)) {
      if (this.itemConfig.allowInput) {
        // debugger
        this.optionsStore.setShadowOption(Utils.castString(key), 'search')
      }
      this.searchEventEmitter(keyArr)
    }
  }

  @computed get placeholder() {
    switch (this.type) {
      case 'select': return Utils.isNotEmptyStringFilter(this.itemConfig.placeholder, '请选择' + (this.itemConfig.label || ''));
      case 'search': return Utils.isNotEmptyStringFilter(this.itemConfig.placeholder, '请输入关键字搜索...')
      default: return ''
    }
  }

  @computed get isSearch() {
    return this.type === "search"
  }
  @computed get hasNameCode() {
    return Utils.isNotEmptyString(this.itemConfig.nameCode)
  }
  @computed get useEmpty() {
    const { useHint, useEmpty } = this.itemConfig
    return _.isNil(useHint) && useEmpty !== false ? options => options && options.length > 0 : () => false
  }

  @computed get isCenter() {
    return this.itemConfig.center === true
  }
  @computed get popperClass() {
    return (this.isCenter?'center':'')
  }


  /**
   * 远程搜索方法
   * @param {string | Array<string>} keyWord 搜索关键字，可以是数组
   */
  @action.bound async remoteMethod(keyWord) {
    // this.itemConfig.label=="受伤部位" && console.log('start remoteMethod', this.itemConfig.label, response)
    const { itemConfig } = this;
    // // this.itemConfig.label=="受伤部位" && console.log(this.itemConfig.remoteMethod)
    const { remoteSearch, multiple, setOptions, label } = itemConfig;
    console.log('尝试搜索', label, keyWord, typeof keyWord)
    const keyWordArr = Utils.zipEmptyData(Utils.castArray(keyWord));
    const lastValue = Utils.cloneDeep(this.value)
    runInAction(async () => {
      if (Utils.isFunction(setOptions) && Utils.isFunction(remoteSearch)) {
        const nextOptions = await remoteSearch(keyWord)
        // 去除之前选择过的重复项
        if (!Utils.isNil(multiple))
          Utils.arrayPush(nextOptions, _.pullAllBy(this.selectedOptions, nextOptions, 'value'))
        setOptions(nextOptions)
        this.patchSelectedOption(nextOptions)
        // debugger
        // 如果输入的完整字符匹配到选项，自动选中
        // this.itemConfig.label=="受伤部位" && console.log('setOptions', this, setOptions, nextOptions)
        const selectedOptions = Utils.getOptionsByLabel(nextOptions, keyWordArr)
        if (selectedOptions.length > 0) {
          const selectValue = multiple
            ? Utils.zipEmptyData(_.concat(lastValue, _.map(selectedOptions, 'value')), true)
            : _.get(selectedOptions, '[0].value')
          console.log('搜索完毕', label, selectedOptions, selectValue, this.value)
          if (!Utils.likeArray(selectValue, this.value))
            this.onChange(selectValue)
          // this.itemConfig.label=="手术名称" && console.log('搜索完毕', label, keyWordArr, itemConfig, nextOptions, this.selectedOptions, this.itemConfig.loading)
        }
      }
    })
  }

  @action.bound onChangeWithLabel(label) {
    const value = this.optionsStore.labelToValue(label);
    // console.log('onBlur', label, value, this.value)
    // if(Utils.isEqual(value, this.value)) {
    //   return
    // }
    return this.onChange(value)
  }
  @action.bound onChange(value) {
    if (!Utils.isEqual(value, this.value)) {
      const { options, nameCode, allowCreate, label, setOptions, multiple } = this.itemConfig;
      const selectedObj = Utils.getOptionsByValue(options, value)
      // const { pull: pullList, push: pushList } = Utils.getListDifferent(this.value, value)
      // this.patchSelectedOption(pushList)
      // console.log('onChange', label, value, this.value)
      // this.value = value
      const isAllowCreateOption = allowCreate && selectedObj.length === 0 && Utils.isNotEmptyValue(value) && this.isValidShadowOption
      if (isAllowCreateOption) {
        const additionOption = Utils.isFunctionFilter(allowCreate, value => ({ label: value, value }))(value)
        if (Utils.getOptionsByValue(options, additionOption.value || additionOption).length == 0) {
          // this.itemConfig.label=="受伤部位" && console.log('update options additions',allowCreate, selectedObj)
          options.push(additionOption)
          selectedObj.push(additionOption)
          console.log('createOptions', additionOption)
          this.itemConfig.setOptions(options)
        }
        // this.itemConfig.setOptions(options.concat([{label: value, value}]))
      }
      debugger
      if (Utils.isNotEmptyString(nameCode)) {
        // this.itemConfig.label=="受伤部位" && console.log('change-with', label, selectedObj)
        this.$emit('change-with', _.map(selectedObj, 'label').join(','), nameCode)
      }
      return this.$emit('change', value)
    }
  }

  @action.bound patchSelectedOption(pushOptionsList) {
    // const { options } = this.itemConfig;
    this.selectedOptions = _.concat(this.selectedOptions,
      _.filter(pushOptionsList,
        item => !_.some(this.selectedOptions, option => option.value === item.value)
      )
    )
  }

  @computed get selectedLables() {
    return Utils.zipEmptyData(Utils.isNotEmptyArrayFilter(this.valuesToLabels(this.value), [this.shadowOption.label]))
  }
  @computed get selectedLablesStr() {
    return this.selectedLables.join(',')
  }
  @computed get selectedLablesConfig() {
    return _.map(this.selectedLables, (label) => {
      return {
        label,
        remove: () => {
          console.log('close', this.value, this.labelsToValues(label))
          this.onChange(_.pullAll([...this.value], this.labelsToValues(label)))
        }
      }
    })
  }
  @computed get hasSelectedTag(){
    return this.selectedLablesConfig.length > 0
  }
  /**
   * 格式化Label
   * @param { string } str 
   * @return { {prefix: string, label: string, suffix: string} } {prefix, label, suffix}
   */
  static getConvertLabel(str) {
    const [ prefix, label, suffix ] = Utils.isStringFilter(str, ',,').replace(/^(\[(.*?)\]|)(.*?)(\[(.*?)\]|)$/, '$2,$3,$5').split(',')
    return { prefix, label, suffix }
  }
  /**
   * @type {{ prefix: string, label: string, suffix: string }}
   */
  @computed get selectedLabelConveration() {
    return SelectAndSearchStore.getConvertLabel(this.selectedLablesStr)
  }
  /**
   * @type {{ prefix: string, label: string, suffix: string }}
   */
  @computed get shadowLabelConveration() {
    return SelectAndSearchStore.getConvertLabel(this.shadowOption.label)
  }

  @autobind labelsToValues(label) {
    return Utils.labelsToValues(this.isSearch ? this.selectedOptions : this.itemConfig.options, label)
  }

  @autobind valuesToLabels(value, joinKey = false) {
    return Utils.valuesToLabels(this.isSearch ? this.selectedOptions : this.itemConfig.options, value, joinKey)
  }
}
window.SelectAndSearchStore = SelectAndSearchStore


import { extendObservable } from 'mobx'
import { autobind } from 'core-decorators';
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

