import * as React from 'react';
import { SelectProps } from 'antd/lib/select/index';
import { OFormItemCommon } from '../../Interface';
import 'rc-tween-one/dist/rc-tween-one.js';
export interface ISelectItemProps extends OFormItemCommon, SelectProps {
    center?: boolean;
}
export declare const SearchItem: React.FunctionComponent<ISelectItemProps>;
export declare const OSearchItem: React.FunctionComponent<ISelectItemProps>;
