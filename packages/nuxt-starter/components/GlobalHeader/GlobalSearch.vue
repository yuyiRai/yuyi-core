<template>
  <a-form class="search-wrap" :style="style">
    <a-input-search
      style="width: 60%"
      placeholder="请输入客户名称或证件号码"
      enterButton="客户视图查询"
    />
  </a-form>
</template>
<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'sidemenu'
    }
  },
  data () {
    return {}
  },
  created () {
    console.log(this.$store.state.app.layout)
  },
  computed: {
    style () {
      const style = {}
      if (this.mode === 'topmenu') {
        style.left = '0'
        style.top = '17px'
      } else {
        style.left = '25%'
        style.top = '0'
      }
      return style
    }
  }
}
</script>
<style lang="less" scoped>
  .search-wrap{
    position: relative;
    display: inline-block;
    width: 60%;
    min-width: 200px;
  }
</style>
