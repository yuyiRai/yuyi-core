<script>
import component from './component.tsx'
/**
 * 封装了数据加载的通用表格
 * @example ../README.md
 */
export default {
  extends: component
}
</script>
<style lang="less">
@import '../../index.less';
@import '../../CommonButton/index.less';

.aml-stable {
  .ant-table-body table {
    & > .ant-table-thead > tr > th {
      text-align: center !important;
    }
    & > .ant-table-tbody > tr > td {
      text-align: center !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      min-width: 65px;
      .ant-skeleton-paragraph {
        padding: 5px;
        margin: 0;
      }
      & *:not(li) > a:not(.ant-dropdown-link) {
        .link(0px);
      }
    }
  }
  
  .ant-table-row:nth-child(2n) {
    background: @primary-0;
  }
  .ant-table-thead {
    & > tr > th {
      background: fade(black, 5%);
      font-weight: unset;
    }
  }
  td {
    .ant-tag {
      cursor: default;
    }
  }
}
</style>
