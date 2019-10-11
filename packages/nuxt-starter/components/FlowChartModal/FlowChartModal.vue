<template>
  <a-card class="page-largedata-list" :bordered="false">
    <a-row :class="{ completed, success: core.success, failed: core.failed }">
      <a-col :span="completed && false ? 4 : 24">
        <a-alert
          showIcon
          v-if="core.flowChartData && core.flowChartData.taskVoList"
          :type="(completed ? 'success': undefined)"
        >
          <span slot="message">
            <a>
              <b>{{core.chartTitle}}</b>
            </a>
          </span>
          <span slot="description">
            <flow-chart-steps
              component="antd"
              :completed="core.completed"
              :success="core.success"
              :failed="core.failed"
              :pointConfigList="core.pointConfigList"
              :currentPoint="core.currentPoint"
            />
          </span>
        </a-alert>
      </a-col>
      <a-col :span="completed && false ? 20 : 24">
        <h2>审核轨迹</h2>
        <s-table
          style="margin-top: 10px;"
          ref="table"
          :rowClassName="rowClassName"
          :loading.sync="core.loading"
          size="small"
          :columns="columns"
          :data="localLoadData"
          :dataSource.sync="core.dataSource"
          :showPagination="false"
        ></s-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import Table from './FlowChartModal.tsx'
import Vue from 'vue'
export function installVant() {
  // try {
  //   const { Steps, Step, Icon, Tag } = require('vant')
  //   require('vant/lib/index.css')
  //   Vue.use(Step)
  //     .use(Steps)
  //     .use(Tag)
  //     .use(Icon)
  // } catch (e) {}
}

installVant()
export default Table
</script>

<style scoped lang="less">
.table-wrap {
  margin-top: 10px;
}
.operation-wrap {
  text-align: center;
  margin-bottom: 10px;
  & > * {
    vertical-align: middle;
  }
}
</style>
<style lang="less">
.page-largedata-list {
  .ant-alert-success .ant-alert-message {
    a {
      color: #3f8d18;
    }
    a:hover {
      color: #52c41a;
    }
  }
  tr.current {
    font-weight: bold;
    color: #1890ff;
  }
  .completed {
    tr.current {
      color: #3f8d18;
    }
    &.failed tr.current {
      color: #f5222d;
    }
  }
  .ant-table-small {
    border-width: 0;
  }
}
</style>
