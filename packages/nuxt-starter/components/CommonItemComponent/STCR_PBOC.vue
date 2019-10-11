<template>
  <a-spin :spinning="waiting">
    <a-select
      v-bind="$props"
      :value="value"
      @change="handleChange"
      placeholder="请选择可疑交易特征"
      :options="options"
    />
  </a-spin>
</template>
<script>
import DateRangePicker from '@/components/DateRangePicker'
import { getOptions } from '@/config/formItemBase.ts'
import { Select } from 'ant-design-vue'

const { options, ...props } = Select.props
export default {
  components: { DateRangePicker: DateRangePicker.TypeA },
  model: {
    value: 'value',
    event: 'change'
  },
  props: {
    ...props,
    value: {
      type: String,
      default: undefined
    }
  },
  async created() {
    this.$autils.$commitWaiting()
    const options = await getOptions('STCR_PBOC')
    // this.$emit('change', currentYear + '')
    this.options = options
    this.waiting = false
    this.$nextTick(() => {
      this.$autils.$commitFinish()
      console.log('created')
    })
  },
  data() {
    return {
      options: [],
      waiting: true
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>
