import React from 'react';
import { FormItemType, IItemTypeComponent, OFormItemCommon } from '../Interface/FormItem';
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
export const itemType: IItemTypeComponent = {
  'text': InputItem,
  'textArea': TextAreaItem,
  'textarea': TextAreaItem,
  'date': DatePickerItem,
  'dateTime': DatePickerItem,
  'dateToDate': DateRangePickerItem,
  'check': CheckItem,
  'checkOne': SwitchItem,
  'switch': SwitchItem,
  'radio': RadioItem,
  'radioOne': RadioOneItem,
  'number': InputNumberItem,
  'search': SearchItem,
  'select': SearchItem,
  'cascader': CascaderItem,
  'selectTree': SelectTreeItem,
  'group': GroupItem
}

export function ItemSwitchType<T extends FormItemType>(type?: T): IItemTypeComponent[T | 'text'] {
  return itemType[type] || InputItem
}
export interface IItemSwitchProps extends OFormItemCommon {
  type: FormItemType;
  [k: string]: any;
}
export const ItemSwitch = React.forwardRef(({type, ...props}: IItemSwitchProps, ref) => {
  const Component = ItemSwitchType(type);
  // console.log(props)
  return <Component ref={ref} {...props}/>
})

export * from './DateItem';
export * from './InputItem';

