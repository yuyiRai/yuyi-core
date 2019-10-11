import { likeArray } from '@yuyi/utils'
import get from 'lodash.get'
import { SlotsMixin } from '../../CommonMixins'
import SlotsWarpMixins from '../../CommonMixins/SlotsWarpMixins'
import { AntTable } from '../AntTable'
import { AutoWidthCell, CommonCell } from '../CommonCell'
import TablePropsMixins from '../STableProps'
import { TextRollMatcher } from '@/components/NoticeLine'

export const NTable = {
  mixins: [SlotsMixin, TablePropsMixins, SlotsWarpMixins],
  name: 'NSystemTable',
  /**
   * @model
   */
  model: {
    prop: 'selectedRowKeys',
    event: 'update:selectedRowKeys'
  },
  data() {
    return {
      needTotalList: [],

      localSelectedRows: [],
      localSelectedRowKeys: [],

      localLoading: true,
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination),
      tableWidth: 0
    }
  },
  created() {
    if (this.initialLoad) {
      console.log('loadT', this.initialLoad, 'this.initialLoad-----')
      this.initialLoadData()
    } else {
      this.localLoading = false
    }
  },
  updated() {
    this.$nextTick(() => {
      const el = this.$el.querySelector('.ant-table-body') || this.$el
      if (this.tableWidth !== el.offsetWidth) {
        this.tableWidth = el.offsetWidth
      } // 取得表格列整体宽度
      // console.log(this.tableWidth)
    })
  },
  watch: {
    selectedRowKeys(selectedRowKeys) {
      if (selectedRowKeys !== this.localSelectedRowKeys) {
        this.onSelectedChange(
          selectedRowKeys,
          this.dataSource.filter((row, index) => selectedRowKeys.includes(this.localRowKey(row, index)))
        )
      }
    },
    selectedRows(selectedRows) {
      if (selectedRows !== this.localSelectedRows) {
        this.onSelectedChange(selectedRows.map(this.localRowKey), selectedRows)
      }
    },
    dataSource: {
      immediate: true,
      handler(dataSource) {
        this.localDataSource = dataSource
      }
    },
    pageNum(val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize(val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger(val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    },
    loading(loading) {
      if (this.localLoading !== loading) {
        this.localLoading = loading
      }
    }
  },
  CommonCell: CommonCell,
  methods: {
    initialLoadData(pageNo = this.pageNum) {
      this.localPagination =
        this.showPagination === true &&
        Object.assign({}, this.localPagination, {
          current: pageNo,
          pageSize: this.pageSize,
          showSizeChanger: this.showSizeChanger,
          hideOnSinglePage: false,
          showTotal: total => <span>共 {total} 条</span>
        })
      this.needTotalList = this.initTotalList(this.columns)
      this.loadData()
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh(bool = false) {
      bool &&
        (this.localPagination = Object.assign(
          {},
          {
            current: 1,
            pageSize: this.pageSize
          }
        ))
      // 返回可用于异步等待
      return this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    async loadData(pagination, filters, sorter) {
      if (!this.initialLoad) {
        return
      }
      const parameter = Object.assign(
        {},
        {
          pageNum: (pagination && pagination.current) || this.localPagination.current || this.pageNum,
          pageSize: (pagination && pagination.pageSize) || this.localPagination.pageSize || this.pageSize
        },
        (sorter && sorter.field && { sortField: sorter.field }) || {},
        (sorter && sorter.order && { sortOrder: sorter.order }) || {},
        { ...filters }
      )
      this.$nextTick(() => {
        this.localLoading = true
        if (!this.dataInited && this.localDataSource.length === 0) {
          this.dataInited = true
          // 骨架datasource
          this.localDataSource = new Array(this._lastFetchedData ? this._lastFetchedData.length : parseInt(parameter.pageSize)).fill({})
        }
      })
      await this.preLoader()
      try {
        let r = await this.data(parameter)
        // debugger
        if (r instanceof Array) {
          r = {
            data: r,
            pageNo: 1,
            pageSize: r.length,
            total: r.length
          }
        }
        // 记录最后一次get到的datasource
        this._lastFetchedData = r.data
        // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
        // eslint-disable-next-line
        if (r.data.length === 0 && this.localPagination.current > 1) {
          this.localPagination.current--
          this.loadData(pagination, filters, sorter)
          return
        }
        // 这里用于判断接口是否有返回 r.totalCount 或 this.showPagination = false
        // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能

        // (!this.showPagination || !r.totalCount && this.showPagination === true) && (this.localPagination.hideOnSinglePage = true)
        this.localDataSource = r.data // 返回结果中的数组数据

        const nextSelectedKey = this.localSelectedRowKeys.filter(key => this.dataSourceKeys.includes(key))
        if (this.localSelectedRowKeys.length !== nextSelectedKey.length) {
          this.onSelectedChange(nextSelectedKey)
        }
        /**
         * 当前(页)的数据集更新
         * @type {Array<any>}
         */
        this.$emit('update:dataSource', this.localDataSource)

        // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
        this.localPagination = Object.assign({}, this.localPagination, {
          current: r.pageNum, // 返回结果中的当前分页数
          total: r.total, // 返回结果中的总记录数
          showSizeChanger: this.showSizeChanger,
          pageSize: (pagination && pagination.pageSize) || this.localPagination.pageSize
        })
      } catch (error) {
        // 新增错误捕获
        if (error) {
          if (error instanceof Error) {
            this.$message.error(error.message)
          } else {
            this.$message.error(error.statusText || error)
          }
        }
      } finally {
        // 无论错误与否都会停止Loading
        this.localLoading = false
      }
    },
    initTotalList(columns) {
      const totalList = []
      columns &&
        columns instanceof Array &&
        columns.forEach(column => {
          if (column.needTotal) {
            totalList.push({
              ...column,
              total: 0
            })
          }
        })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect(selectedRowKeys, selectedRows = this.dataSource.filter(row => selectedRowKeys.includes(this.localRowKey(row)))) {
      this.localSelectedRowKeys = selectedRowKeys
      this.localSelectedRows = selectedRows
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected() {
      if (this.useRowSelection) {
        this.onSelectedChange([], [])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear(callback) {
      if (this.localSelectedRowKeys.length <= 0) return null
      return (
        <a
          style="margin-left: 24px"
          onClick={() => {
            callback()
            this.clearSelected()
          }}
        >
          清空
        </a>
      )
    },
    renderAlert() {
      // 绘制统计列数据
      const needTotalItems = this.needTotalList.map(item => {
        return (
          <span style="margin-right: 12px">
            {item.title}总计{' '}
            <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
          </span>
        )
      })

      // 绘制 清空 按钮
      const clearItem =
        typeof this.alert.clear === 'boolean' && this.alert.clear
          ? this.renderClear(this.clearSelected)
          : this.alert !== null && typeof this.alert.clear === 'function'
            ? this.renderClear(this.alert.clear)
            : null

      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">
              已选择: <a style="font-weight: 600">{this.localSelectedRows.length}</a>
            </span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    },
    // 自定义tooltip
    renderCommonCell(value, record, index, column) {
      const customRender =
        column.customRender ||
        (column.scopedSlots && column.scopedSlots.customRender && this.$scopedSlots[column.scopedSlots.customRender])
      const { width = this.autoWidth, maxWidth = width, minWidth = width } = column
      // const Component = require('./index.js').default.CommonCell
      // console.error(width)
      const children = customRender ? customRender(value, record, index) : column.type === 'index' ? index : value
      const displayChildren = (
        <AutoWidthCell maxWidth={maxWidth + 'px'} minWidth={minWidth + 'px'}>
          {children}
        </AutoWidthCell>
      )

      return column.useRoll ? (
        <TextRollMatcher autoHidden>{children}</TextRollMatcher>
      ) : !customRender || column.useTooltip ? (
        <a-tooltip placement="top" destroyTooltipOnHide={true}>
          <span style={{ overflow: 'hidden' }}>{displayChildren}</span>
          <template slot="title">{children}</template>
        </a-tooltip>
      ) : displayChildren
      // return <Component value={value}/>
    },
    onSelectedChange(selectedRowKeys, selectedRows) {
      this.updateSelect(selectedRowKeys, selectedRows)
      this.emitPropsSelectedChanged()
    },
    emitPropsSelectedChanged() {
      const { rowSelection: config, localSelectedRowKeys: selectedRowKeys, localSelectedRows: selectedRows } = this
      let { selectedRowKeys: propsSelectedKeys = config.selectedRowKeys } = this
      if (!propsSelectedKeys) {
        propsSelectedKeys = config.selectedRowKeys
      }
      if (
        propsSelectedKeys &&
        propsSelectedKeys !== selectedRowKeys &&
        !likeArray(selectedRowKeys, propsSelectedKeys)
      ) {
        if (config instanceof Object) {
          const {
            rowSelection: { onChange }
          } = this
          onChange && onChange(selectedRowKeys, selectedRows)
          config.selectedRowKeys = selectedRowKeys
          if ('selectedRows' in config) {
            config.selectedRows = selectedRows
          }
        }
        if (this.selectedRowKeys) {
          /**
           * 当前选择的行(rowKey)更新
           * @type {Array<string>}
           */
          this.$emit('update:selectedRowKeys', selectedRowKeys)
        }
        if (this.selectedRows) {
          /**
           * 当前选择的行(数据集)更新
           * @type {Array<any>}
           */
          this.$emit('update:selectedRows', selectedRows)
        }
      }
    }
  },
  computed: {
    dataSourceKeys() {
      return this.localDataSource.map(record => this.localRowKey(record))
    },
    useRowSelection() {
      return (
        this.rowSelection instanceof Object ||
        this.selectedRows instanceof Array ||
        this.selectedRowKeys instanceof Array ||
        this.$listeners.selectAll ||
        this.$listeners.selectInvert
      )
    },
    localRowSelection() {
      // 判断组件使用选择时启用内部状态中转
      return (
        (this.useRowSelection && {
          selectedRows: this.localSelectedRows,
          selectedRowKeys: this.localSelectedRowKeys,
          onChange: this.onSelectedChange,
          selections: true,
          selectAll: this.$listeners.selectAll,
          selectInvert: this.$listeners.selectInvert
        }) ||
        null
      )
    },
    autoWidth() {
      const { columns = [] } = this.$props
      const [allCustomWidth, autoWidthCount] = columns.reduce(
        (r, column) => {
          const { maxWidth, minWidth = maxWidth, width = minWidth } = column
          if (width) {
            r[0] += parseInt(width)
            r[1] = r[1] - 1
          }
          return r
        },
        [0, columns.length]
      )
      const autoWidth = this.tableWidth - allCustomWidth - (this.useRowSelection ? 62 : 0)
      // console.error(autoWidth)
      return autoWidth / autoWidthCount + 'px'
    },
    showAlert() {
      return (
        (typeof this.alert === 'object' && this.alert !== null && this.alert.show && this.useRowSelection) || this.alert
      )
    },
    localColumns() {
      return (this.$props.columns || []).map((column, index, columns) => {
        const customRender = (value, record, rowIndex) => {
          // console.log(a, b, c)
          return this.renderCommonCell(value, record, rowIndex, column)
        }
        return {
          ...column,
          customRender: (text, row, rowIndex) => ({
            children: (
              <a-skeleton title={false} paragraph={{ rows: 1, width: '100%' }} loading={this.localLoading} active>
                {customRender(text, row, rowIndex)}
              </a-skeleton>
            ),
            attrs: {
              colSpan: this.localLoading ? (index === 0 ? columns.length : 0) : undefined
            }
          })
        }
      })
    },
    localRowKey() {
      let rowKey = this.$props.rowKey
      if (typeof rowKey === 'string') {
        const key = rowKey
        rowKey = (row, index) => row[key]
      }
      if (rowKey instanceof Function) {
        const inject = rowKey
        rowKey = (row, index) => {
          const injected = inject(row, index) || index
          return this.localLoading || !injected ? index : injected
        }
      }
      return rowKey
    },
    renderProps() {
      const props = {} as any
      const localKeys = Object.keys(this.$data)
      Object.keys((AntTable as any).props).forEach(k => {
        const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
        if (localKeys.includes(localKey)) {
          props[k] = this[localKey]
          return
        }
        if (k === 'rowSelection') {
          props.rowSelection = this.localRowSelection
          return
        }
        this[k] && (props[k] = this[k])
      })

      if (this.showPagination === false) {
        props.pagination = false
      } else {
        props.pagination = {
          ...props.pagination,
          pageSizeOptions: ['5', '10', '20', '30', '40', '50']
        }
      }
      props.columns = this.localColumns
      props.rowKey = this.localRowKey
      return props
    }
  },
  render() {
    // console.log('toTable', props)
    const table = (
      <AntTable {...{ props: this.renderProps, scopedSlots: { ...this.$scopedSlots } }} onChange={this.loadData}>
        {this.warpSlots()}
      </AntTable>
    )

    return (
      <div class="table-wrapper aml-stable">
        {this.showAlert ? this.renderAlert() : null}
        {table}
      </div>
    )
  }
}
export default NTable