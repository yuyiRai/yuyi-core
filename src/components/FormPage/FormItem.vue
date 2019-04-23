<script>
/* eslint-disable */
import FormItem from './FormItem.js'
export default FormItem;

</script>

<style scoped>
.use-item-col .el-form-item__content > * {
  width: 100%;
}
.el-form-item__content > .el-form-hover-deBtn {
    opacity: 0.5;
    position: absolute;
    right: -50px; 
    top: -1px;
    display:block;
    width: auto !important;
    transform: scale(0.95);
}
.el-form-item__content:hover > .el-form-hover-deBtn {
    opacity: 1;
}
</style>
<style>
.showInfoPanel .el-form-item > * {
  height: auto !important;
}
.address-input-item .el-col:nth-child(1) .el-input__inner {
  text-align: center;
}
.address-input-item .el-col:nth-child(2) .el-input__inner {
  text-align: center;
}
.address-input-item .el-col:nth-child(3) .el-input__inner {
  text-align: center;
}
.el-col {
    height: auto;
}
.el-form-item {
  margin-bottom: 20px;
}
/* .el-select.el-select--medium {
  max-height: 36px;
  overflow-y: scroll;
} */
.line-height-36 {
  width: 100%;
}
.line-height-36 .el-select__tags {
  max-height: 36px;
  overflow: hidden;
  padding: 2px;
  margin-top: -2px;
}
.line-height-36 .el-select__tags+.el-input > input {
  max-height: 36px;
}
.line-height-36 .el-select__tags+.el-input > input:hover {
  max-height: 56px;
}
.input-prefix-tag-text-1 input {
  padding-left: 35px !important;
}
.input-prefix-tag-text-2 input {
  padding-left: 50px !important;
}
.el-select .el-tag{
  margin: 2px !important;
}
</style>
<style lang='scss'>
.el-form-item.is-success  {
  .el-input__inner, .el-textarea__inner {
    border-color: #dcdfe6 !important;
  }
  .el-input__inner:focus, .el-textarea__inner:focus {
    border-color: rgb(66, 159, 255) !important;
  }
}
.el-form.viewOnly {
  .el-form-item__content, .el-form-item__label {
    height: auto;
  }
  .last-testarea .el-form-item-textarea {
    // margin: 0 1vw;;
  }
}
.el-form-item--mini {
  .el-form-item__content, .el-form-item__label {
    line-height: 28px;
    height: 32px;
  }
}
</style>