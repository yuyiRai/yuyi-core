<template>
    <div class="pagination-container">
        <el-pagination ref='pageing'
            :key='config.page'
            :current-page="config.page || 1" 
            :page-sizes="pageSizes" 
            :page-size="config.pageSize || 20" 
            :total="config.pageCount || 0" 
            :disabled="disabled"
            :small="small"
            :pager-count="5"
            background 
            layout="total, sizes, prev, pager, next, jumper" 
            @size-change="handlePageSizeChange" 
            @current-change="handlePageCurrentChange"
        />
        <slot></slot>
    </div>
</template>
<script>
/* eslint-disable */
export default {
  computed: {
    config() {
      return this.listQuery || {}
    },
    pageSizes() {
      return [5,10,20,30,50,100]
    }
  },
  props: [
    "disabled", 
    "listQuery",
    "small",
  ],
  watch:{
    // listQuery: {
    //   handler(value, last){
    //     console.error(value)
    //     // if(!Utils.isEqual(value, last)){
    //     //   this.handleSubmit();
    //     // }
    //   },
    //   deep: true
    // }
  },
  data() {
    return {
    };
  },
  created(){
    console.log(this.listQuery)
  },
  methods: {
    handlePageSizeChange(val) {
      this.listQuery.pageSize = val;
      this.handleSubmit();
    },
    handlePageCurrentChange(val) {
      console.log(this.$refs.pageing)
      this.listQuery.page = val;
      this.handleSubmit();
    },
    handleSubmit() {
      this.$emit("pageChange");
    }
  }
};
</script>
<style>
.el-pagination .el-select .el-input .el-input__inner{
  height: 28px !important;
}

</style>
