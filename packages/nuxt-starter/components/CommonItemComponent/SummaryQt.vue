<template>
  <a-select :value="value" @change="$emit('change', $event)" placeholder="请选择统计年份" default-value="currentYear" allowClear>
    <template slot="suffixIcon">
      <a-icon type="calendar"></a-icon>
    </template>
    <a-select-option v-for="i in lastTen" :key="(currentYear - i)+''">{{ currentYear - i }}</a-select-option>
  </a-select>
</template>
<script>
const currentYear = new Date().getFullYear()
export default {
  model: {
    value: 'value',
    event: 'change'
  },
  props: {
    "value": {
      type: String,
      default: undefined
    }
  },
  created() {
    this.$emit('change', currentYear + '')
  },
  data() {
    return {
      currentYear,
      lastTen: new Array(10).fill(true).map((i, index) => index)
    }
  }
}
</script>
