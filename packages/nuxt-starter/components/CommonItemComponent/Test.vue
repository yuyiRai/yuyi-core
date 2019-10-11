<template>
  <a-select
    mode="multiple"
    :value="value"
    placeholder="Select users"
    style="width: 100%"
    :filterOption="false"
    @search="fetchUser"
    @change="handleChange"
    :notFoundContent="fetching ? undefined : null"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option v-for="d in data" :key="d.value">{{d.text}}</a-select-option>
  </a-select>
</template>
<script>
// import { Select } from 'ant-design-vue'
import { queryNationality } from '@/api/clientViews'
// import { boolOrParam } from './utils'
import debounce from 'lodash/debounce'

export default {
  data() {
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
    return {
      data: [],
      value: [],
      fetching: false
    }
  },
  methods: {
    async fetchUser(value) {
      console.log('fetching user', value)
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true
      const { data } = await queryNationality(value)
      if (fetchId !== this.lastFetchId) {
        // for fetch callback order
        return
      }
      this.data = data.map(({ configCode: value, configName: label }) => ({
        text: label,
        value: value
      }))
      this.fetching = false
    },
    handleChange(value) {
      Object.assign(this, {
        value,
        data: [],
        fetching: false
      })
    }
  }
}
</script>
