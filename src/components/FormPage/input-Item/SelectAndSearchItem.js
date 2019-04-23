/* eslint-disable */
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import { Observer } from 'mobx-vue'
import { observable, computed, action, runInAction } from 'mobx';
import './SelectAndSearchItem.scss'
import { SelectAndSearchStore, SelectAndSearchViewStore } from './SelectAndSearchStore';
import { ItemConfig } from './ItemConfig';


@Observer
@Component({ name: 'SelectAndSearchItem' })
export default class SelectAndSearchItem extends Vue {
  @Prop({ type: String }) useSlot;
  @Prop({ type: String, required: true }) type;
  @Prop({}) value;
  @Prop() searchName;
  @Prop(Boolean) disabled;
  /**
   * @type { ItemConfig }
   */
  @Prop({ type: [Object, ItemConfig], required: true }) itemConfig;

  store = new SelectAndSearchViewStore(this)
  showStatus = false;
  nativeOn = {
    'mouseenter': e => this.onSelectVisibleChange(true),
    'mouseleave': e => this.onSelectVisibleChange(false)
  }

  @Watch('itemConfig', { immediate: true })
  convertItemConfig(itemConfig) {
    // this.itemConfig.code=="costDto.costType" && console.log('set config', itemConfig, this.itemConfig.label, this.itemConfig.code, this.store.value)
    this.store.setConfig(this.type, itemConfig, this)
  }
  @Watch('value', { immediate: true })
  onValueChanged(value, lastValue) {
    if (Utils.isEqual(value, lastValue)) {
      return;
    }
    // this.itemConfig.label==='交强险承保单位' && console.log('update value', this.itemConfig.label, this.itemConfig.code, value, this.itemConfig.form)
    this.store.setValue(value, 'component watch')
  }
  @Watch('searchName', { immediate: true })
  onSearchNameChange(searchName, last) {
    if (this.store.isSearch && !Utils.isEqual(searchName, last)) {
      // this.itemConfig.label==='交强险承保单位' && console.log('update searchName', searchName)
      // this.itemConfig.label=="受伤部位" && console.log('start searchName', searchName, this.itemConfig.label, this.itemConfig.code, this.store.value)
      // console.log('searchName', searchName, _.toString(last), _.toString(this.store.selectedLables))
      this.store.searchMethods(searchName, false)
      // this.store.setShadowOption(searchName)
    }
  }

  @Watch('itemConfig.options', { immediate: true })
  onOptionsChange(options, last) {
    // console.log('options-change', options)
    // this.itemConfig.code=="costDto.costType" && console.log('options change', this.itemConfig.label, options)
    this.store.patchSelectedOption(options)
    const { value } = this.store;
    const { nameCode, allowCreate, multiple } = this.itemConfig;
    const selectedObj = Utils.getOptionsByValue(options, this.store.value)
    if (Utils.isNotEmptyString(nameCode) && selectedObj.length > 0) {
      // // this.itemConfig.label=="受伤部位" && console.log('change-with', this.itemConfig.label, selectedObj, _.map(selectedObj, 'label').join(','))
      this.$emit('change-with', _.map(selectedObj, 'label').join(','), nameCode)
    }
    if (((allowCreate && selectedObj.length === 0) || multiple) && Utils.isNotEmptyValue(value)) {
      // // this.itemConfig.label=="受伤部位" && console.log('update options additions', allowCreate, selectedObj)
      const additionOption = Utils.isFunctionFilter(allowCreate, value => ({ label: value, value }))(value)
      if (Utils.getOptionsByValue(options, additionOption.value || additionOption).length == 0) {
        // this.itemConfig.label=="受伤部位" && console.log('update options additions',allowCreate, selectedObj)
        options.push(additionOption)
      }
    }
  }
  
  getSelectedTags() {
    const { selectedLablesConfig } = this.store;
    return (
      <div style='max-width: 20vw;'>{
        Utils.isNotEmptyArray(selectedLablesConfig) ? _.map(
          selectedLablesConfig, 
          ({label, remove}) => <el-tag key={`tag-${label}`} closable disable-transitions={false} onClose={remove}>{label}</el-tag>
        ) : ""
      }</div>
    )
  }

