import { Form } from 'ant-design-vue'
import Vue from 'vue'
import './CardFormItem.less'
import { SlotsMixin } from '@/components/CommonMixins'

export const CardFormItem = Vue.extend({
  props: (Form.Item as any).props,
  mixins: [SlotsMixin],
  computed: {
    itemProps() {
      const { label, labelCol, wrapperCol, ...props } = this.$props

      return {
        class: 'aml-card-form-item',
        props: {
          ...props,
          wrapperCol: ['xl', 'span', 'sm', 'xs', 'lg'].reduce((obj, key) => {
            return key in wrapperCol ? { ...obj, [key]: (wrapperCol[key] || 0) + (labelCol[key] || 0) } : obj
          }, {})
        },
        scopedSlots: { ...this.$scopedSlots }
      }
    }
  },
  render(h) {
    return (
      <Form.Item {...this.itemProps} label={false}>
        <a-card type="inner">
          <b slot="title">{this.slots('label')}</b>
          {this.$slots.default}
        </a-card>
      </Form.Item>
    )
  }
})