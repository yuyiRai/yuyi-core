<template>
  <div :style="{ width }" :class="prefixCls">
    <div style="float: left">
      <template v-if="!$slots.extra">{{ extra }}</template>
      <slot name="extra"></slot>
    </div>
    <div style="float: right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'
export default {
  name: 'FooterToolBar',
  mixins: [mixin, mixinDevice],
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-footer-toolbar'
    },
    extra: {
      type: [String, Object],
      default: ''
    }
  },
  computed: {
    width() {
      return this.isSideMenu() && this.isDesktop() ? `calc(100% - ${this.sidebarOpened ? 256 : 80}px)` : '100%'
    }
  }
}
</script>

<style lang="less" scoped>
</style>
