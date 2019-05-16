import { AutoComplete, Select, Spin } from 'antd';
import { OptGroupProps, SelectProps } from 'antd/lib/select/index';
import 'antd/lib/select/style/css';
import { Observer } from 'mobx-react-lite';
import { createTransformer } from 'mobx-utils';
import * as React from 'react';
import styled from 'styled-components';
import { OptionsStore } from '../../../../stores/ItemConfig/OptionsStore';
import { IItemConfig, OFormItemCommon } from '../../Interface';
import { commonInjectItem } from '../commonInjectItem';
import { useSearchStore } from '../OptionsUtil';
import { ValueHintContainer } from '../OptionsUtil/ToolTipContainer';
import { TagGroup } from './TagGroup';
export interface ISelectItemProps extends OFormItemCommon, SelectProps {
  center?: boolean;
}
export const SearchItem: React.FunctionComponent<ISelectItemProps> = commonInjectItem((props: ISelectItemProps) => {
  return <OSearchItem {...props} center />;
})
export interface ISearchResultGroupProps extends OptGroupProps {
  disabled?: boolean;
}

export function preSwitchContainer(container: JSX.Element) {
  return (children: JSX.Element | JSX.Element[], switchValue: boolean) => switchContainer(container, children, switchValue)
}
export function switchContainer(container: JSX.Element, children: JSX.Element | JSX.Element[], switchValue: boolean) {
  if (switchValue) {
    return React.cloneElement(container, container.props, children)
  }
  return children
}

export const getSelectModel = createTransformer((itemConfig: IItemConfig) => {
  if (itemConfig.multiple) {
    if (itemConfig.allowCreate) {
      return 'tags'
    }
    return 'multiple'
  }
  return undefined;
})

export const getNotFoundContent = createTransformer((itemConfig: IItemConfig) => {
  return itemConfig.loading ? <div style={{ textAlign: 'center' }}><Spin size="small" /></div> : undefined
})

export const OSearchItem: React.FunctionComponent<any> = styled((props: any) => {
  const { antdForm, formStore, code, itemConfig, ...other } = props
  const isAutoComplete = (itemConfig.allowInput === true && itemConfig.type === 'search' && !itemConfig.multiple)
  const OptionItem = isAutoComplete ? AutoComplete.Option : Select.Option
  const OptGroupItem = isAutoComplete ? AutoComplete.OptGroup : Select.OptGroup
  const searchStore = useSearchStore(itemConfig, (store: OptionsStore<JSX.Element>) => {
    return store.displayOptions.map(d => 
      <OptionItem title={d.label} key={d.key} value={d.value}>{store.getOptionsLabel(d)}</OptionItem>
    );
  })
  const { optionsStore } = itemConfig
  const mode = getSelectModel(itemConfig)
  return (
    <Observer>{() => {
      const { transformOption } = optionsStore;
      // console.log(isAutoComplete, props, optionsStore.displayOptions, transformOption, itemConfig.options)
      const [isVisible, changeVisible] = React.useState(undefined)
      const optionsList = switchContainer(
        <OptGroupItem key={searchStore.searchHintText} label={searchStore.searchHintText} />,
        transformOption,
        itemConfig.type === 'search' && Utils.isNotEmptyString(searchStore.searchHintText)
      )
      const hint = (
        <TagGroup labelsConfig={optionsStore.selectedLablesConfig} onClose={v => {
          other.onChange(v, transformOption)
        }} />
      )
      if (isAutoComplete) {
        return <AutoComplete {...other} onSearch={searchStore.onSearch} dataSource={transformOption} />
      }
      const selectElement = (
        <Select mode={mode}
          allowClear
          autoClearSearchValue={false}
          showSearch={itemConfig.type === 'search'}
          defaultActiveFirstOption={false}
          showArrow={true}
          optionFilterProp="title"
          onSearch={itemConfig.type === 'search' ? searchStore.onSearch : undefined}
          notFoundContent={getNotFoundContent(itemConfig)}
          loading={itemConfig.loading}
          {...other}
          onDropdownVisibleChange={open => {
            changeVisible(open ? open : undefined);
            !open && searchStore.resetKeyword()
          }}
        >{optionsList}</Select>
      )
      return <>{
        switchContainer(
          <ValueHintContainer value={hint} visible={optionsStore.hasSelectedTag ? isVisible : false} />,
          selectElement,
          itemConfig.multiple
        )
      }</>
    }}</Observer>
  );
})`
  text-align: ${props => props.center ? 'center' : undefined};
`