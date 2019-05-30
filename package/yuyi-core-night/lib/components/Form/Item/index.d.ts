import * as React from 'react';
import { FormItemType, IItemTypeComponent, OFormItemCommon } from '../Interface/FormItem';
export declare const itemType: IItemTypeComponent;
export declare function ItemSwitchType<T extends FormItemType>(type: T): IItemTypeComponent[T];
export declare function ItemSwitchType<T extends FormItemType>(type?: never | ""): IItemTypeComponent['text'];
export interface IItemSwitchProps extends OFormItemCommon {
    type: FormItemType;
    [k: string]: any;
}
export declare const ItemSwitch: React.ForwardRefExoticComponent<Pick<IItemSwitchProps, string | number> & React.RefAttributes<unknown>>;
export * from './DateItem';
export * from './InputItem';
