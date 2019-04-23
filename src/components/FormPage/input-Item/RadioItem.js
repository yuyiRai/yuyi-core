/* eslint-disable */

import Vue from 'vue';

const defaultLabels = '是|否';
export default Vue.component('RadioOneItem', {
  template: `
    <el-radio-group v-model="selectModel" @change='$emit("change", $event)' :disabled='disabled'>
      <el-radio v-for='(item, index) in options' :key='index' :label='item.value'>{{item.label}}</el-radio>
    </el-radio-group>
  `,
  watch: {
    value: {
      handler(value) {
        if(this.selectModel !== value)
          this.selectModel = value;
      },
      immediate: true
    }
  },
  props: {
    value: String,
    options: {
      type: Array,
      default: () => ([
        {label: '是', value: '1'},
        {label: '否', value: '0'},
      ])
    },
    disabled: Boolean
  },
  computed:{
    displayOptions() {
      return Utils.zipEmptyData(this.options)
    }
  },
  data(){
    return {
      selectModel: null
    }
  }
})