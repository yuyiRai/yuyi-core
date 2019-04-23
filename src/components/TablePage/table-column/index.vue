<template>
    <!-- 选择/序号列 -->
    <el-table-column class='table-input' v-if='i.type==="empty"' :key='-1' :label='""' :prop="'empty'" :width="i.width" align="center" :render-header='renderHeader'>
      <template></template>
    </el-table-column>
    <el-table-column v-else-if='["index","selection"].includes(i.type)' :reserve-selection='i.type==="selection"' :key='index' :label='i.label' :type='i.type' :width='i.width || "80px"' align="center"></el-table-column>
    <el-table-column  v-else :key='i.name + index' :label='i.label' :prop="i.name" :width="i.width" :sortable='useSort' align="center" :render-header='renderHeader'>
      <template slot-scope="scope"><span class='table-input'>
        <!-- 普通文字/自定义列 -->
        <template v-if="[undefined, 'text', 'textarea', 'number'].includes(i.type)" >
          <!-- {{getDtoValue(scope.row)}}
          {{scope.row}} -->
          <template v-if='i.slot!=null'>
            <slot :name='i.slot' :data='getDtoValue(scope.row)' :row='scope.row' :rowIndex='scope.$index'></slot>
          </template>
          <template v-else-if='editable(scope.row)'>
            <FormItem :ref='getRef(scope)' :i='itemConfig' :form='scope.row' :dto='getDto(scope.row)' :useColumn='false' style='width: auto !important;' @change='changeValue(scope.row, $event)' :col='3'/>
          </template>
          <template v-else>
            {{ getDtoValue(scope.row) }}
            <template >{{i.suffix}}</template>
          </template>
          <template v-if='i.suffixSlot' >
            <slot :name='i.suffixSlot' :data='getDtoValue(scope.row)' :row='scope.row' :rowIndex='scope.$index'></slot>
          </template>
        </template>

        <!-- 码表选择显示列 -->
        <template v-else-if='i.type==="select" || i.type==="search"' >
          <template v-if='i.slot!=null'>
            <slot :name='i.slot' :data='getDtoValue(scope.row)' :row='scope.row' :rowIndex='scope.$index'></slot> 
          </template>
          <FormItem :ref='getRef(scope)' v-else-if="editable(scope.row)" :i='itemConfig' :form='scope.row' :dto='getDto(scope.row)' :useColumn='false' style='width: auto !important;' @change='changeValue(scope.row, $event)' :col='3'/>
          <SelectColumn v-else :value='getDtoValue(scope.row, i.nameCode)' :options='i.options' />
          <template v-if='i.suffixSlot' >
            <slot :name='i.suffixSlot' :data='getDtoValue(scope.row)' :row='scope.row' :rowIndex='scope.$index'></slot>
          </template>
          <template >{{i.suffix}}</template>
        </template>

        <!-- 日期/日期时间列 -->
        <template v-else-if='i.type==="date" || i.type==="dateTime"'>
          <FormItem :ref='getRef(scope)' :viewOnly="!editable(scope.row)" :i='itemConfig' :form='scope.row' :dto='getDto(scope.row)' :useColumn='false' style='width: auto !important;' @change='changeValue(scope.row, $event)' :col='3'/>
        </template>

        <!-- 标签列 -->
        <el-tag v-else-if='i.type==="check"' :type="scope.row[i.name || 'validFlag'] === '1' ? 'success':'info'">{{ statusFilter(scope.row[i.name || 'validFlag'], i.filterMap) }}</el-tag>
        <!-- 标签列 2-->
        <el-tag v-else-if='i.type==="checks"' :type="scope.row[i.name || 'validFlag'] === '0' ? 'success':'info'">{{ statusFilters(scope.row[i.name || 'validFlag'], i.filterMap) }}</el-tag>
        <!-- 标签列 3-->
        <el-tag v-else-if='i.type==="checkarrs"' :type="scope.row[i.name || 'validFlag'] === '2' ? 'success':'info'">{{ statusFilterArrs(scope.row[i.name || 'validFlag'], i.filterMap) }}</el-tag>
        <template v-else>123</template>
      </span></template>
    </el-table-column>
</template>

