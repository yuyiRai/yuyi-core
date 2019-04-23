<template>
  <div class="filter-container">
    <el-form ref="dataForm" class='query-bar-form' :model="param" label-width="100px" size="mini">
      <el-row style="margin-bottom: 10px; padding-right: 1vw;">
        <el-row :gutter="5" :type='queryTable<3?"flex":undefined' align='middle'>
          <template v-for="(i, index) in config">
            <FormItem size='small' ref="dataFormItem" :key='index' :form='param' :i='i' :show-message='true' :columnCount='3' @onItemChange='$emit("onItemChange", $event)'>
              <template :slot='i.slot' slot-scope="props">
                <slot :name='i.slot' :col='props' :config='i'></slot>
              </template>
            </FormItem>
          </template>
          <el-col v-if='queryTable<3' :style="{textAlign: 'left',marginBottom:'20px'}">
            <el-button type="primary" size="mini" @click='handleFilter' :disabled='disabled' v-waves>查询</el-button>
            <el-button @click='handleClearFilter' size="mini" :disabled='disabled' v-waves>重置</el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-form>
    <div v-if="queryTable>=3" :style="{marginBottom: '25px', textAlign: 'center'}">
      <template>
        <el-button type="primary" @click='handleFilter' :disabled='disabled' v-waves>查询</el-button>
        <el-button @click='handleClearFilter' :disabled='disabled' v-waves>重置</el-button>
      </template>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import 'element-ui/lib/theme-chalk/display.css';
