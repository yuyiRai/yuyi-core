
import { Radio, Checkbox } from 'ant-design-vue'
import './CheckButtonGroup.less'
import { convertArr2Map } from '@/utils/CommonUtils';
const RadioGroup = Radio.Group as any;
const CheckboxGroup = Checkbox.Group as any;
const CheckBox = Checkbox as any;
const RadioButton = Radio.Button as any;

export const CheckButtonGroup = {
  functional: true,
  render(h, { props, attrs = props, data, listeners, children }) {
    const { multiple, options, value } = attrs
    const valueMap = multiple ? convertArr2Map(value) : { [value]: true }
    data.attrs.options = null
    return !attrs.multiple ? (
      <RadioGroup {...data} onChange={listeners.change ? e => {
        e && e.target && listeners.change(e.target.value)
      } : null} buttonStyle="solid" class="aml-check-button-group">
        {options.map(o => <RadioButton key={o.key || o.value} value={o.value}>{o.label}</RadioButton>)}
        {children}
      </RadioGroup>)
      : (
        <CheckboxGroup {...data} class={["ant-radio-group-solid", "aml-check-button-group"]}>
          {options.map(o => (
            <label key={o.key || o.value} class={['ant-radio-button-wrapper', valueMap[o.value] && 'ant-radio-button-wrapper-checked']}>
              <span>
                {o.label}
                <CheckBox style={{ display: 'none' }} value={o.value}></CheckBox>
              </span>
            </label>
          ))}
          {children}
        </CheckboxGroup>
      )
  }
}