import { IReactComponent } from 'mobx-react';
import React from 'react';
import { FormItemType, OFormItemCommon } from '../Interface/FormItem';
import { CascaderItem } from './Cascader';
// import { IInputItemProps, ITextAreaItemProps } from './InputItem';
import { CheckItem, SwitchItem } from './CheckItem';
import { DatePickerItem, DateRangePickerItem } from './DateItem';
import GroupItem from './GroupItem';
import { InputItem, TextAreaItem } from './InputItem';
import { InputNumberItem } from './NumberInputItem';
import { RadioItem, RadioOneItem } from './RadioItem';
import { SearchItem } from './Search';
import { SelectTreeItem } from './SelectTreeItem';


// export function ItemSwitchType(type?: 'text' | string): React.FunctionComponent<IInputItemProps>;
// export function ItemSwitchType(type: 'textArea' | 'textarea'): React.FunctionComponent<ITextAreaItemProps>;
// export function ItemSwitchType(type: 'date' | 'dateTime'): React.FunctionComponent<IDatePickerItemProps>;
// export function ItemSwitchType(type: 'dateToDate'): React.FunctionComponent<IDateRangePickerItemmProps>;

export function ItemSwitchType(type?: FormItemType): React.FunctionComponent<OFormItemCommon> {
  switch (type) {
    case 'text': return InputItem;
    case 'textArea': return TextAreaItem;
    case 'textarea': return TextAreaItem;
    case 'date': return DatePickerItem;
    case 'dateTime': return DatePickerItem;
    case 'dateToDate': return DateRangePickerItem;
    case 'check': return CheckItem;
    case 'checkOne': return SwitchItem;
    case 'switch': return SwitchItem;
    case 'radio': return RadioItem;
    case 'radioOne': return RadioOneItem;
    case 'number': return InputNumberItem;
    case 'search': return SearchItem;
    case 'select': return SearchItem;
    case 'cascader': return CascaderItem;
    case 'selectTree': return SelectTreeItem;
    case 'group': return GroupItem;
    default: return InputItem;
  }
}
export interface IItemSwitchProps {
  type?: FormItemType;
  Component: IReactComponent;
  [k: string]: any;
}
export function ItemSwitch({Component, ...props}: IItemSwitchProps) {
  const [state, setstate] = React.useState(props.value)
  console.log(props)
  return <Component {...props} {...{state, setstate}}/>
}
export function getItemSwitch(type: FormItemType, props: any) {
  const Component = ItemSwitchType(type)
  return <ItemSwitch Component={Component} {...props}/>
}

export * from './DateItem';
export * from './InputItem';
