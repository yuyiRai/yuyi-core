import { ItemConfig } from "../../../stores";
import { Option } from "../../../utils";
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import 'element-ui/lib/theme-chalk/switch.css';
import * as React from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
export interface ICheckItemProps extends CheckboxGroupProps, OFormItemCommon {
}
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
export declare const useCheckItem: ({ code, onChange, onBlur, ...other }: ICheckItemProps, ref: any) => JSX.Element;
interface SwitchProps {
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
export declare const useSwitchItem: React.FunctionComponent<ISwitchItemProps>;
export {};
//# sourceMappingURL=CheckItem.d.ts.map