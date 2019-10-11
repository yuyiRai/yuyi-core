// import { getOrgTree, getServiceList } from '@/api/manage'
import { queryOneCom } from '@/api/company'
import { querySubCom } from '@/api/rptpboc'
import { TreeSelect, Icon } from 'ant-design-vue'
import { map, filter, isEqual, pullAll, pullAllBy, castArray } from 'lodash'
import { mapGetters } from 'vuex'
import './TypeA.less'

export function getProps(mode, This) {
  switch (mode) {
    case 'tree':
      const div = document.createElement('div')
      div.style.position = 'static'
      let isMount = false
      let height = 0
      return {
        open: true,
        style: { opacity: 0 },
        getPopupContainer: node => {
          node.parentElement.appendChild(div)
          return div
        },
        dropdownClassName: 'treemenu',
        dropdownStyle: {
          overflow: 'auto',
          boxShadow: 'none',
          left: '0 !important',
          position: 'static !important',
          top: '0 !important',
          zIndex: 1,
          maxHeight: '100vh',
          minWidth: '10vw'
        },
        listener: () => {
          This.$refs.tree.$nextTick(() => {
            setTimeout(() => {
              // console.error('listener')
              height = This.rowContext.$el.offsetHeight + 'px'
              This.$el.querySelector('.treemenu').style.position = 'static'
              This.$el.querySelector('.treemenu').style.top = 0
              This.$el.querySelector('.treemenu').style.maxHeight = height
              if (!isMount) {
                // console.error('rowHeight', height)
                const style = { ...This.$el.querySelector('.treemenu').style }
                Object.defineProperty(style, 'top', {
                  get() {
                    return 0
                  },
                  set(v) {},
                  configurable: false
                })
                Object.defineProperty(style, 'position', {
                  get() {
                    return 'static'
                  },
                  set(v) {},
                  configurable: false
                })
                Object.defineProperty(style, 'maxHeight', {
                  get() {
                    return height
                  },
                  set(v) {
                    height = v
                  },
                  configurable: false
                })
                Object.defineProperty(This.$el.querySelector('.treemenu'), 'style', {
                  get() {
                    return style
                  },
                  configurable: false
                })
                isMount = true
              }
            }, 100)
          })
        }
      }
    default:
      return {
        style: { width: '100%' },
        getPopupContainer: () => document.body,
        dropdownStyle: { maxHeight: '400px', overflow: 'auto' },
        dropdownVisibleChange(e) {
          console.log(e)
        }
      }
  }
}

const levelKeyword = '_$$level'

