<template>
  <a-card :bordered="false">
    <CommonForm :model="model" ref="form">
      <ItemGroup :config="config" :disabled="true" ref="form1">
        <a-button @click="handleTest">增加选项</a-button>
        <a-button @click="handleTest1">移除生日校验</a-button>
        <a-button @click="handleValidate">校验</a-button>
        <a-button @click="handleReset">表单重载</a-button>
      </ItemGroup>
    </CommonForm>
  </a-card>
</template>
<script>
/* eslint-disable */
import { Utils } from 'yuyi-core-night'
import CommonForm from './CommonForm'
import ItemGroup from './FormItemGroup'
import { model, config } from './demoConfig'

export default {
  components: { CommonForm, ItemGroup },
  data () {
    return {
      model,
      config
    }
  },
  computed: {
    store () {
      return this.$refs.form.store
    }
  },
  methods: {
    getStore (store) {
      this.store = store
    },
    handleTest() {
      console.log(this, this.config)
      // debugger
      this.config[10].options = [...this.config[10].options, 'qqq']
      this.config[11].options = [...this.config[11].options, 'qqq']
      this.config = [...this.config]
      // voiceroid.push('aaa')
    },
    //
    handleTest1() {
      console.log(this.store)
      this.config[0].rule = undefined
      this.config[3].rule = undefined
      this.config = [...this.config]
    },
    // 表单重载
    handleReset() {
      this.model = {}
    },
    handleValidate() {
      console.log(this)
      this.$refs.form.validate()
      console.log(this, this.store, this.store.formSource)
    }
  }
}
</script>
<style>
</style>