import waves from '@/directive/waves' // 水波纹指令
import FormItem from '../FormPage/FormItem.vue'
// import elForm from '../FormPage/CommonForm.js'
export default {
  components: { FormItem },
  // render(h, context) {
  //   const Form = (size) => this.config.map((i,index) => {
  //     const scopedSlots = {
  //       default: (props) => (
  //         <template slot={i.slot}>{this.$scopedSlots.default({
  //           name: i.slot,
  //           col: props,
  //           config: i
  //         })}</template>
  //       )//(<slot slot={i.slot} name={i.slot} col={props} config={i} />)
  //     }
  //     return (
  //       <FormItem size={size} ref="dataFormItem" key={index} form={this.param} i={i} showMessage={true} columnCount={3} 
  //        onOnItemChange={(...param) => this.$emit("onItemChange", ...param)} {...{ scopedSlots: scopedSlots }} />
  //     )
  //   })
  //   const {disabled} = this
  //   const buttons = (
  //     <elCol style={{textAlign: 'right'}}>
  //       <elButton type="primary" size="mini" onClick={this.handleFilter} disabled={disabled} v-waves>查询</elButton>
  //       <elButton onClick={this.handleClearFilter} size="mini" disabled={disabled} v-waves>重置</elButton>
  //     </elCol>
  //   );
  //   return (
  //     <div class="filter-container">
  //       <elForm ref="dataForm" model={this.param} label-width="100px" size="mini">
  //         <elRow style="margin-bottom: 10px; padding-right: 1vw;">
  //         <elCol key='md' lg={24} class='hidden-xl-only'>
  //           <elRow gutter={0} >
  //             { Form('small') }
  //             { this.queryTable<3 && buttons }
  //           </elRow>
  //         </elCol>
  //         <elCol key='lg' xl={24} class='hidden-lg-and-down' >
  //           <elRow gutter={50} >
  //             { Form('medium') }
  //             { this.queryTable<3 && buttons }
  //           </elRow>
  //         </elCol>
  //         </elRow>
  //       </elForm>
  //       { this.queryTable>=3 && <div style={{marginBottom: '25px', textAlign: 'center'}}>
  //         <elButton type="primary" onClick={this.handleFilter} disabled={disabled} v-waves>查询</elButton>
  //         <elButton onClick={this.handleClearFilter} disabled={disabled} v-waves>重置</elButton>
  //       </div> }
  //     </div>
  //   )
  // },
  data() {
    return{
        value12:'',
        defaultdate:'2018-10-26'
      }
    }
  ,
  directives: {
    waves
  },
  watch: {
    'config'(v){
      // console.log('queryConfigUpdate', v)
      // this.config = v.map(this.toFormItem)
      // console.log(this.config)
    }
  },
  computed: {
    config(){
      return this.queryConfig.map(this.toFormItem)
    },
    queryTable() {
      let length = 0
      this.queryConfig.forEach(config=>{
        length += (config.col || 1)
      })
    //   const list = [[], [], [], []];
    //   let row = 0;
    //   let col = 0;
    //   let colMax = 16;
    //   for (let i of this.queryConfig) {
    //     let currentCol = i.col || 7;
    //     if (col + currentCol < colMax ) {
    //       col += currentCol;
    //     } else if(colMax==16){
    //       col += currentCol;
    //       colMax = 24;
    //     } else {
    //       row++;
    //       col = currentCol;
    //     }
    //     list[row].push(i);
    //   }
    //   return list.filter(line => line.length > 0);
      return length
    }
  },
  mounted(){
    // if(!this.isPlaceholder()){
    //   setTimeout(()=>{
    //     var app = document.querySelectorAll("input[placeholder]");
    //     for(var i of app){
    //       const placeholder = i.getAttribute("placeholder");
    //       console.log(i,i.getAttribute("placeholder"));
    //       if(i.value==""){
    //         i.value = placeholder
    //       }
    //       i.addEventListener("blur",(e)=>{
    //         setTimeout(this.onBlur.bind(this, e),100)
    //       })
    //       i.blur();
    //       i.addEventListener("focus",(e)=>{
    //         console.log(e.target)
    //       })
    //     };
    //   },100)
    // }
  },
  props: {
    queryConfig: {
      type: Array,
      default: () => [
        { name: "代码", code: "code" },
        { name: "名称", code: "name" }
      ]
    },
    param: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // config: [...this.queryConfig]
    }
  },  
  created() {
    this.handleClearFilter();
  },
  methods: {
    toFormItem(i) {
      // i.label = i.name
      // return i
      const { name, ...other } = i
      return { label: name, ...other }
    },
    async handleFilter() {
      try {
        // console.log('valid', this.param)
        if(!(await Promise.race([this.doValidate(), new Promise(r=>setTimeout(()=>r(true), 200))]))){
          throw new Error()
        }
        // if(!(await this.doValidate())){
        //   throw new Error()
        // }
        // console.log('valid end')
        return this.$emit("filter", this.param);
      }catch(e){
        // console.error(e)
        this.$message.error('请正确输入查询条件')
      }
    },
    handleClearFilter() {
      for (let i of this.queryConfig) {
        // console.log(i)
        i.code.split('|').forEach((code)=>this.param[code] = i.value!=null ? i.value : undefined);
      }
      if(this.$refs.dataForm)
        this.$refs.dataForm.resetFields()
      console.log(this.param)
      this.$emit("filter", this.param, true);
    },
    async doValidate() {
      return await this.$refs.dataForm.validate()
    },
    isPlaceholder() {
        var input = document.createElement('input');
        return 'placeholder' in input;
    },
    // onBlur(e){
    //   if(e.target.value == ""){
    //     e.target.value = e.target.getAttribute("placeholder")
    //     e.target.style.color= "#999"
    //   console.log("ibput")
    //   } else if(e.target.value != e.target.getAttribute("placeholder")){
    //     console.log("default")
    //     e.target.removeAttribute("style")
    //   }
    // }
  }
};
</script>
<style>
.filter-container .el-form-item.is-success .el-input__inner {
  border-color: #dcdfe6 !important;
}
.filter-container .is-active .el-input__inner,.filter-container .el-input__inner:focus { 
  border-color: #409EFF !important;
}
</style>
<style scoped>
.el-form-item__content > * {
  width: 100%;
}
.el-form-item {
  margin-bottom: 0vh;
}
.el-col {
    max-height: 50px;
}
</style>
