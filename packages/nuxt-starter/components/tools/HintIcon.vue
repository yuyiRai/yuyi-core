<template>
  <a-popover
    v-model="hintVisible"
    overlayClassName="aml-hint-flag-container"
    trigger="hover"
    placement="bottomRight"
    autoAdjustOverflow
    arrowPointAtCenter
    @visibleChange="stopCountDown"
  >
    <div slot="title">
      <a-icon theme="outlined" class="hint-icon" type="question-circle-o" />&nbsp;提示
    </div>
    <template slot="content">
      <div>
        点击
        <a @click="() => $store.dispatch('CheckOpManual')">查看</a>
        &nbsp;{{ message }}模块的操作手册
        <br />
        <a-alert showIcon :class="['count-down', countDown > 0 && countDown < 6 && 'show']">
          <template slot="message">
            <a-badge
              :style="{ marginLeft: '-10px'}"
              :numberStyle="{backgroundColor: 'transparent', borderColor: 'transparent', color: 'inherit'}"
              :offset="[2, -4]"
              :count="countDown"
            ></a-badge>秒后自动收起
          </template>
        </a-alert>
      </div>
    </template>
    <a
      v-if="$store.getters.hasMdlChecked"
      @click="() => $store.dispatch('CheckOpManual')"
      ref="noticeRef"
    >
      <span>
        <a-icon type="question-circle-o"></a-icon>
      </span>
    </a>
  </a-popover>
</template>

<script>
import { debounce } from 'lodash'

export default {
  data() {
    return {
      hintVisible: false,
      countDown: 0,
      message: null
    }
  },
  mounted() {},
  watch: {
    '$route.meta.mdlCode': {
      handler(mdlCode) {
        if (mdlCode) {
          this.start(mdlCode)
        }
      },
      immediate: true
    }
  },
  methods: {
    start: debounce(async function(mdlCode) {
      this.hintVisible = false
      await this.$nextTick()
      this.stopCountDown()
      this.hintVisible = true
      this.message = this.$route.meta.title
      this.close()
    }, 500),
    register() {
      const container = document.getElementsByClassName('aml-hint-flag-container')[0]
      if (container) {
        const event = () => {
          this.stopCountDown()
          container && container.removeEventListener('mouseover', event)
        }
        container.addEventListener('mouseover', event)
      }
    },
    stopCountDown() {
      this.countDown = 0
      this.cancel && this.cancel()
      this.cancel = null
    },
    cancel(flag) {
      window.clearInterval(flag)
    },
    close(n = 5) {
      this.stopCountDown()
      this.countDown = n + 1
      this.register()
      const flag = window.setInterval(() => {
        this.countDown--
        if (this.countDown <= 0) {
          this.hintVisible = false
          this.stopCountDown()
        }
      }, 1000)
      this.cancel && this.cancel()
      this.cancel = () => {
        window.clearInterval(flag)
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-alert {
  padding-top: 2px;
  padding-bottom: 2px;
  .ant-alert-icon {
    top: 5.5px;
  }
}
.count-down {
  transition: 0.3s all;
  transform: scale(0);
  margin-top: -30px;
  &.show {
    margin-top: 0px;
    transform: scale(1);
  }
}
</style>
