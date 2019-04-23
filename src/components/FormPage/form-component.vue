<template>
  <SimpleCollapse :name='name' :noCollapse='noCollapse' :required='required'>
    <slot name="title" slot='title'></slot>
    <slot name='title-right' slot='title-right'></slot>
    <template>
      <el-row :key='itemConfig.length' :span="24" :gutter="0" :style="noCollapse ? {margin:'2vw 0'}: {marginBottom: '0px',width: '95%'}" :class='className'>
        <template v-for="(i, index) in itemConfig.filter(item=>item)">
          <Item :viewOnly='viewOnly' ref='FormItem' :size='size' :dto='mainDto' :key='index+1' :form='groupForm' :i='i' :disabled='disabled' :rules='rules' :showMessage='showMessage!=false?true:showMessage' :columnCount='columnCount' @onItemChange='onItemChange' @onItemDelete='onItemDelete'>
            <template :slot='i.slot' slot-scope="props">
              <slot :name='i.slot' :col='props' :config='i'></slot>
            </template>
          </Item>
        </template>
        <Item :size='size' v-if='addable && additionItem && !viewOnly' :form='groupForm' :dto='mainDto' :i='additionItem' :disabled='disabled' :rules='rules' :showMessage='showMessage!=false?true:showMessage' :columnCount='columnCount' @onItemChange='onItemChange'>
          <template :slot='additionItem.slot' slot-scope="props">
            <slot :name='additionItem.slot' :col='props' :config='additionItem'></slot>
          </template>
        </Item>
        <slot></slot>
      </el-row>
    </template>
  </SimpleCollapse>
</template>

<script>
/* eslint-disable */
import Item from './FormItem.vue'
import SimpleCollapse from './SimpleCollapse.vue'
import EventEmitter from '@/utils/EventEmitter'
import CommonDto from '@/utils/Utils/CommonDto.js'
export default {
  components: { SimpleCollapse, Item },
  props: {
    "form": {}, 
    "config": { default: Utils.stubArray }, 
    'rules': {}, 
    "name": {}, 
    "size": String,
    "noCollapse": {}, 
    "required": false,
    "columnCount":{ default: 3 }, 
    "showMessage":{ default: true }, 
    "useDto": { type: Boolean, default: false},
    "viewOnly": { type: Boolean },
    "dtoClass": { default: () => CommonDto},
    "codeKey": { default: 'code'}, 
    "labelKey": { default: 'label'}, 
    "valueKey": { default: 'value'}, 
    "configAndForm" : { },
    "addable": { },
    "disabled": {}
  },
  provide() {
    return {
      dto: this.mainDto,
      onItemChangeEmit: new EventEmitter(),
      onItemConfigChangeEmit: new EventEmitter(),
      beforeDestroyEmitter: new EventEmitter()
    }
  },
  beforeDestroy(){
    return this.beforeDestroyEmitter && this.beforeDestroyEmitter.once(true)
  },
  watch: {
    form:{
      handler(form){
        this.mainDto = this.createDto(form)
        // console.log('dto', this.mainDto)
      },
      immediate: true
    },
    configAndForm: {
      handler(config, last){
        this.onConfigUpdate(config, last)
        return config && config.forEach(i=>i.useDelete=true)
      },
      deep: true,
      immediate: true
    },
    addable:{
      handler(config){
        if(config) {
          const { onClick, ...other } = (typeof config=='object')?config:{};
          this.additionItem = { 
            useAdd: true, label: '新增项名称',
            onClick: async(code, label) => {
              // console.error(code, label)
              if(code) {
                // const a`dd = this.itemConfig.pop()
                if(this.configAndForm.find(item=>item[this.codeKey]===code)) {
                  this.$message.error('输入项不能重复！')
                  return 
                }
                console.log(code)
                const config = { useDelete: true, [this.codeKey]: code, [this.labelKey]: label || code, [this.valueKey]: '' }
                this.$set(this.configAndForm, this.configAndForm.length, config)
                this.$set(this.itemConfig, this.itemConfig.length, this.transformConfigAndForm([config])[0])
                // this.itemConfig.push(add)
                onClick ? onClick(code) : null
                this.$set(this.groupForm, other.code, undefined)
              }
            },
            ...other
          }
          // console.log(this.additionItem, other)
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    className(){
      return Utils.isObjectFilter(_.last(this.config), {}).type==='textarea' ? 'last-testarea' : ''
    },
    configIndexMap(){
      return [{}].concat(this.config).reduce((obj, item, index)=>({ ...obj, [item.code]: index-1 }))
    },
    formItemMap(){
      const map = {}
      for(const key in this.configIndexMap){
        const index = this.configIndexMap[key]
        const item = this.$refs.FormItem && this.$refs.FormItem[index]
        if(item)
          map[key] = item
      }
      return map
    },
    itemConfig:{
      get() {
        return this.transformConfigAndForm(this.configAndForm || this.config)
      },
      deep: true
    },
    groupForm(){
      return (this.configAndForm instanceof Array)?this.shadowForm:this.form
    }
  },
  data() {
    //   console.log(this.$slots)
    // console.trace(this.config)
    return {
      mainDto: this.createDto({}),
      shadowForm: {},
      additionItem: null
    };
  },
  created(){
    // console.error(this.config)
  },
  beforeDestory() {
    this.onItemChangeEmit.dispose()
    this.onItemConfigChangeEmit.dispose()
    this.formInitEmitter.dispose()
    this.beforeDestroyEmitter.emit(true)
    this.beforeDestroyEmitter.dispose()
  },
  methods: {
    createDto(form){
      const { dtoClass: Dto } = this;
      return this.useDto && new Dto(form || this.form)
    },
    transformConfigAndForm(config){
      return Utils.arrayMapDive(config,i=>{
        i.code = i[this.codeKey]
        i.label = i[this.labelKey]
        i.value = i[this.valueKey]
        return i
      })
    },
    onItemChange(code, value, ...args) {
      if(this.configAndForm ){
        console.log(code, value, this.configAndForm, this.configAndForm.find(i=>i[this.codeKey]==code), this.groupForm)
        const itemConfig = this.configAndForm.find(i=>i[this.codeKey]==code)
        if(itemConfig)
          this.$set(itemConfig, this.valueKey, value)
      }
      // console.log('onItemChange')
      this.$emit("onItemChange", code, value, ...args)
    },
    onItemDelete(item, event){
      const deleteIndex = this.configAndForm.findIndex(i=>i.useDelete && i[this.codeKey]==item[this.codeKey])
      const deleteIndex2 = this.itemConfig.findIndex(i=>i.useDelete && i[this.codeKey]==item[this.codeKey])
      console.log(item, deleteIndex)
      if( deleteIndex > -1 ) {
        this.configAndForm.splice(deleteIndex, 1)
      }
      if( deleteIndex2 > -1 ) {
        this.itemConfig.splice(deleteIndex2, 1)
      }
      this.$forceUpdate()
    },
    onConfigUpdate(config, last = []) {
      if(this.configAndForm)
      this.$forceUpdate();
    }
  }
};
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
.filter-container .is-active .el-input__inner,.filter-container .el-input__inner:focus { 
  border-color: #409EFF !important;
}
.el-form-item--medium.el-form-item-textarea .el-form-item__content {
  height: auto !important;
}
.el-form-item--medium .el-form-item__content{
  height: 36px;
}
.last-testarea {
    margin-bottom: 35px !important;
}
</style>