  created(){
    window.selectInput = [...(window.selectInput || []), this]
    this.store.$on('change', this.$emit.bind(this, 'change'))
    this.store.$on('change-with', this.$emit.bind(this, 'change-with'))
  }

  async fetchSuggestions(key, cb) {
    const { setOptions, options, form, remoteMethod } = this.itemConfig;
    const list = await (Utils.isFunction(remoteMethod)?remoteMethod(key) : options)
    // console.log(this.store.displayOptions)
    setOptions(list)
    this.$nextTick(() => {
      // console.log(key, this.store.displayOptions)
      cb(this.store.displayOptions)
    })
  }

  render(h) {
    const { disabled } = this;
    const { value, onChange, onChangeWithLabel, isSearch, searchMethods, itemConfig, placeholder, popperClass,
      classNames, style, prefixDom, shadowLabelConveration
     } = this.store;
    const { multiple, allowInput, allowCreate, loading, noDataText, useHint } = itemConfig
    // this.itemConfig.label=="手术名称" && console.log('get value', this.itemConfig.label, this.itemConfig.code, this.store.value, this.store.selectedLables, this.store)
    const whenSearch = (v, v2) => Utils.jsxIf(isSearch, v, v2)

    if (allowInput) {
      const props = {
        props: {
          value: shadowLabelConveration.label
        },
        on: {
          'input': key => this.store.setShadowOption(key, 'onInput'),
          'select': item => onChange(item.value),
          'blur': e => onChangeWithLabel(e.target.value)
        }
      }
      return (
        <elAutocomplete placeholder={placeholder} class={classNames} style={style}
          value-key='label' 
          debounce={10} fetch-suggestions={this.fetchSuggestions}
          scopedSlots={{default: ({ item, ...other }) => this.store.getOptionsDom(item)}}
          {...props}
        >
          {prefixDom}
        </elAutocomplete>
      )
    } else {
      // console.log(value)
      const props = {
        props: {
          multiple, value, popperClass, 
          clearable: true, placeholder, disabled, 'allow-create': (allowCreate === true || Utils.isFunction(allowCreate)),
          filterable: whenSearch(true) || Utils.isFunction(allowCreate) || allowCreate === true,
          remote: whenSearch(true), loading: whenSearch(loading), reserveKeyword: isSearch, noMatchText: whenSearch('无匹配结果'),
          noDataText: whenSearch(Utils.isStringFilter(noDataText, '请输入关键字查询...'), Utils.isStringFilter(noDataText)), remoteMethod: searchMethods
        },
        on: {
          change: onChange,
        },
        nativeOn: this.nativeOn
      }
      const content = this.store.popperOptionsDom
      if (multiple) {
        return (
          <el-popover ref='popover' placement="right" value={this.showStatus} trigger='click' style='display: block;' disabled={!this.store.hasSelectedTag || disabled} >
            {this.getSelectedTags()}
            <elSelect ref='selectInput' key="reference" slot="reference" v-loading={whenSearch(loading)} {...props} class={classNames}>
              {/* <span slot='prefix'>123</span> */}
              {content}
            </elSelect>
          </el-popover>
        )
      } else
        return (
          <elSelect ref='selectInput' v-loading={whenSearch(loading)} {...props} class={classNames}>
            {useHint?<elOptionGroup label={useHint}>{content}</elOptionGroup>:content}
          </elSelect>
          // <div>
          //   {/* {props.props.filterable+''} {isSearch+''} {type} */}
          // </div>
        )
    }
  }
  onSelectVisibleChange(visible) {
    return this.showStatus != visible && this.$nextTick(async () => {
      if(!visible) {
        await Utils.waitingPromise(1000)
      }
      this.showStatus = visible
      this.scrollFix(visible)
      document.body.click()
    })
  }
  scrollFix(visible) {
    const dom = this.$el.querySelector('.el-select__tags');
    this.$nextTick(() => {
      if (!visible && dom) {
        dom.scrollTop = 0
      }
    })
  }
}
