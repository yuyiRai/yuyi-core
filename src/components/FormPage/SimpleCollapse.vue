<template>
  <div v-if='noCollapse'><slot></slot></div>
  <el-collapse v-else value="show" accordion>
    <el-collapse-item :name="'show'" >
      <template slot="title">
        <i class="header-icon el-icon-menu"></i>
        <span :class="'simple-collapse-title'+(required?' required':'')">
          {{ name }}
          <slot name="title" />
          <span style="float:right">
            <slot name='title-right' />
          </span>
        </span>
      </template>
      <slot></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    "name": {}, 
    "noCollapse": {}, 
    "required": false
  },
  data() {
    return {
      collapse: this.name
    };
  },
};
</script>

<style>
.el-collapse-item__header {
    margin-bottom: 15px;
}
.el-collapse-item__header.is-active {
    border-bottom-color: #ebeef5 !important;
}
.simple-collapse-title.required:before {
    content: '*';
    color: #F56C6C;
    /* margin-right: 4px; */
}
</style>
