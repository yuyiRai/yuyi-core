<script>
import Select from './Select.tsx'
export default {
  mixins: [Select]
}
</script>

<style lang="less">
// /deep/ .fixed-height {
.ant-select {
  max-height: 32px;
  padding-bottom: 12px;
  & /deep/ .ant-select-selection.ant-select-selection--multiple {
    max-height: 32px;
    overflow-y: hidden;
    margin-bottom: -12px;
    & /deep/ .ant-select-search__field__placeholder {
      margin-top: -4px;
    }
  }
}
// }
</style>
