import { ItemConfig } from "../../../stores";
import { Option } from "../../../utils";
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style/css';
import 'element-ui/lib/theme-chalk/switch.css';
import * as React from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
export interface IAppProps extends CheckboxGroupProps, OFormItemCommon {
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
export declare const useCustomItem: React.FunctionComponent<IAppProps>;
//# sourceMappingURL=CustomItem.d.ts.map