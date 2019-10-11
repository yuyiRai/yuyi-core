<template>
  <a-spin :spinning="loading">
    <a-select style="width: 100%" ref="native" v-on="on" v-bind="props">
      <a-spin v-once slot="notFoundContent" size="small" />
      <a-select-opt-group
        key="search"
        v-if="currentList.length > 0"
        :label="(lastSearchKey && '搜索关键字 ' + lastSearchKey) || '输入关键字搜索'"
      >
        <a-select-option v-for="item in currentList" :key="item.key">{{ item.label }}</a-select-option>
      </a-select-opt-group>
      <a-select-opt-group
        key="history"
        v-if="historyList.length>0"
        :label="lastSearchKey ? '历史搜索' : '输入关键字搜索'"
      >
        <!-- @slot Use this slot header -->
        <slot name="head"></slot>
        <a-select-option v-for="item in historyList" :key="item.key">{{ item.label }}</a-select-option>
      </a-select-opt-group>
    </a-select>
  </a-spin>
</template>
<script>
import QueryInput from './National.tsx'

export default {
  mixins: [QueryInput],
  props: {
    /**
     * 测试aaaa
     */
    aaa: {
      type: Boolean
    }
  }
}
</script>
