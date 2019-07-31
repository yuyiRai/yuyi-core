import Select from "antd/lib/select";
import "antd/lib/select/style/css.js";
import { OptGroupProps, SelectProps } from 'antd/lib/select/index';
import * as React from 'react';
import { IItemConfig, OFormItemCommon } from '../../Interface';
export interface ISelectItemProps extends OFormItemCommon, SelectProps {
    center?: boolean;
}
export declare const useSearchItem: React.SFC<ISelectItemProps>;
export interface ISearchResultGroupProps extends OptGroupProps {
    disabled?: boolean;
}
export declare function preSwitchContainer(container: JSX.Element): (children: JSX.Element | JSX.Element[], switchValue: boolean) => JSX.Element | JSX.Element[];
export declare function switchContainer(container: JSX.Element, children: JSX.Element | JSX.Element[], switchValue: boolean): JSX.Element | JSX.Element[];
export declare const getNotFoundContent: (itemConfig: IItemConfig<import("mobx").IKeyValueMap<any>, any, any>) => JSX.Element;
export declare const StyledSelect: import("styled-components").StyledComponent<typeof Select, any, {
    dropdownMenuStyle: {
        textAlign: import("csstype").TextAlignProperty;
    };
}, "dropdownMenuStyle">;
//# sourceMappingURL=index.d.ts.map