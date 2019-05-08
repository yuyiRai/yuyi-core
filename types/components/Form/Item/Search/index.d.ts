import * as React from 'react';
import { SelectProps, OptGroupProps } from 'antd/lib/select/index';
import 'antd/lib/select/style/css';
import { OFormItemCommon, IItemConfig } from '../../Interface';
import { IReactComponent } from 'mobx-react';
export interface ISelectItemProps extends OFormItemCommon, SelectProps {
    center?: boolean;
}
export declare const SearchItem: React.FunctionComponent<ISelectItemProps>;
export interface ISearchResultGroupProps extends OptGroupProps {
    disabled?: boolean;
}
export declare const OSearchResultGroup: React.FunctionComponent<ISearchResultGroupProps>;
export declare function preSwitchContainer<P>(Container: IReactComponent<P>): (props: P & {
    key?: any;
}, children: JSX.Element | JSX.Element[], switchValue: boolean) => JSX.Element | JSX.Element[];
export declare function switchContainer<P>(Container: IReactComponent<P>, props: P & {
    key?: any;
}, children: JSX.Element | JSX.Element[], switchValue: boolean): JSX.Element | JSX.Element[];
export declare const getSelectModel: import("mobx-utils").ITransformer<IItemConfig, "tags" | "multiple">;
export declare const getNotFoundContent: import("mobx-utils").ITransformer<IItemConfig, JSX.Element>;
export declare const OSearchItem: React.FunctionComponent<ISelectItemProps>;
