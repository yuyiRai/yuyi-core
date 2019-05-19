import { Select } from 'antd';
import { OptGroupProps, SelectProps } from 'antd/lib/select/index';
import * as React from 'react';
import { IItemConfig, OFormItemCommon } from '../../Interface';
export interface ISelectItemProps extends OFormItemCommon, SelectProps {
    center?: boolean;
}
export declare const SearchItem: React.FunctionComponent<ISelectItemProps>;
export interface ISearchResultGroupProps extends OptGroupProps {
    disabled?: boolean;
}
export declare function preSwitchContainer(container: JSX.Element): (children: JSX.Element | JSX.Element[], switchValue: boolean) => JSX.Element | JSX.Element[];
export declare function switchContainer(container: JSX.Element, children: JSX.Element | JSX.Element[], switchValue: boolean): JSX.Element | JSX.Element[];
export declare const getSelectModel: import("mobx-utils").ITransformer<IItemConfig<import("mobx").IKeyValueMap<any>, any, any>, "multiple" | "tags">;
export declare const getNotFoundContent: import("mobx-utils").ITransformer<IItemConfig<import("mobx").IKeyValueMap<any>, any, any>, JSX.Element>;
export declare const StyledSelect: import("styled-components").StyledComponent<typeof Select, any, {
    dropdownMenuStyle: {
        textAlign: import("csstype").TextAlignProperty;
    };
}, "dropdownMenuStyle">;
export declare const OSearchItem: React.FunctionComponent<any>;