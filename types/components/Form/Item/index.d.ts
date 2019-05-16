import { IReactComponent } from 'mobx-react';
import React from 'react';
import { FormItemType, OFormItemCommon } from '../Interface/FormItem';
export declare function ItemSwitchType(type?: FormItemType): React.FunctionComponent<OFormItemCommon>;
export interface IItemSwitchProps {
    type?: FormItemType;
    Component: IReactComponent;
    [k: string]: any;
}
export declare function ItemSwitch({ Component, ...props }: IItemSwitchProps): JSX.Element;
export declare function getItemSwitch(type: FormItemType, props: any): JSX.Element;
export * from './DateItem';
export * from './InputItem';
