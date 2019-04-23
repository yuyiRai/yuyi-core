<template>
    <div class="opera-table-btn" :v-if="operaBtn">
      <template v-for="item in operaBtn">
        <el-button v-bind:key="item.code" :type="btnType[item.code]" @click='$emit("todo", "bar", item.code)' :disabled='disabled'>{{showText[item.code] || item.name}}</el-button>
      </template>
      <slot></slot>
    </div>
</template>

<script>
/* eslint-disable */

export default {
  computed: {
    operaBtn() {
      let list = null;
      if (this.include) {
        list = this.permissions.filter(
          item => this.include.indexOf(item.code) > -1
        );
      } else {
        list = this.permissions.filter(
          item => this.exclude.indexOf(item.code) == -1
        );
      }
      return list.sort((a,b)=>{
        console.log(a,b)
        if(a.code.indexOf("add")>-1){
          return -1
        } else if(b.code.indexOf("add")>-1){
          return 1
        } else {
          return 0;
        }
      })
    }
  },
  props: {
    permissions: {
      type: Array,
      required: true
    },
    btnType: {
      type: Object,
      default: () => ({
        add: "primary",
      })
    },
    disabled: { type: Boolean },
    showText: {
      type: Object,
      default: () => ({
        add: "新增",
        delete: "批量删除",
      })
    },
    include: {
      type: Array,
      default: () => ["add", "delete"]
    },
    exclude: { type: Array }
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
  .opera-table-btn{
    padding-bottom: 20px;
  }
</style>