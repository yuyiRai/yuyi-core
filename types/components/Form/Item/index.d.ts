/// <reference types="react" />
import { IReactComponent } from 'mobx-react';
import { FormItemType, IItemTypeComponent } from '../Interface/FormItem';
export declare const itemType: IItemTypeComponent;
export declare function ItemSwitchType<T extends FormItemType>(type?: T): IItemTypeComponent[T | 'text'];
export interface IItemSwitchProps {
    type?: FormItemType;
    Component: IReactComponent;
    [k: string]: any;
}
export declare function ItemSwitch({ Component, ...props }: IItemSwitchProps): JSX.Element;
export declare function getItemSwitch(type: FormItemType, props: any): JSX.Element;
export * from './DateItem';
export * from './InputItem';
