import { Button as AntButton } from 'ant-design-vue'
import { castArray } from 'lodash'
import './ThemeButton.less'
import { Vue } from 'vue-property-decorator';
import { componentFactory } from 'vue-tsx-support'
import { VCProps } from '../CommonFormBase'
import { convertTsxComponent } from '@/utils/CommonUtils/createTsxComponent'
import { VueConstructor } from 'vue'

type ExcludeProps<T, OtherKeys extends keyof T> = Partial<
  Pick<
    T,
    Exclude<keyof T, OtherKeys>
  >
>
export type AntExcludeProps<T extends Vue, OtherKeys extends keyof VCProps<T>> = ExcludeProps<VCProps<T>, OtherKeys>

export interface IButtonProps extends AntExcludeProps<AntButton, 'type'> {
  /** 在ant button基础上新增第二主色 */
  type?: AntButton['type'] | 'second' | 'link'
  /** 仅适用link-button；字体颜色继承上级元素，停用下划线 */
  colorInherit?: boolean;
}
export const Button = convertTsxComponent<IButtonProps, any, any>(AntButton)

export const ThemeButton = componentFactory.create<Partial<IButtonProps>, any, any>({
  functional: true,
  render(h, { data, children }) {
    const { props: { type = 'default', colorInherit = false } = {}, class: classes = [] } = data
    if (type === 'second') {
      data.props.type = 'primary'
    }
    data.class = [...castArray(classes), 'aml-btn-' + type, colorInherit && 'color-inherit']
    return <Button {...data}><span>{children}</span></Button>
  }
})
