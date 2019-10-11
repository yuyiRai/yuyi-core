<template>
  <a-badge class="notice-line" style="display: flex; flex: 1;" :dot="unread">
    <div class="cell" style="padding: 0;">
      <NoticeBar :class="{ important }" color="#1989fa" background="transparent">
        <a-icon slot="left-icon" type="notification" />
        <a @click="$emit('click')">
          <slot></slot>
        </a>
      </NoticeBar>
    </div>
  </a-badge>
</template>
<script>
import NoticeBar from './NoticeBar.tsx'

export default {
  components: { NoticeBar },
  props: ['important', 'unread']
}
</script>
<style lang="less" scoped>
.notice-line {
  /deep/ .anticon {
    margin-right: 2px;
  }
  /deep/ .ant-badge-dot {
    left: 10px;
    top: 8px;
  }
  /deep/ .important * {
    color: red;
  }
  /deep/ .van-cell:not(:last-child)::after {
    content: none;
  }

  &:not(:last-child)::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  /deep/ .van-notice-bar {
    padding: 0;
  }
  .cell {
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    & > *:nth-child(1) {
      flex: 1;
      position: relative;
      overflow: hidden;
      text-align: right;
      vertical-align: middle;
    }
  }
}
</style>
