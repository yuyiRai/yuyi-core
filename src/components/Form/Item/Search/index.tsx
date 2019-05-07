import * as React from 'react'
import { Select, Spin, Tag } from 'antd';
import { SelectProps } from 'antd/lib/select/index';
import { Observer } from 'mobx-react-lite';
import { useOptionsStore, useSearchStore } from '../OptionsUtil';
import { OptionsStore } from '../../../../stores';
import { OFormItemCommon } from '../../Interface';
import { commonInjectItem } from '../commonInjectItem';
import styled from 'styled-components';
import { ValueHintContainer } from '../OptionsUtil/ToolTipContainer';
import { TweenOneGroup } from 'rc-tween-one';
import 'rc-tween-one/dist/rc-tween-one.js';

export interface ISelectItemProps extends OFormItemCommon, SelectProps {
  center?: boolean;
}
export const SearchItem: React.FunctionComponent<ISelectItemProps> = commonInjectItem((props: ISelectItemProps) => {
  return <OSearchItem {...props} center />;
})

export const OSearchItem: React.FunctionComponent<ISelectItemProps> = styled((props: ISelectItemProps) => {
  const { antdForm, formStore, code, itemConfig, ...other } = props
  const searchStore = useSearchStore(itemConfig)
  const [ visible, changeVisible ] = React.useState(undefined)
  const [ tagin, changeTagin ] = React.useState(false)
  const { transformOption, displayOptions, selectedLablesConfig, hasSelectedTag } = useOptionsStore(itemConfig, (store: OptionsStore<JSX.Element>) => {
    return store.displayOptions.map(d => <Select.Option title={d.label} key={d.key} value={d.value}>{d.label}</Select.Option>);
  })
  const trigger = tagin?['click']:['hover']
  console.log(props, displayOptions, transformOption, Utils.valuesToLabels(displayOptions, props.value as string), trigger)
  const hint = (
    <TweenOneGroup
      enter={{
        scale: 0.8, opacity: 0, type: 'from', duration: 100,
        onComplete: (e) => {
          e.target.setAttribute('style', '')
        },
      }}
      leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
      appear={false}
    >{selectedLablesConfig.map((v) =>
      <Tag key={v.label} color="blue" closable
        onClose={(e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          other.onChange(v.remove(e), transformOption)
          console.log(e)
          if(!tagin)
            changeTagin(true)
        }}>{v.label}</Tag>)
    }</TweenOneGroup>
  )
  return (
    <Observer>{() =>
      <ValueHintContainer value={hint} visible={hasSelectedTag ? visible : false} trigger={trigger}>
        <Select mode='tags'
          showSearch
          defaultActiveFirstOption={false}
          showArrow={true}
          filterOption={searchStore.filterOption}
          onSearch={searchStore.onSearch}
          notFoundContent={itemConfig.loading ? <Spin size="small" /> : undefined}
          loading={itemConfig.loading} dropdownClassName='dropmenu123'
          {...other}
          onChange={e => {
            props.onChange(e, transformOption)
            if(!tagin)
              changeTagin(true)
          }}
          onDropdownVisibleChange={open => {
            changeVisible(open ? open : ( tagin ? false : undefined))
            if(tagin)
              changeTagin(false)
          }}
        >
          {transformOption}
        </Select>
      </ValueHintContainer>
    }</Observer>
  );
})`
  display: block !important;
  dropmenu123 {
    text-align: ${props => props.center ? 'center' : undefined};
  }
`