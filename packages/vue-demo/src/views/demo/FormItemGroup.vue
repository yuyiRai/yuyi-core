<template>
  <div>
    <ElCommonForm2
      :model="cForm.model || form"
      :config="config"
      ref="store"
      :storeRef="getStore"
      :scopedSlots="$scopedSlots"
    />
    <slot></slot>
  </div>
</template>

<script>
/* eslint-disable */
import { CommonDto, ElCommonForm2, Utils } from '@yuyi/night'

export default {
  components: { ElCommonForm2 },
  props: {
    form: {},
    config: { default: Utils.stubArray },
    rules: {},
    name: {},
    size: String,
    noCollapse: {},
    required: false,
    columnCount: { default: 3 },
    showMessage: { default: true },
    useDto: { type: Boolean, default: false },
    viewOnly: { type: Boolean },
    dtoClass: { default: () => CommonDto },
    codeKey: { default: 'code' },
    labelKey: { default: 'label' },
    valueKey: { default: 'value' },
    addable: {},
    disabled: {}
  },
  inject: ['cForm'],
  computed: {
    className() {
      return Utils.isObjectFilter(_.last(this.config), {}).type === 'textarea' ? 'last-testarea' : ''
    },
    configIndexMap() {
      return [{}].concat(this.config).reduce((obj, item, index) => ({ ...obj, [item.code]: index - 1 }))
    },
    formItemMap() {
      const map = {}
      for (const key in this.configIndexMap) {
        const index = this.configIndexMap[key]
        const item = this.$refs.FormItem && this.$refs.FormItem[index]
        if (item) map[key] = item
      }
      return map
    },
    itemConfig: {
      get() {
        return this.transformConfigAndForm(this.config)
      },
      deep: true
    }
  },
  data() {
    return {
      store: null
    }
  },
  created() {
    this.cForm.groupMap.set(this, this.validate)
    // console.error(this.cForm, this)
  },
  beforeDestory() {
    this.cForm.groupMap.delete(this)
  },
  methods: {
    validate() {
      return this.store && this.store.validate()
    },
    getStore(store) {
      this.store = store
    },
    createDto(form) {
      const { dtoClass: Dto } = this
      return this.useDto && new Dto(form || this.form)
    },
    transformConfigAndForm(config) {
      return Utils.arrayMapDive(config, i => {
        i.code = i[this.codeKey]
        i.label = i[this.labelKey]
        i.value = i[this.valueKey]
        return i
      })
    }
  }
}
</script>

<style scoped>
.el-form-item__content > * {
  width: 100%;
}
</style>
<style>
.el-collapse-item__header {
  margin-bottom: 15px;
}
.el-collapse-item__header.is-active {
  border-bottom-color: #ebeef5 !important;
}
</style>

<style>
.filter-container .el-form-item.is-success .el-input__inner {
  border-color: #dcdfe6 !important;
}
.filter-container .is-active .el-input__inner,
.filter-container .el-input__inner:focus {
  border-color: #409eff !important;
}
.el-form-item--medium.el-form-item-textarea .el-form-item__content {
  height: auto !important;
}
.el-form-item--medium .el-form-item__content {
  height: 36px;
}
.last-testarea {
  margin-bottom: 35px !important;
}
.el-message-content {
  z-index: 2048;
  position: fixed;
}
</style>