import DescriptionList from '@/components/DescriptionList';
import { Collapse } from 'ant-design-vue';
import { map } from 'lodash';
import { GroupTitle } from '@/components/CommonDataView';
import { convertTsxComponent } from '@/utils/CommonUtils/createTsxComponent';
import { CollapsePanel as CollapsePanelNative } from 'ant-design-vue/types/collapse/collapse-panel';

const CollapseContainer = convertTsxComponent<Partial<Collapse>>(Collapse)
const CollapsePanel = convertTsxComponent<Partial<CollapsePanelNative>>(Collapse.Panel)

const DescriptionListItem = DescriptionList.Item
export const defaultProps = {
  col: 1,
  layout: "vertical",
  colon: false,
  titleStyle: { fontSize: '20px', marginLeft: '-10px' }
}
const commonProps = {
  props: defaultProps
}
export const AutoDescriptionList = {
  functional: true,
  render(h, { props, data, scopedSlots: { item, footer } }) {
    const { list, termMap = {}, disabled = false } = props as { list: any[], termMap: any, disabled: boolean }
    const children = map(list, (key) => {
      const listItem = item(key)
      return disabled ? listItem : (<DescriptionListItem class="auto-description-list-item" term={termMap[key] || key} key={key}>{listItem}</DescriptionListItem>)
    })
    const collapse = props.collapse ? (
      <CollapseContainer style="background: transparent" defaultActiveKey="1" bordered={false}>
        <CollapsePanel showArrow={false} key="1">
          <GroupTitle style="margin: 0;" slot="header">head</GroupTitle>
          <p>{children}</p>
        </CollapsePanel>
      </CollapseContainer>
    ) : children;
    if (footer) {
      children.push(footer())
    }
    return disabled ? <div {...data}>{collapse}</div> : <DescriptionList {...data} {...commonProps}>{collapse}</DescriptionList>
  },
  defaultProps,
  Item: {
    functional: true,
    render(h, { attrs = {}, children, ...other }: any) {
      // console.log({ attrs, children, ...other })
      return (
        <DescriptionList {...commonProps}>
          <DescriptionListItem class="auto-description-list-item" {...other} term={attrs.term}>
            <div slot="term">{other.scopedSlots.term()}</div>
            {children}
          </DescriptionListItem>
        </DescriptionList>
      )
    }
  }
} as any

export default AutoDescriptionList
