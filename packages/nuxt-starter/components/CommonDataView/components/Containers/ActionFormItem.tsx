import { AutoOperationBar } from '@/components'
import { SlotsMixin } from '@/components/CommonMixins'
import { convertTsxComponent, mixinTsxComponent, useProps } from '@/utils/CommonUtils/createTsxComponent'
import { Form } from 'ant-design-vue'
import { FormItem as AntFormItem } from 'ant-design-vue/types/form/form-item'
import { VCProps } from '../../../CommonFormBase/interface'
import './CardFormItem.less'
import { IActionConfig } from '@/components/CommonButton/AutoOperationBar/interface'

export interface IFormItemProps extends Partial<VCProps<AntFormItem>> {

}
export const FormItem = convertTsxComponent<IFormItemProps>(Form.Item)

// export const FormItem = Form.Item

export const ActionFormItem = mixinTsxComponent({} as typeof FormItem).create({
  props: {
    ...(Form.Item as any).props,
    actions: useProps<IActionConfig[]>(Array).default(() => []),
    actionsLabel: useProps(String).default(' ')
  },
  mixins: [SlotsMixin],
  computed: {
    itemProps() {
      const { actions, actionsLabel, label, ...props } = this.$props
      return {
        class: 'aml-action-form-item',
        props: {
          ...props,
          label: actionsLabel
        },
        scopedSlots: { ...this.$scopedSlots }
      }
    }
  },
  render(h) {
    // console.log(this, this.$slots.default)
    return (
      <FormItem {...this.itemProps} label={false}>
        <AutoOperationBar actions={this.actions.map(action => {
          return {
            ...action,
            confirm: {
              title: <div><br />{this.$slots.default}</div>,
              props: {
                icon: <p></p>
              }
            }
          }
        })} props={this.$attrs} />
        <b slot="title">{this.slots('label')}</b>
        {/* to do */}
      </FormItem>
    )
  }
})