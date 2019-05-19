import React from 'react';
import { FormItemType, IItemTypeComponent, OFormItemCommon } from '../Interface/FormItem';
export declare const itemType: IItemTypeComponent;
export declare function ItemSwitchType<T extends FormItemType>(type?: T): IItemTypeComponent[T | 'text'];
export interface IItemSwitchProps extends OFormItemCommon {
    type: FormItemType;
    [k: string]: any;
}
export declare const ItemSwitch: React.ForwardRefExoticComponent<Pick<IItemSwitchProps, React.ReactText> & React.RefAttributes<{}>>;
export * from './DateItem';
export * from './InputItem';
