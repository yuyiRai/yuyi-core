import { Spin } from 'ant-design-vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { VueComponent } from '@/utils/CommonUtils/createTsxComponent';
import { VCProps } from '@/components/CommonFormBase';

const ASpin: VueComponent<VCProps<Spin, false>, {}, {}, typeof Spin> = Spin as any

@Component({
  inject: {
    CFormState: {
      'default': function _default() {
        return {}
      }
    }
  }
})
export class FormItemSpin extends VueComponent<VCProps<Spin>> {

  updated() {
    this.sync()
  }

  @Watch('CFormState.lastChangedState', { deep: true })
  sync() {
    this.$nextTick(() => {
      if (this.$el) {
        const icon = this.$el.parentElement.querySelector('.ant-form-item-children-icon')
        // console.log('lastChangedState', icon)
        if (icon && icon === this.$el.nextElementSibling) {
          const container = this.$el.querySelector('.ant-spin-container')
          if (container) container.appendChild(icon)
          // console.log(icon)
        }
      }
    })
  }

  mounted() {
    this.sync()
  }

  render(h) {
    return <ASpin {...{ attrs: this.$attrs, props: this.$attrs, on: this.$listeners }}>{this.$slots.default}</ASpin>
  }
}



export default FormItemSpin as typeof ASpin