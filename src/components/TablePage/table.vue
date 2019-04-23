<template>
  <elForm ref='dataTableForm' class='table-input' inline :model='{list:data}'>
  <el-table ref='dataTable'  align="center" :data="data" :rowKey="dataKey" :expand-row-keys="expandRows"
      style="width: 100%" class="query-table" :show-header='showHeader' :summary-method='nativeSummaryFunc'
      stripe :fit='true' :border='!small' center 
      :highlight-current-row='false' :show-summary='showSummary'
      v-loading='disabled' element-loading-text="Please wait..."
      :row-style='rowStyle' :cell-style='cellStyle' :cell-class-name='getCellClassName' :header-cell-class-name='getCellClassName'
      :header-row-style='rowStyle' :header-cell-style='cellStyle'
      @sort-change='onSortChange'
      @selection-change="onSelect"
      @current-change='onCurrentChange'
  >
    <template v-for='(i, index) in config'>
      <el-table-column :key='index' v-if='i.type==="expand" && $scopedSlots.expand' type="expand" :v-show='false' :dataKey='dataKey'>
        <template slot-scope="scope" >
          <span :key='scope.$index'><slot name='expand' :rowIndex='scope.$index' :row='dtoList[scope.$index].$$___instance.dto' :dto='dtoList[scope.$index]'></slot></span>
        </template>
      </el-table-column>
      <ColumnItem v-else-if="slotList.length>0" ref='columnConfig' :key='i.name' :i='i' :index='index' :useSort='i.useSort || useSort' :data='data' @onColumnFilter='onColumnFilter' @row-change='onRowChange'>
        <!-- <template > -->
          <!-- <slot name='suffixSlot' :data='scope2.data' :row='dtoList[scope2.$index].$$___instance.dto' :index='scope2.index'></slot> -->
          <template v-for='(slotKey) in slotList' slot-scope='scope' :slot='slotKey' >
            <span :key='slotKey+index+scope.$index'>
              <slot :name='slotKey' :row='scope.row' :dto='dtoList[scope.rowIndex]'></slot>
            </span>
          </template>
        <!-- </template> -->
      </ColumnItem>
      <ColumnItem v-else ref='columnConfig' :key='i.name' :i='i' :index='index' :useSort='i.useSort || useSort' :data='data' @onColumnFilter='onColumnFilter' @row-change='onRowChange'/>
    </template>
    <!-- 自定义操作 -->
    <el-table-column label='操作' v-if="useOperation" align="center" :width='200'>
      <template slot-scope='scope'>
        <slot name='inline' :row='dtoList[scope.$index].$$___instance.dto' :index='scope.$index' :dto='dtoList[scope.$index]'></slot>
      </template>
    </el-table-column>
    <slot slot='append' name='append'></slot>
  </el-table>
  </elForm>
</template>
<script>
/* eslint-disable */
import ColumnItem from './table-column/index.vue'
import CommonDto from '@/utils/Utils/CommonDto.js'
import ElForm from '@/components/FormPage/CommonForm.js'

const defaultKeyByIndexName = '$$$_____defineIndex'

