import { FormItemType } from '../Interface/FormItem';
import React from 'react'

import { DatePickerItem, DateRangePickerItem } from './DateItem';
import { InputItem, TextAreaItem } from './InputItem';
import { CheckItem, SwitchItem } from './CheckItem';
import { InputNumberItem } from './NumberInputItem';
import { RadioItem } from './RadioItem';
import { IReactComponent } from 'mobx-react';
import { SearchItem } from './Search';
export function ItemSwitchType(type?: FormItemType): React.FunctionComponent<any> {
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
    case 'number': return InputNumberItem;
    case 'search': return SearchItem;
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

export * from './InputItem'
export * from './DateItem'