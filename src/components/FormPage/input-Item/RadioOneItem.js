/* eslint-disable */

import Vue from 'vue';

const defaultLabels = '是|否';
export default Vue.component('RadioOneItem', {
  template: `
    <el-radio-group v-model="selectModel" @change='$emit("change", $event)' :disabled='disabled'>
      <el-radio label="1">{{labelArray[0]}}</el-radio>
      <el-radio label="0">{{labelArray[1]}}</el-radio>
    </el-radio-group>
  `,
  watch: {
    value: {
      handler(value) {
        this.selectModel = value;
      },
      immediate: true
    }
  },
  props: {
    value: String,
    label: {
      type: String,
      default: defaultLabels
    },
    disabled: Boolean
  },
  computed:{
    labelArray(){
      const { label } = this
      return ((!Utils.isNotEmptyString(label) || label==='|') ? defaultLabels : label).split('|')
    }
  },
  data(){
    return {
      selectModel: null
    }
  }
})