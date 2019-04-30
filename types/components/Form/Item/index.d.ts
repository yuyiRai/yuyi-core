import { FormItemType } from '../Interface/FormItem';
import React from 'react';
import { IReactComponent } from 'mobx-react';
export declare function ItemSwitchType(type?: FormItemType): React.FunctionComponent<any>;
export interface IItemSwitchProps {
    type?: FormItemType;
    Component: IReactComponent;
    [k: string]: any;
}
export declare function ItemSwitch({ Component, ...props }: IItemSwitchProps): JSX.Element;
export declare function getItemSwitch(type: FormItemType, props: any): JSX.Element;
export * from './InputItem';
export * from './DateItem';
