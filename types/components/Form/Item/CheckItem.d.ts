import { CheckboxGroupProps } from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style/css';
import 'element-theme-default/lib/switch.css';
import * as React from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
export interface IAppProps extends CheckboxGroupProps, OFormItemCommon {
}
export declare const CheckItem: React.FunctionComponent<IAppProps>;
interface SwitchProps extends ElementReactLibs.ComponentProps<{}> {
    value?: number | string | boolean;
    disabled?: boolean;
    width?: number;
    onIconClass?: string;
    offIconClass?: string;
    onText?: string;
    offText?: string;
    onColor?: string;
    offColor?: string;
    onValue?: number | string | boolean;
    offValue?: number | string | boolean;
    name?: string;
    onChange?(value: number | string | boolean): void;
}
export interface ISwitchItemProps extends SwitchProps, OFormItemCommon {
}
export declare const SwitchItem: React.FunctionComponent<ISwitchItemProps>;
export {};
