import { CheckboxGroupProps } from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style/css';
import 'element-theme-default/lib/switch.css';
import * as React from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
import { Option } from '@/utils';
import { ItemConfig } from '@/stores';
export interface IAppProps extends CheckboxGroupProps, OFormItemCommon {
}
export declare const CheckItem: React.FunctionComponent<IAppProps>;
export declare type CheckScopedSlot<FM = object, VALUE = any> = (props: {
    col: {
        data: VALUE;
        item: Option;
        index: number;
        props: FM;
    };
    onChange: any;
    value: boolean;
    config: ItemConfig;
}) => React.ReactElement;
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
