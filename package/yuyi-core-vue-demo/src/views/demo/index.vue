<template>
  <a-card :bordered="false">
    demo
  </a-card>
</template>
<script>
/* eslint-disable */
import { Utils } from 'yuyi-core-night'
import CommonForm from './CommonForm'
import ItemGroup from './FormItemGroup'
export default {
  components: { CommonForm, ItemGroup },
  data () {
    return {
      store: null
    }
  },
  method: {
    getStore (store) {
      this.store = store
    }
  }
}
</script>
<style>
</style>
