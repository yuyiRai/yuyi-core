
import styled from 'vue-styled-components';
import { castArray } from 'lodash'
import './Container.less'

const props = {
  width: {
    type: String,
    default: 'auto'
  },
  labelWidth: {
    type: Number,
    default: 120
  },
  gutter: {
    type: Number,
    default: 20
  },
  viewMode: {
    type: String,
    default: null
  }
}

export const LabelWidthFormContainer = styled('div', props)`
  min-width: ${props => props.width};
  .ant-form-item${props => props.labelWidth > 0 ? '' : '.use-label-width'} {
    margin-bottom: 0;
    .ant-form-item-label {
      width: ${props => props.labelWidth}px;
    }
    .ant-form-item-control-wrapper {
      width: calc(100% - ${props => props.labelWidth + (props.gutter / 2)}px);
    }
  }
`.withComponent({
  functional: true,
  render(h, { props, data, children }) {
    if (children.length !== 1) {
      throw new Error('Allow one child element！')
    } else if (children.length > 0) {
      const { class: classes = [] } = children[0].data
      children[0].data.class = [...castArray(classes), ...data.class]
      return props.viewMode === 'card' ? <a-alert type="info" class="card-form-container" style="width: 100%; margin-bottom: 10px;">
        <div slot="description">{children}</div>
      </a-alert> : children[0]
    }
    return h('div', data, children)
  },
  methods: {
    getContainer(children) {
      return (
        <a-alert type="info" class="card-form-container" style="width: 100%; margin-bottom: 10px;">
          <div slot="description">{children}</div>
        </a-alert>
      )
    }
  }
})