export default {
  components: { ColumnItem, ElForm },
  computed: {
    slotList(){
      return (Object.keys(this.$scopedSlots || {}) || []).concat(Object.keys(this.$slots || {}) || []).filter(name=>name!=='inline')
    },
    config() {
      return this.tableConfig.filter(i=>!i.hidden)
    },
    getSlots(){
      return (i)=>{
        console.log(Object.keys(i).filter(key=>key.indexOf("slot")>-1 || key.indexOf("Slot")>-1))
        return Object.keys(i).filter(key=>key.indexOf("slot")>-1 || key.indexOf("Slot")>-1)
      }
    }
  },
  updated(){
    // console.log(this.slotList)
  },
  provide() {
    return {
      'getEditableRows': () => this.editableRows,
      'getDtoList': () => this.dtoList,
      'getDtoMap': () => this.dtoMap
    }
  },
  props: {
    editableRows: { type: Array, default: Utils.stubArray },
    isEditInit: { type: Boolean, default: false },
    useSort: { type: Boolean, default: false },
    tableConfig: { type: Array, required: true },
    small: Boolean,
    childrenKey: {
      type: [String, Function]
    },
    showSummary: Boolean,
    summaryMethod: {
      type: Function,
    },
    data: { type: Array, default: () =>[]},
    disabled: Boolean,
    dataKey: { type: [String, Function], default: defaultKeyByIndexName },
    showHeader: { type: Boolean, default: true },
    cellClassName: { type: Function },
    rowStyle: {
      type: Function,
      default: function ({row, rowIndex}) {
        // console.log(row, rowIndex)
        const base = { padding: 0 };
        const currentTime = new Date().getTime();
        switch((row||{}).taskStatusChangeEfficiencyStatus){
          case '1': base.color = 'black'; break;
          case '2': base.color = 'orange'; break;
          case '3': base.color = 'red'; break;
          default: break;
        }
        // if()
        return base
      }
    },
    cellStyle: {
      type: Function, 
      default: () => (function ({column, columnIndex, row, ...other})  {
        // console.log({label: column.type, column: {...column} , row, columnIndex, ...other}, column.rowConfig[columnIndex+1] && column.rowConfig[columnIndex+1].type == 'expand')
        const base = { padding: 0 }
        if(row instanceof Array) {
          column.rowConfig = row;
        }
        if(column.rowConfig && column.rowConfig[columnIndex+1] && column.rowConfig[columnIndex+1].type == 'expand'){
          return {...base, 'border-right': '0 !important'};
        }
        return base
      })
    },
    useOperation: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      selectedList: [],
      dtoList: [],
      dtoMap: new WeakMap(),
      expandRows: []
    }
  },
  
  watch: {
    data: {
      handler(list) {
        // this.selectRowsBySelectedList();
        // console.log('update', this.dataKey)
        this.dtoList = []
        _.forEach(Utils.isArrayFilter(list, []), (row, index) => {
          this.registerDtoAndRow(row, this.convertToDto(row, index))
        })
        // console.log(this.dtoList)
        // 刷新数据时手动维持选中状态
      },
      immediate: true
    },
  },
  created() {
    // console.log(this.tableConfig);
    if(this.isEditInit){
      Utils.isEmptyArray(this.data) && this.data.push({})
      Utils.isEmptyArray(this.editableRows) && this.editableRows.push({})
    }
  },
  methods: {
    convertToDto(row, index, parentIndex) {
      this.defineDefaultDataKey(row, this.dataKey, `row${_.isNil(parentIndex)?"":`-${parentIndex}`}-${index}`)
      if(!_.isNil(this.childrenKey) && !Utils.isArray(row.children)){
        Reflect.defineProperty(row, 'children', {
          get: () => row[this.childrenKey],
          set: (list) => row[this.children] = Utils.isArrayFilter(list, []),
          enumerable: false,
          configurable: true
        })
        if (Utils.isArray(row.children)) {
          _.forEach(row[this.childrenKey], (r, cIndex) => {
            this.registerDtoAndRow(r, this.convertToDto(r, cIndex, index))
          })
        }
      }
      return new CommonDto(row)
    },
    registerDtoAndRow(row, dto) {
      this.dtoList.push(dto)
      this.dtoMap.set(row, dto)
    },
    defineDefaultDataKey(row, dataKey, keyValue) {
      if(_.isNil(row[dataKey]) || /^row((-([0-9]+))+)$/.test(row[dataKey])) {
        Reflect.defineProperty(row, dataKey, {
          value: keyValue,
          enumerable: false,
          configurable: true
        })
        // console.log('set default key', _.cloneDeep(row))
      }
    },
    getCellClassName(prop){
      const { row, column, rowIndex, columnIndex } = prop;
      const { cellClassName } = this;
      const defaultClassName = ''
      return Utils.zipEmptyData([
        Utils.isFunction(cellClassName) ? cellClassName(prop, defaultClassName) : null,
        defaultClassName,
        Utils.isObjectFilter(this.tableConfig[columnIndex], {}).className
      ]).join(' ')
    },
    onRowChange(row, a) {
      // console.log('row-change', row, _.findIndex(this.data, row), this)
      // this.data[_.findIndex(this.data, row)] = {...this.data[_.findIndex(this.data, row)]}
      this.$emit("row-change", row, a)
    },
    toComputedHandler(){
      // console.log(this.$refs.columnConfig)
      this.$refs.columnConfig.forEach(i=>i.toComputedHandler())
      this.$forceUpdate()
    },
    onSortChange(propName, method) {
      // 当任意列进行排序操作
      this.$emit("onSortChange", propName, method);
    },
    onSelect(selectedList, ...o) {
      // 当表格行被选中
      // console.error(...o)
      this.selectedList = selectedList
      this.$emit("onSelect", selectedList);
    },
    onColumnFilter(columnName, data) {
      this.$emit('onColumnFilter', columnName, data)
    },
    // Table 组件提供了单选的支持，只需要配置highlight-current-row属性即可实现单选。之后由current-change事件来管理选中时触发的事件，它会传入currentRow，oldCurrentRow。
    onCurrentChange(currentRow, oldRow) {
      this.$emit('onCurrentChange', currentRow, oldRow)
    },
    toggleRowSelection(row, check) {
      this.$refs.dataTable.toggleRowSelection(row, check);
    },
    toggleRowChildren(row, expaned) {
      let index = Utils.isNumberFilter(row, _.indexOf(this.data, row))
      row = this.data[index];
      if(Utils.isObject(row) && Utils.isArray(row.children)) {
        this.$nextTick(()=>{
          const domList = this.$el.querySelectorAll('tbody .el-table__row.el-table__row--level-0 .el-table__expand-icon');
          const dom = domList[index]
          if(dom){
          const classIndex = dom.className.indexOf('el-table__expand-icon--expanded')
          if((expaned === true && classIndex===-1)||(expaned === false && classIndex > -1)) {
            dom.click()
            // console.log('todo-expended', dom.className)
          } 
          // else {
          //   // console.log('is-expended', dom.className, dom.className.indexOf('el-table__expand-icon--expanded'))
          // }
          }
        })
      }
      this.$refs.dataTable.toggleRowExpansion(row, expaned)
    },
    toggleRowExpansion(row, expaned) {
      this.$refs.dataTable.toggleRowExpansion(row, expaned)
    },
    forceUpdate(){
      this.$refs.dataTable.$forceUpdate()
    },
    selectRowsBySelectedList() {
      if(Utils.isArray(this.data)){
        //根据selectedList选择行
              // console.log(this.dataKey, this.selectedList, [...this.dat)
        for (let i of this.selectedList) {
          for (let item of this.data) {
            setTimeout(() => {
              //异步执行选中，防止因事件执行顺序被挤掉
              if (i[this.dataKey] == item[this.dataKey]) {
                this.toggleRowSelection(item, true);
              }
            }, 0);
          }
        }
      }
    },
    nativeSummaryFunc({ columns, data, ...other }) {
      // console.log(data)
      return _.map(columns, (col, index)=>{
        if(index==0){
          return '合计'
        } else if(Utils.isNil(col.property)){
          return ''
        }
        const colConfig = this.tableConfig[index];
        const sum = _.reduce(this.dtoList,(sum,dto)=>sum+Utils.isNumberFilter(parseFloat(dto.get(col.property)), 0),0);
        const sumStr = Utils.isNaN(sum)? '-' : sum.toFixed(Utils.isNumberFilter(colConfig.numberControl, 0))

        return `${sumStr}${Utils.isNil(colConfig.suffix) ? '' : ` ${colConfig.suffix}`}`
      })
    },
    validate() {
      console.log(this.$refs.dataTableForm)
      return this.$refs.dataTableForm.validate()
    }
  }
};
</script>
<style>
.el-table--medium td, .el-table--medium th {
  padding: 0;
}
</style>
<style lang='scss'>
.table-input {
  .el-button--text {
    padding: 0 !important;
  }
}
</style>