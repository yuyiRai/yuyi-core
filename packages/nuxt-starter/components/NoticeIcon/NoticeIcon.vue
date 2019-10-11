<template>
  <span>
    <a-popover
      :visible="visible"
      @visibleChange="handleClose"
      trigger="hover"
      placement="bottomRight"
      destroyTooltipOnHide
      overlayClassName="header-notice-wrapper"
      :getPopupContainer="() => $refs.noticeRef.parentElement"
      :autoAdjustOverflow="true"
      :arrowPointAtCenter="true"
      :overlayStyle="{ minWidth: '400px', top: '50px' }"
    >
      <template slot="content">
        <Notify
          :noMore="false"
          ref="notify"
          @close="force = false"
          @open="force = true"
          @more="more"
          :page="false"
        />
        <div style="text-align: right">
          <a v-if="$route.path !== '/notify'" @click="more">查看更多</a>
        </div>
      </template>
      <span ref="noticeRef" @click="fetchNotice" class="header-notice">
        <a-badge :count="$store.getters.unreadNum">
          <a-icon style="font-size: 16px; padding: 4px" type="bell" />
        </a-badge>
      </span>
    </a-popover>

    <a-modal width="50vw" destroyOnClose v-model="pageVisible" title="通知公告">
      <Notify ref="notifyPage" />
      <template slot="footer">
        <a-button @click="pageVisible = false">关闭</a-button>
      </template>
    </a-modal>
  </span>
</template>

<script>
import Notify from './notify'
export default {
  name: 'HeaderNotice',
  components: { Notify },
  data() {
    return {
      loading: false,
      visible: false,
      force: false,
      pageVisible: false
    }
  },
  created() {
    this.$store.dispatch('loadUnreadNum', this.$store.getters.userInfo)
    const watch = this.$watch(
      '$route.params.showNotice',
      showNotice => {
        const path = this.$route.path
        console.log(this.$route)
        if (showNotice === '1') {
          this.$nextTick(() => {
            this.more()
            watch()
            const watch2 = this.$watch(
              () => this.pageVisible,
              show => {
                if (!show) {
                  watch2()
                  this.$router.replace({
                    path: '.',
                    params: { showNotice: '0' }
                  })
                }
              }
            )
          })
        }
      },
      { immediate: true }
    )
  },
  methods: {
    fetchNotice() {
      this.visible = !this.visible
    },
    more() {
      // this.$router.push({ name: 'notify' })
      this.pageVisible = true
      this.handleClose(false)
    },
    handleClose(visible) {
      // 保持打开弹窗的状态下不回收回菜单
      if (visible || (!this.force && !visible)) {
        this.visible = visible
        if (visible && this.$refs.notify) {
          this.$nextTick(() => {
            console.log(this.$refs)
            this.$refs.notify.initPage()
          })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.header-notice {
  display: inline-block;
  transition: all 0.3s;
  position: relative;
}
.header-notice {
  /deep/ a {
    color: unset !important;
  }
}
</style>
