<template>
  <a-range-picker
    :style="{ width: '100%' }"
    v-model="range"
    :format="formatOptions"
    :disabledTime="disabledTime"
    :disabledDate="disabledDate"
    :defaultPickerValue="defaultTime"
    :showTime="showTime"
    :placeholder="placeholder"
  />
</template>

<script>
import moment from 'moment'
import { isEqual } from 'lodash'
import { PropTypes } from '../_util/util'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: null,
      required: true
    },
    format: {
      type: String
    },
    fieldName: {
      ...PropTypes.arrayOf(String),
      default: () => ['startDate', 'endDate']
    },
    placeholder: {
      ...PropTypes.arrayOf(String),
      default: () => ['开始时间', '截止时间']
    },
    showTime: {
      type: Boolean,
      default: false
    },
    autoSuffix: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultTime: [moment().set('minute', -60 * 24 * 7), moment()],
      disabledTime: function(tttt, partial) {
        // if(partial==='end' && tttt && tttt[1]) {
        //   const [startTime, endTime] = tttt
        //   console.log(tttt, partial, startTime.format('YYYY-MM-DD HH'), endTime.format('YYYY-MM-DD HH'), endTime.isSameOrAfter(moment(new Date())))
        //   return endTime.isSameOrAfter(moment(new Date()))
        // }
        return {} // false
      },
      disabledDate(current) {
        // Can not select days before today and today
        return current && current > moment().endOf('day')
      },
      range: []
    }
  },
  computed: {
    baseFormat() {
      return typeof this.format === 'string' ? this.format : 'YYYY-MM-DD HH:mm:ss'
    },
    // 展示用formatter
    formatOptions() {
      return this.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
    },
    formatUseTime() {
      // format是否包含时间
      return /([Hms]{2,2}(.*?)){3,3}/.test(this.baseFormat)
    },
    // dataFormatter() {
    //   const base = [this.formatOptions, this.formatOptions]
    //   if (this.formatUseTime && )
    //   return base;
    // },
    rangeObject(source) {
      const [start, end] = this.range
      const r = this.getRangeTime(start, end)
      console.error('rangeObject', r)
      return r
    }
  },
  watch: {
    rangeObject(range, lastRange) {
      if (!isEqual(lastRange, range)) {
        this.$emit('change', Object.assign({}, this.value, range))
      }
    }
  },
  methods: {
    getRangeTime(startTime, endTime) {
      return {
        [this.fieldName[0]]: startTime ? this.formatHelper(startTime, '00:00:00') : undefined,
        [this.fieldName[1]]: endTime ? this.formatHelper(endTime, '23:59:59') : undefined
      }
    },
    formatHelper(date, append) {
      if (this.autoSuffix && !this.showTime && this.formatUseTime) {
        date = moment(date.format(`YYYY-MM-DD ${append}`))
      }
      // autoSuffix时，时间字段应自动应用
      return date.format(this.baseFormat)
    }
  }
}
</script>
