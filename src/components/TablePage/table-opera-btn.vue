<template :v-if="operaBtn && operaBtn.length>0">
    <span >
      <slot name='pre-inline' :row='row'></slot>
      <template v-for="item in operaBtn">
        <el-button v-bind:key="item.code" v-show='item.hidden ? item.hidden(row) : true'  type="text" @click='$emit("todo", "inline", item.code, row)'>{{showText[item.code] || item.name}}</el-button>
      </template>
      <slot name='inline' :row='row'></slot>
    </span>
</template>

<script>
/* eslint-disable */

export default {
  computed: {
    operaBtn() {
      let list;
      if (this.include) {
        list = this.permissions.filter(
          item => this.exclude.indexOf(item.code) > -1
        );
      } else {
        list = this.permissions.filter(
          item => this.exclude.indexOf(item.code) == -1
        );
      }
      return list.sort((a,b)=>{
        // console.log(a.code,b.code)
        if(a.code.indexOf("edit")>-1){
          return -1
        } else if(b.code.indexOf("edit")>-1){
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
    row: {
      type: Object,
      required: true
    },
    showText: {
      type: Object,
      default: () => ({
        delete: "删除",
        edit: "编辑",
        push: "通知出单"
      })
    },
    include: { type: Array },
    exclude: {
      type: Array,
      default: () => ["add"]
    }
  },
  data() {
    return {};
  }
};
</script>
