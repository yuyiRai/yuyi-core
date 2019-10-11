import { createTsxComponent, useProps } from '@/utils/CommonUtils/createTsxComponent'
import { Badge } from 'ant-design-vue'
import { CreateElement } from 'vue'
import './style.less'

export const GroupTitle = createTsxComponent({
  props: {
    badge: useProps<Partial<Badge>>(Object).default(null),
    size: useProps<'small' | 'large' | 'default'>(String as any).default('default')
  },
  functional: true,
  render(h: CreateElement, { data, props, children }) {
    return (
      <h2 class={["aml-group-title", props.size]} {...data}>
        <Badge style={{ fontSize: 'inherit' }} {...{ props: props.badge }}>
          {children}
        </Badge>
      </h2>
    )
  }
})