<script>
/* eslint-disable */
import { parseTime } from '@/utils'
import SelectColumn from './select.vue'
import FormItem from '@/components/FormPage/FormItem.vue'
import CommonDto from '@/utils/Utils/CommonDto.js'
import FilterHeadUtil from './filterUtil.js'
import { observer } from 'mobx-vue'
export default observer({
    name: 'sp-table-column',
    components: { SelectColumn, FormItem },
    props: ['i', 'index', 'useSort', 'dataKey'],
    data() {
      return {
        filterUtils: new FilterHeadUtil((...param)=>this.$emit('onColumnFilter', ...param), this.i)
      }
    },
    inject: {
      getEditableRows: { type: Function },
      getDtoList: { type: Function },
      getDtoMap: { type: Function }
    },
    computed: {
      editable(){
        const { editable } = this.i
        const configEditable = (typeof editable === 'function') ? editable : () => (editable!==false)
        return row=> {
            const editableRows = this.getEditableRows()
            // console.log(row, this.getDto(row), editableRows, this.getDtoList())
            const dto = this.getDto(row)
            return configEditable(row) && dto && editableRows.find(i=>dto.equals(i))!= undefined
        }
      },
      itemConfig(){
        return Object.assign(this.i, {
            code: this.i.name, size:'small', col: 3, useLabel: false, autosize: true
        })
      },
      renderHeader() {
        if(this.i.useFilter)
            switch(this.i.type) {
                case 'dateTime':return this.filterUtils.renderFilterDateTitle;
                case 'date':return this.filterUtils.renderFilterDateTitle;
                default:return this.filterUtils.renderFilterSearch
            }
        return undefined
      }
    },
    methods: {
      getRef(scope) {
        return `form-row-${scope.$index}`
      },
      toComputedHandler(){
        // console.log(this)
      },
      getDto($index, debug) {
        const dtoList = this.getDtoList()
        const dtoMap = this.getDtoMap()
        // debug && console.log(dtoList, $index)
        // this.i.name==='submitTime' && console.log($index, dtoList, {...this.i}, (typeof $index === 'number') ? dtoList[$index] : dtoList.find(dto=>dto.equals($index)))
        return Utils.isNumber($index) ? dtoList[$index] : dtoMap.get($index)
      },
      getDtoValue($index, otherKey, refName) {
        let computedValue = Utils.isObject($index) && this.getComputedValue($index)
        if (computedValue !== false) {
          // console.log(this.i.name)
          // debugger;
          this.changeValue($index, computedValue);
          return computedValue;
        }
        const dto = this.getDto($index, !_.isNil(refName))
        if(!dto) {
          return _.get($index, this.i.name)
        }
        const value = dto && Utils.isFunction(dto.get) && dto.get(Utils.isNotEmptyStringFilter(otherKey, this.i.name), this.i.defaultValue)
        // console.log('get changeValue', dto, value, Utils.isNotEmptyStringFilter(otherKey, this.i.name))

        // this.i.name=='feeB1Tax' && console.log(value)
        return value===false ? undefined : value
      },
      changeValue(row, value, refName) {
        const dto = this.getDto(row, !_.isNil(refName))
        let isChange = false
        if(Utils.isNumber(this.i.numberControl)) {
          const value2 = parseFloat(parseFloat(value).toFixed(this.i.numberControl))
          isChange = dto.set(this.i.name, value2)
          this.$nextTick(()=>{
            const ref = this.$refs[refName]
            // console.log('ref', this, refName)
            // console.log('changeValue', row, value, value2)
            if (ref && ref.currentValue!==value2) {
                ref.$nextTick(() => ref.handleInputChange(value2))
                // console.log('isNumberControl')
            }
            this.$forceUpdate()
            // console.log('noNumberControl', refName, _.cloneDeep(row), this.i.label, ref, dto)
          })
        } else {
          isChange = dto.set(this.i.name, value)
          // console.log('noNumberControl', isChange)
        }
        return isChange && this.$emit('row-change', row)
        // debugger
      },
      getComputedValue(row){
        return Utils.isFunctionFilter(this.i.computed, () => false)(row)
      },
      statusFilter(status, statusMap) {
        statusMap = statusMap || {
          1: "有效",
          0: "无效"
        }
        if(typeof statusMap == "function"){
          statusMap = statusMap();
        }
        return statusMap[status];
      },
      statusFilters(status, statusMap) {
        if(status!=0){
          status=1;
        }
        statusMap = statusMap || {
          1: "有效",
          0: "无效"
        }
        return statusMap[status];
      },
      statusFilterArrs(status, statusMap) {
        statusMap = statusMap || {
          0:"初始状态",
          1:"支付中",
          2:"支付成功",
          3:"支付失败",
          4:"退款成功",
        }
        return statusMap[status];
      },
    }
})

</script>

<style scoped>
.filter-column {
    top: -52px;
    position: relative;
    left: 0;
    font-size: 20px;
    color: red;
    z-index: 9999999;
    width: 100%;
    height: 100%;
}
</style>
<style lang='scss'>
.table-input > * {
  line-height: 36px;
  position: relative;    
  margin: 0 5px;
}
.table-input > .el-table {
  margin: 0 !important;
}
.table-input {
  width: auto !important;
  .el-input__inner {
    text-align: center;
  }
  .el-date-editor.el-input {
    &.el-input, &.el-input__inner {
      width: auto !important;
    }
  }
  input, textarea {
    border: 0;
    background: transparent;
    border-bottom: 1px solid #EBEEF5;
    border-radius: 0;
  }
  .el-form-item--small {
    .el-form-item__content, .el-form-item__label {
      line-height: 36px;
      height: 36px;
    }
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom:0px;
  }
  .el-input-number.is-controls-right {
    .el-input-number__decrease, .el-input-number__increase{
      border: 0 !important;
      font-weight: bold;
      background: transparent;
      zoom: 1.5;
      i {
        right: -4px;
        position: relative;
      }
    }
    .el-input-number__decrease > i {
      top: 3px;
    }
    .el-input-number__increase > i {
      bottom: 3px;
    }
  }
}

.increase-only.el-input-number.is-controls-right {
  & .el-input-number__decrease {
    display: none;
  }
  & .el-input-number__increase {
    height: calc(100% - 2px) !important;
    border-bottom: 0;
    border-bottom-right-radius: 10px;
    i {    
      top: 6px;
      position: relative;
      &:before {
        content: "\E62B" !important;
      }
    }
  }
}
.el-form--inline {
  .el-form-item, .el-form-item__content {
    display: inline-block;
    vertical-align: middle !important;
  }
}
</style>