<template>
    <div class='common-table-page'>
      <slot name='page-top'></slot>
      <el-tabs type='card' :value="currentTab" v-if='tabConfig' @tab-click="onTabClick">
        <el-tab-pane v-for='(i, index) in tabConfig' :key='index' :disabled='disabled' :label='i.label || i.value || i' :name='i.value || i'>
          <template slot="label"> 
            <el-badge :hidden='!isNotNil(i.badge)' :value="i.badge" class="item">
              {{i.label || i.value || i}}
            </el-badge>
            <slot v-if='index+1 === tabConfig.length' name='tab-line-hint'></slot>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-collapse-transition>
        <div v-show="useQuery">
          <EpayQueryBar class="transition-box" v-if='queryConfig' :queryConfig="queryConfig" :param='listQueryParam' @filter='filterHandler' :disabled='disabled' />
        </div>
      </el-collapse-transition>
      <EpayOperaBar @todo='operaTodo' :permissions='permissions' :disabled='disabled'>
          <slot name='btn-bar'></slot>
      </EpayOperaBar>
      <slot name='table-header-addition'></slot>
      <EpayTable ref='tableInstance' :key='currentTab+""' :dataKey='dataKey' :tableConfig='dataConfig' :data='dataList' :editableRows='editableRows' :disabled='disabled' 
        :selectedList='selectedList' @onSelect='onSelect' @onCurrentChange='onCurrentChange' @onSortChange='onSortChange' @onColumnFilter='onColumnFilter'
        :useOperation='useOperation' :small='small'>
        <template v-for='slotName in tableColSlots' slot-scope='props' :slot='slotName'>
          <slot :name='slotName' :data='props.data' :row='props.row'></slot>
        </template>
        <template slot-scope='props' slot='inline'>
          <EpayTableOpera :row='props.row' @todo='operaTodo' :permissions='permissions'>
            <slot slot='pre-inline' name='pre-inline' :row='props.row'></slot>
            <slot slot='inline' name='inline' :row='props.row'></slot>
          </EpayTableOpera>
        </template>
      </EpayTable>
      <slot name='table-footer-addition'></slot>
      <EpayPagination v-show='listPageConfig.show===true' :small='small' :listQuery='listPageConfig' @pageChange='pageChange' :disabled='disabled'>
          <slot name='pagination'></slot>
      </EpayPagination>
      <slot name='page-bottom'></slot>
      <EpaySimpleDialog ref='dialog' @submit='submit' @close='onDialogClose' :dialogType='dialogType' :dialogConfig='dialogConfig'>
          <slot slot='title' name='dialog-title'></slot>
          <slot name='form'></slot>
          <slot slot='operaBtn' name='dialog-operaBtn'></slot>
      </EpaySimpleDialog>
    </div>
</template>

<script>
import TablePage from './TablePage.js'
export default TablePage

</script>
<style>
.common-table-page .el-tabs__nav-wrap.is-top, .common-table-page .el-tabs__nav-scroll {
  overflow: visible;
  height: 40px;
}
</style>
