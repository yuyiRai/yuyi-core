import { isEqual, isNil, typeFilterUtils } from '@yuyi/utils'
// eslint-disable-next-line
import { Input, InputNumber } from 'ant-design-vue'

const { TextArea } = Input

function getValueEvent(component, value) {
  value = typeFilterUtils.isNotEmptyValueFilter(value, '')
  if (component === Input) {
    return { target: { value: value } }
  } return value
}
function getValueFromEvent(component, e) {
  if (component === Input) {
    return typeFilterUtils.isNotEmptyValueFilter(e && e.target && e.target.value, '')
  } return e
}

/**
 * 将值变更事件优化逻辑注入表单组件
 * 作为优化表单性能的手段，减少value变更多余事件的提交次数以减少更新次数
 * @param InputComponent - 注入的Input组件，可用的有Input/InputNumber/Input.TextArea（因为只有这些需要优化）
 * @param keyword - 关键字组成数组[props:value, on:change]
 */
export function FormItemInputInject<T extends typeof Input | typeof InputNumber | typeof TextArea>(
  InputComponent: T,
  keyword = ['value', 'change']
): T {
  const [valueKey = 'value', changeKey = 'change'] = keyword
  // @ts-ignore
  return {
    // @ts-ignore
    props: InputComponent.props,
    model: {
      value: valueKey,
      event: changeKey
    },
    watch: {
      value(v) {
        // console.log('onnextValueReceive', v, this.localValue)
        if (v !== this.localValue) {
          // console.log('onnextValueReceive inject')
          this.sync(v)
        }
      }
    },
    computed: {
      localValue() {
        return getValueFromEvent(InputComponent, this.lastChangeEvent)
      },
      props() {
        return ({
          attrs: this.$attrs,
          props: {
            ...this.$props,
            [valueKey]: isNil(this.localValue) ? '' : this.localValue
          },
          on: {
            blur: this.onBlur,
            [changeKey]: this.onChange
          },
          nativeOn: {
            'mouseleave': (e) => this.$emit('mouseleave', e)
          }
        })
      }
    },
    data() {
      return {
        lastChangeEvent: getValueEvent(InputComponent, this[valueKey])
      }
    },
    render(h) {
      // console.log(this.props)
      return <InputComponent {...this.props} />
    },
    methods: {
      onChange(e, ...o) {
        // 缓存变更值，直到失去焦点时提交
        this.lastChangeEvent = e
      },
      /**
       * 同步缓存与当前值保持一致
       * @param v 
       */
      sync(v) {
        this.lastChangeEvent = getValueEvent(InputComponent, v)
        this.lastValueInBlur = v
      },
      onBlur(e) {
        // 直到失去焦点时提交
        if (!isEqual(this.lastValueInBlur, this.localValue, true)) {
          this.$emit(changeKey, this.lastChangeEvent)
          // console.log('change', this.localValue)
          this.lastValueInBlur = this.localValue
        }
        this.$emit('blur', e)
      }
    }
  }
}
