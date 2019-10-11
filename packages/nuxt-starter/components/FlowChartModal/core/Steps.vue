<template>
  <div :class="{ ['steps']: true, completed, success, failed }">
    <a-steps
      v-if="component === 'antd'"
      style="margin-bottom: 10px;margin-top: 30px;"
      labelPlacement="vertical"
      :current="currentPoint"
    >
      <template v-for="point in pointConfigList">
        <a-step :key="point.gradeId" :class="point.classes" v-bind="point.stepProps">
          <step-a-icon
            v-if="point.icon"
            v-bind="point.icon"
            :getContainer="() => $el && $el.parentElement || $el"
            slot="icon"
          />
          <b slot="title">{{point.title}}</b>
          <span slot="description">
            <b>{{ point.description[0] }}</b>
            <br />
            <span style="font-size: 11px;">{{ point.description[1] }}</span>
          </span>
        </a-step>
      </template>
    </a-steps>
    <van-steps
      v-else
      active-color="#1890ff"
      direction="vertical"
      style="background: none;"
      :active="currentPoint"
    >
      <template v-for="point in pointConfigList">
        <van-step :key="point.gradeId" :class="point.classes">
          <template slot="active-icon">●</template>
          <template slot="inactive-icon">●</template>
          <step-van-icon
            style="float:left;margin-right: 10px;"
            v-bind="point.icon || { type: 'process' }"
          />
          <span style="font-size:18px;">{{point.title}}</span>
          <van-tag
            style="margin-left: 5px;"
            v-if="point.icon && point.icon.hintVisible"
            plain
            type="danger"
          >{{point.icon.hintTitle}}</van-tag>
          <div>
            <b>{{ point.description[0] }}</b>
            <span style="font-size: 11px;">{{ point.description[1] }}</span>
          </div>
        </van-step>
      </template>
    </van-steps>
  </div>
</template>
<script>
export const IconMap = {
  antd: {
    begin: 'user',
    process: 'reload',
    disagree: 'exclamation-circle',
    skip: 'forward',
    abort: 'close-circle',
    checked: 'check-circle',
    back: 'rollback',
    completed: 'cloud-upload'
  },
  vant: {
    begin: 'manager',
    process: 'question',
    disagree: 'comment',
    skip: 'arrow-down',
    abort: 'clear',
    checked: 'checked',
    back: 'warning',
    completed: 'phone-circle'
  }
}

const Component = {
  install(Vue) {
    // try {
    //   const { Steps, Step, Icon, Tag } = require('vant')
    //   require('vant/lib/index.css')
    //   Vue.use(Step)
    //     .use(Steps)
    //     .use(Tag)
    //     .use(Icon)
    // } catch (e) {}
    Vue.component('flow-chart-steps', Component)
  },
  components: {
    'step-a-icon': {
      functional: true,
      render(
        h,
        {
          props,
          data: { slot, ...data }
        }
      ) {
        const iconMap = IconMap.antd
        props.type = iconMap[props.type]
        return (
          <a-tooltip
            slot={slot}
            visible={props.hintVisible}
            title={props.hintTitle}
            getPopupContainer={props.getContainer}
          >
            <a-icon {...data} {...{ props }} />
          </a-tooltip>
        )
      }
    },
    'step-van-icon': {
      functional: true,
      render(
        h,
        {
          props,
          data: { slot, ...data }
        }
      ) {
        // console.log(data)
        const iconMap = IconMap.vant
        props.name = iconMap[props.type]
        // console.log(iconMap, iconMap[props.type])
        return (
          <div>
            <van-icon size={28} {...data} {...{ props }}></van-icon>
          </div>
        )
      }
    }
  },
  props: ['component', 'currentPoint', 'pointConfigList', 'completed', 'success', 'failed']
}
export default Component
</script>
<style lang="less">
.steps {
  .ant-steps-item-custom .ant-steps-item-icon > .ant-steps-icon {
    font-size: 34px;
    top: -5px;
  }
  .ant-steps-item-tail {
    &,
    &:after {
      height: 3px;
    }
    &:after {
      margin-left: 4px;
    }
  }

  .ant-steps-item,
  .van-step {
    &.error {
      .van-step__circle-container,
      .van-step__title {
        color: #f5222d !important;
      }
    }
  }

  // 经过正在退回路线的节点
  .ant-steps-item,
  .van-step {
    &.backAuditing {
      .ant-steps-item-tail:after,
      .van-step__line {
        background-color: #f5222d !important;
      }
    }
  }

  .ant-steps-item-finish,
  .van-step--finish {
    .ant-steps-item-content *,
    .van-step__circle-container,
    .van-step__title {
      color: #1890ff;
    }
    .van-step__line {
      background-color: #1890ff !important;
    }
  }

  .ant-steps-item,
  .van-step {
    &.currentAudit {
      .ant-steps-item-content *,
      .ant-steps-icon,
      .van-step__circle-container,
      .van-step__title {
        color: #f5222d !important;
      }
    }
  }

  .van-step__circle-container {
    font-size: 13px;
    left: -15px;
  }
  &.completed .ant-steps-item-error .ant-steps-item-content * {
    color: #3f8d18 !important;
  }
  &.completed {
    .ant-steps-item-finish,
    .van-step--finish,
    .ant-steps-item-process,
    .van-step--process {
      & {
        .ant-steps-item-tail:after,
        .van-step__line {
          background-color: #52c41a !important;
        }
        .ant-steps-icon,
        .van-step__circle-container {
          color: #52c41a !important;
        }
        .ant-steps-item-content *,
        .van-step__title {
          color: #3f8d18 !important;
          .van-icon {
            color: #52c41a !important;
          }
        }
      }
    }
  }
}
</style>
