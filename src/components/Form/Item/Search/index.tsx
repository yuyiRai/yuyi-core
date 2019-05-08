import * as React from 'react'
import { Select, Spin } from 'antd';
import { SelectProps, OptGroupProps, SelectValue } from 'antd/lib/select/index';
import 'antd/lib/select/style/css';
import { Observer } from 'mobx-react-lite';
import { useSearchStore } from '../OptionsUtil';
import { OptionsStore } from '../../../../stores';
import { OFormItemCommon, IItemConfig } from '../../Interface';
import { commonInjectItem } from '../commonInjectItem';
import styled from 'styled-components';
import { ValueHintContainer } from '../OptionsUtil/ToolTipContainer';
import { TagGroup } from './TagGroup';
import { createTransformer } from 'mobx-utils';
import { IReactComponent } from 'mobx-react';

export interface ISelectItemProps extends OFormItemCommon, SelectProps {
  center?: boolean;
}
export const SearchItem: React.FunctionComponent<ISelectItemProps> = commonInjectItem((props: ISelectItemProps) => {
  return <OSearchItem {...props} center />;
})
export interface ISearchResultGroupProps extends OptGroupProps {
  disabled?: boolean;
}
export const OSearchResultGroup: React.FunctionComponent<ISearchResultGroupProps> = ({disabled, ...props}) => {
  if (disabled) {
    return <>{props.children}</>
  }
  return (
    <Select.OptGroup {...props}>
      {props.children}
    </Select.OptGroup>
  )
}

export function preSwitchContainer<P>(Container: IReactComponent<P>) {
  return (props: P & {key?: any}, children: JSX.Element | JSX.Element[], switchValue: boolean) => switchContainer(Container, props, children, switchValue)
}
export function switchContainer<P>(Container: IReactComponent<P>, props: P & {key?: any}, children: JSX.Element | JSX.Element[], switchValue: boolean) {
  if (switchValue) {
    return <Container {...props}>{children}</Container>
  }
  return children
}

export const getSelectModel = createTransformer((itemConfig: IItemConfig) => {
  if(itemConfig.multiple) {
    if(itemConfig.allowCreate) {
      return 'tags'
    }
    return 'multiple'
  }
  return undefined;
})
export const getNotFoundContent = createTransformer((itemConfig: IItemConfig) => {
  return itemConfig.loading ? <div style={{textAlign: 'center'}}><Spin size="small" /></div> : undefined
})

export const OSearchItem: React.FunctionComponent<ISelectItemProps> = styled((props: ISelectItemProps) => {
  const { antdForm, formStore, code, itemConfig, ...other } = props
  const searchStore = useSearchStore(itemConfig, (store: OptionsStore<JSX.Element>) => {
    return store.displayOptions.map(d => <Select.Option title={d.label} key={d.key} value={d.value}>{d.label}</Select.Option>);
  })
  const { optionsStore } = itemConfig
  const { transformOption } = optionsStore;
  console.log(props, optionsStore.displayOptions, transformOption)
  const mode = getSelectModel(itemConfig)
  return (
    <Observer>{() => {
      const [ isVisible, changeVisible ] = React.useState(undefined)
      const optionsList = switchContainer(Select.OptGroup, { key: searchStore.searchHintText }, transformOption, Utils.isNotEmptyString(searchStore.searchHintText))
  
      const hint = (
        <TagGroup labelsConfig={optionsStore.selectedLablesConfig} onClose={v => {
          other.onChange(v, transformOption)
        }} />
      )
      const selectElement = (
        <Select mode={mode}
            showSearch
            defaultActiveFirstOption={false}
            showArrow={true}
            optionFilterProp="title"
            // filterOption={false}
            dropdownRender={mode!=='tags' ? (menu?: JSX.Element, props?: SelectProps<SelectValue>): JSX.Element => {
              // console.log('dropdownRender', menu.props.menuItems)
              // const { menuItems, ...other } = menu.props
              // if (searchStore.searchHintText) {
              //   menu = React.cloneElement(menu, {
              //     ...other,
              //     menuItems: [menuItems[menuItems.length-1]]
              //   })
              // }
              return (
                <div>
                  { false && getNotFoundContent(itemConfig) }
                  { menu }
                </div>
              )
            } : undefined }
            onSearch={searchStore.onSearch}
            notFoundContent={getNotFoundContent(itemConfig) || 'Not Found'}
            loading={itemConfig.loading}
            {...other}
            onDropdownVisibleChange={open => {
              changeVisible(open ? open : undefined);
              !open && searchStore.resetKeyword()
            }}
          >{ optionsList }</Select>
      )
      return (
        <>{
        <span>{searchStore.keyWord}</span>}{
          switchContainer(ValueHintContainer, {
            value: hint,
            visible: optionsStore.hasSelectedTag ? isVisible : false
          }, selectElement, itemConfig.multiple)
        }</>
      )
    }}</Observer>
  );
})`
  display: block !important;
  text-align: ${props => props.center ? 'center' : undefined};
`