export default {
  render(h) {
    const {
      multiple,
      disabled,
      nowLoading,
      placeholder,
      showCheckedStrategy,
      prop: { style, ...other }
    } = this
    const props = {
      props: {
        ...other,
        value: this.localComcodeSelected,
        treeExpandedKeys: this.openKeys
      },
      style,
      on: {
        ...this.on
      }
    }
    const children = (
      <a-tree-select
        ref="tree"
        class="ant-select-height-fixed"
        treeCheckable={multiple && true}
        disabled={disabled}
        showSearch
        placeholder={nowLoading ? '数据加载中...' : placeholder}
        allowClear
        showCheckedStrategy={showCheckedStrategy}
        multiple={multiple}
        loadData={this.appendLoadData}
        treeData={this.orgList}
        treeDataSimpleMode
        {...props}
      />
    )
    return this.useLoading ? this.useLoading(nowLoading, children, h) : children
    //   <a-spin spinning={nowLoading}>
    //     { children }
    //   </a-spin>
    // )
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      type: [Array, String],
      required: false
    },
    allowLevelKeyword: {
      type: Boolean,
      required: false
    },
    useParentShowOnly: {
      type: Boolean,
      default: false
    },
    useLoading: {
      type: Function,
      default: (loading, children, h) => {
        return <a-spin spinning={loading}>{children}</a-spin>
      }
    },
    mode: {
      type: String,
      default: ''
    },
    // 是否默认选中本级
    defaultSelected: {
      type: [Boolean],
      default: false
    },
    // 是否默认选中本级及下辖
    defaultSelectedAll: {
      type: [Boolean],
      default: true
    },
    levelKeyword: {
      type: String,
      default: levelKeyword
    },
    // 最大机构下级数
    levelLimited: {
      type: [Number],
      default: 0
    },
    placeholder: {
      type: String,
      default: '请选择操作机构'
    },
    // 相对于所属机构的最大机构下级数（(0|true)表示只允许当前及下级，每+1深入允许深入1级）
    levelRelativeLimited: {
      type: [Number, Boolean],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabledOption: {
      type: Function,
      default: () => false
    },
    // change值翻译器，传入整个节点的数据
    transform: {
      type: Function,
      default: null
    },
    transformFrom: {
      type: Function,
      default: null
    }
  },
  mounted() {
    if (this.mode === 'tree') {
      // Object.assign(this.$refs.tree.$props, this.prop)
      window.addEventListener('resize', this.prop.listener)
    }
  },
  updated() {
    if (this.mode === 'tree') {
      this.prop.listener()
    }
  },
  beforeDestroy() {
    if (this.mode === 'tree') {
      window.removeEventListener('resize', this.prop.listener)
    }
  },
  computed: {
    ...mapGetters(['comCode', 'comInfo']),
    localComcodeSelected: {
      get() {
        const value = this.multiple ? this.localComcodeList : this.localComcodeList[0]
        // console.log('computed localComcodeSelected', value)
        return value
      },
      set(code) {
        this.localComcodeList = code ? castArray(code).slice(0) : []
      }
    },
    nextComcodeList() {
      const transform = this.transform
        ? comcode => {
          const data = filter(this.orgList, { comcode })
          // console.error('transform prepare', data)
          return this.transform(data.length > 0 ? data[data.length - 1] : {})
        }
        : v => this.removeKeyword(v)
      const nextList = this.localComcodeList.map(code => {
        return transform(code)
      })
      return this.multiple ? nextList : nextList[0] || ''
    },
    optionsCodeList() {
      return map(this.orgList, 'comcode')
    },
    showCheckedStrategy() {
      return this.useParentShowOnly ? TreeSelect.SHOW_PARENT : TreeSelect.SHOW_CHILDREN
    }
  },
  inject: {
    rowContext: {
      default: () => null
    }
  },
  watch: {
    mode: {
      async handler(mode) {
        // alert(this.multiple)
        this.prop = getProps(mode, this)
      },
      immediate: true
    },
    nextComcodeList(nextValue) {
      this.emitValue(nextValue)
    },
    value: {
      async handler(comcodeList) {
        comcodeList = comcodeList ? castArray(comcodeList) : []
        if (!isEqual(comcodeList, this.localComcodeList.map(code => this.removeKeyword(code)))) {
          this.localComcodeList = this.transformFrom
            ? comcodeList.map(code => this.transformFrom(code, this.orgList))
            : comcodeList
        }
        // console.log(comcodeList, this.localComcodeList)
      },
      immediate: true
    },
    comCode: {
      async handler(comCode) {
        this.nowLoading = true
        this.orgList = []
        const rootAndUpperCode = [comCode]
        if (this.optionsInited) {
          this.localComcodeList = []
        }

        const getInitValue = function*() {
          // 默认选择当前机构本级或默认全选
          if (this.defaultSelected || (this.defaultSelectedAll && this.useParentShowOnly)) {
            // console.error('全选', this.useParentShowOnly ? [comCode] : [...this.optionsCodeList])
            this.localComcodeList = [this.setLevelKeyword(comCode)]
          } else if (this.defaultSelectedAll && this.useParentShowOnly) {
            this.localComcodeList = [comCode]
          } else if (this.defaultSelectedAll) {
            this.localComcodeList = yield true
          }
          this.emitValue(this.nextComcodeList)
        }

        try {
          const { comInfo } = this
          this.comInfoLevel = comInfo.orglevel
          const root = this.transformToCompanyItem(comInfo)
          this.orgList = [root]

          this.optionsInited = false
          const runInitValue = getInitValue.call(this)
          const r = runInitValue.next()
          await this.appendLoadData(root)
          if (r.value === true) {
            runInitValue.next([...this.optionsCodeList])
          }
          // init()
          // console.log(this.orgList)

          // 默认选择当前机构本级
          if (this.defaultSelected) {
            this.localComcodeList = [this.setLevelKeyword(comCode)]
          }
          // 默认全选
          if (this.defaultSelectedAll) {
            // console.error('全选', this.useParentShowOnly ? [comCode] : [...this.optionsCodeList])
            this.localComcodeList = this.useParentShowOnly ? [comCode] : [...this.optionsCodeList]
          }
          this.emitValue(this.nextComcodeList)
          const prepareCodeList = pullAll([...this.localComcodeList], this.optionsCodeList)
          if (prepareCodeList.length > 0) {
            rootAndUpperCode.push(...(await this.queryListParentTree(prepareCodeList, comCode)))
          }
          this.$nextTick(() => {
            this.openKeys = rootAndUpperCode
          })
          // console.log(this.localComcodeList, rootAndUpperCode, this.value, this)
          // console.log(this.$refs.tree)
          if (!this.optionsInited) {
            this.optionsInited = true
            this.finished = true
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.nowLoading = false
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      prop: {},
      optionsInited: false,
      openKeys: [],
      // 查询参数
      nowLoading: false,
      // 本机机构级别
      comInfoLevel: null,
      localComcodeList: [],
      orgList: [],
      selectedRowKeys: [],
      selectedRows: [],
      on: {
        change: value => {
          this.localComcodeSelected = value
        },
        treeExpand: keys => {
          // console.error(keys, this)
          this.openKeys = keys
        }
      }
    }
  },
  beforeCreate() {
    // this.$emit('update:value', this.comCode)
    console.log('beforeCreate', this)
    this.$store.commit('WAITING', this)
  },
  methods: {
    emitValue(nextValue) {
      if ((nextValue || false) !== (this.lastUpdateValue || false)) {
        this.lastUpdateValue = nextValue
        this.$emit('update:value', nextValue)
        this.$emit('change', nextValue)
        this.$emit('blur', nextValue)
      }
      this.$nextTick(() => {
        if (this.finished && !this.once) {
          this.$store.commit('FINISH', this)
          console.log('FINISH')
          this.once = true
        }
      })
    },
    async queryListParentTree(nextList, rootCode) {
      const prepareOptions = map(nextList, i => this.queryOneCom(this.removeKeyword(i, true)))
      const uppercomcodeList = []
      for await (const data of prepareOptions) {
        const comInfo = this.transformToCompanyItem(data)
        this.orgList.push(comInfo)
        const { uppercomcode } = data
        if (uppercomcode && uppercomcode !== rootCode) {
          uppercomcodeList.push(uppercomcode)
        }
      }
      const nextStageList = Array.from(new Set(uppercomcodeList))
      // const { true: newCodeList = [] } = groupBy(
      //   nextStageList,
      //   comcode => !this.optionsCodeList.includes(comcode)
      // )
      const newCodeList = nextStageList.filter(comcode => !this.optionsCodeList.includes(comcode))
      if (newCodeList.length > 0) {
        uppercomcodeList.push(...(await this.queryListParentTree(nextStageList)))
        // console.log('nextList', nextStageList)
      }
      for (const comcode of nextStageList) {
        const comInfo = this.orgList.find(org => org.comcode === comcode)
        await this.appendLoadData(comInfo)
      }
      return uppercomcodeList
    },
    async queryOneCom(comCode) {
      return this.$store.dispatch('GetOptions', [
        `queryOneCom:${comCode}`,
        () => queryOneCom(comCode).then(r => r.data),
        10000
      ])
    },
    async querySubCom(comCode, orglevel) {
      return this.$store.dispatch('GetOptions', [
        `querySubCom:${comCode}:${orglevel}`,
        () => querySubCom(comCode, orglevel),
        10000
      ])
    },
    async appendLoadData(node) {
      if (node.value === this.comCode && this.optionsInited) {
        return null
      }
      let nextChildren = []
      try {
        const comInfo = node.orglevel !== undefined ? node : await this.queryOneCom(node.value)
        if (!comInfo) {
          nextChildren = []
        }
        const { data } = await this.querySubCom(node.value, parseInt(comInfo.orglevel))
        nextChildren = data
        if (!Array.isArray(nextChildren) || nextChildren.length === 0) {
          nextChildren = []
        }
        // console.log(comInfo, node.value, nextChildren)
        const levelCom = {
          ...comInfo,
          comcode: this.setLevelKeyword(comInfo.comcode),
          comcname: comInfo.comcname,
          uppercomcode: comInfo.comcode,
          isLeaf: true
        }
        const nextList = [this.transformToCompanyItem(levelCom)]
        // console.log(comInfo, node.value, nextList)
        this.orgList = pullAllBy(this.orgList, nextChildren, 'comcode')
        for (const org of nextChildren) {
          // console.log(this.optionsCodeList, org, this.optionsCodeList.includes(org.comcode))
          nextList.push(this.transformToCompanyItem(org))
        }
        this.orgList = this.orgList.concat(nextList)
        // console.error(this.orgList)
        return
      } catch (e) {
        console.error(e)
        return
      } finally {
        if (nextChildren.length === 0) {
          const currentNode = this.orgList.find(org => org.value === node.value)
          if (currentNode) {
            currentNode.isLeaf = true
            this.orgList = this.orgList.slice(0)
          }
        } else {
          this.localComcodeList = this.localComcodeList.slice(0)
        }
      }
    },
    // 是否为允许搜索的最深级数
    isLevelLimited({ orglevel: level }) {
      const { levelLimited } = this
      if (levelLimited <= 0) {
        return false
      }
      // console.error(levelLimited, level)
      return parseInt(level) >= levelLimited
    },
    // 是否为允许搜索的最深级数（相对于自己的所属的级数）
    isLevelRelativeLimited({ orglevel: level }) {
      const { levelRelativeLimited: levelLimited, comInfoLevel } = this
      // console.error(levelLimited, comInfoLevel)
      if (levelLimited === false) {
        return false
      }
      return parseInt(level) >= parseInt(comInfoLevel) + (levelLimited === true ? 0 : levelLimited)
    },
    // 返回true表示已经无法再往下搜索（即叶子节点
    isLimited(org) {
      return this.isLevelLimited(org) || this.isLevelRelativeLimited(org)
    },
    renderIcon(icon) {
      return (this.mode === 'tree' && icon && <Icon type={icon} style={{ marginRight: '5px' }} />) || null
    },
    setLevelKeyword(id) {
      return id + this.levelKeyword
    },
    testKeyword(id) {
      return new RegExp(`${(levelKeyword || '').replace(/\$/gi, '\\$')}$`).test(id)
    },
    removeKeyword(id, force) {
      return force || (!this.allowLevelKeyword && this.testKeyword(id)) ? (id + '').replace(this.levelKeyword, '') : id
    },
    transformToCompanyItem(org) {
      const { disabledOption } = this
      const disabled = disabledOption(org) || false
      return {
        ...org,
        id: org.comcode,
        key: org.comcode,
        pId: org.uppercomcode !== org.comcode ? org.uppercomcode : null,
        value: org.comcode,
        isLeaf: this.isLimited(org) || org.isLeaf || false,
        disabled: disabled,
        title: (h, props) => {
          // console.log(this, props)
          let title = [org.comcname]
          if (this.testKeyword(org.comcode)) {
            title = [org.comcname, <b>- 本级 -</b>]
          }
          return (
            <span>
              <a-tooltip title={title[1] || title[0]}>
                <span class="antd-select-only">{title[0]}</span>
                <span class="antd-tree-list-only">
                  {this.renderIcon('folder')}
                  {title[1] || title[0]}
                </span>
              </a-tooltip>
            </span>
          )
        }
      }
    }
  }
}
