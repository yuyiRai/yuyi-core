import { queryNationality } from '@/api/clientViews';
import { getOptions } from '@/config/formItemBase';
import { likeArray, castArray } from '@yuyi/utils';
import Select from 'ant-design-vue/es/select/index';
import debounce from 'lodash/debounce';
import pullAll from 'lodash/pullAll';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { boolOrParam } from './utils';
import FormItemSpin from '../CommonDataView/components/Containers/FormItemSpin';

const { placeholder, value } = Select.props

@Component({
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    options(options) {
      this.optionList = options
    },
    // value: {
    //   async handler(values) {
    //     const pvr = this.propValueReceive
    //     if (Array.isArray(values) && (!pvr && values.length > 0 && !likeArray(this._lastChangedValue, values))) {
    //       this.propValueReceive = true
    //       const list = await getOptions('NATIONALITY_PBOC', 1000)
    //       const r = []
    //       for (const value of values) {
    //         const search = list.find(option => option.value === value)
    //         search && r.push(search)
    //       }
    //       this.fetchPipe(r)
    //     }
    //     // console.error('load options', values)
    //   },
    //   immediate: true
    // }
  }
})
export class QueryInput extends FormItemSpin {
  @Prop(placeholder)
  placeholder: string;

  /**
   * 值
   */
  @Prop({ ...value, type: null })
  value: any;

  @Prop({ type: [Boolean, String], default: false })
  joinToStr: any;

  @Prop({ type: Boolean, default: true })
  multiple: any;

  // @Prop({ type: Array, default: null })
  // options: any[];

  @Watch('value', { immediate: true })
  async handleNextValueReceive(v: string[] | string) {
    const pvr = this.propValueReceive
    const values = castArray(v)
    if ((!pvr && values.length > 0) || !likeArray(this._lastChangedValue, values)) {
      this.propValueReceive = true
      const list = await getOptions('NATIONALITY_PBOC', 1000)
      const r = []
      for (const value of values) {
        const search = list.find(option => option.value === value)
        search && r.push(search)
      }
      this.fetchPipe(r)
    }
  }

  constructor(...args) {
    super(...args)
    this.handleSearch = debounce(this.handleSearch, 300)
  }
  optionList = []
  historyMap = {}
  loading = false
  propValueReceive = false
  lastSearchKey = null

  lastFetchId = 0
  _lastChangedValue = []


  get props() {
    const { placeholder } = this.$props
    return {
      ...this.$attrs,
      ...this.$props,
      options: undefined,
      placeholder: placeholder ? placeholder.replace("输入", "选择") : "请选择",
      notFoundContent: this.loading ? undefined : null,
      autoClearSearchValue: false,
      showSearch: this.multiple ? undefined : true,
      filterOption: false,
      allowClear: true,
      mode: this.multiple ? 'multiple' : undefined,
      labelInValue: false,
    }
  }
  get on() {
    return {
      change: this.handleChange,
      search: this.handleSearch,
      blur: this.onBlur
    }
  }
  get joinStr() {
    return boolOrParam(this.joinToStr, ',', String)
  }
  get currentList() {
    return (this.optionList || []).filter(option => new RegExp(this.lastSearchKey).test(option.label))
  }
  get historyList() {
    return pullAll([...(this.optionList || [])], this.currentList)
  }
  async created() {
    // const { optionList } = await queryNationality('')
    // console.error('created', optionList)
    this.handlePreload()
  }

  onBlur(e: MouseEvent) {
    this.$emit('blur', e)
  }
  onChange(value: any) {
    this.$emit('change', value)
  }
  onOptionListUpdate(value: any[]) {
    this.$emit('optionList:update', value)
  }
  fetchStart() {
    this.optionList = []
    this.lastFetchId += 1
    const fetchId = this.lastFetchId
    this.loading = true
    return fetchId
  }
  async handleSearch(key: string) {
    const fetchId = this.fetchStart()
    const { data: optionList } = await queryNationality(key)
    if (fetchId !== this.lastFetchId) {
      // for fetch callback order
      return
    }
    this.lastSearchKey = key
    this.fetchPipe(optionList && optionList.length ? optionList : [], key)
  }
  async handlePreload() {
    const { data: optionList } = await queryNationality('A')
    this.fetchPipe(optionList && optionList.length ? optionList : [], 'A')
  }
  fetchPipe(optionList: any[], key?: string) {
    const nextList = []
    for (const item of optionList) {
      const { configCode: value = item.value, configName: label = item.label } = item
      const nextItem = { key: value, label, value }
      nextList.push(nextItem)
      this.historyMap[value] = nextItem
    }
    this.historyMap = { ...this.historyMap };
    this.optionList = nextList;
    this.onOptionListUpdate(nextList);
    this.loading = false
  }

  handleChange(value: string[]) {
    this._lastChangedValue = [...value]
    this.onChange(value)
    this.$nextTick(() => {
      this.optionList = (Object.entries<any>(this.historyMap || {})).map(([key, { label }]) => {
        return { label, key }
      })
      this.historyMap = { ...this.historyMap }
      // console.log('change', value, this.historyMap)
    })
  }

}

export default QueryInput
