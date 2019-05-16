import { ItemConfig } from '@/stores';
import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import { FormItemProps } from 'antd/lib/form/FormItem';
import 'antd/lib/form/style/css';
import { IReactionDisposer } from 'mobx';
import * as React from 'react';
import { FormStore } from './FormStore';
import { FormItemStoreCore, IFormItemStoreCore } from './FormStore/FormItemStoreBase';
import { OFormItemCommon } from './Interface/FormItem';
export declare const ChildrenContext: React.Context<{
    children: any;
}>;
export interface IFormItemProps extends FormItemProps, OFormItemCommon {
    store?: FormItemStore;
}
export interface IFormItemState {
    instance: FormItem;
    init: boolean;
}
export declare const OAntFormItem: (props: any) => JSX.Element;
export declare class FormItemStore<FM = any, V = any> extends FormItemStoreCore<FM, V> implements IFormItemStoreCore<FM, V> {
    formStore: FormStore<FM, typeof FormItemStore>;
    ruleWatcher: IReactionDisposer;
    validateReset: IReactionDisposer;
    constructor(formStore: FormStore<FM, any>, code: string);
    readonly antdForm: WrappedFormUtils;
    setAntdForm(antdForm: WrappedFormUtils): void;
    init(): void;
    dispose(): void;
    readonly fieldDecorator: (node: React.ReactNode) => React.ReactNode;
    getFieldDecorator: (store: FormItemStore<FM, V>) => (node: React.ReactNode) => React.ReactNode;
    readonly decoratorOptions: GetFieldDecoratorOptions;
    getFieldDecoratorOptions: import("mobx-utils").ITransformer<ItemConfig<V, FM>, GetFieldDecoratorOptions>;
    readonly Component: JSX.Element;
    readonly renderer: (children: JSX.Element) => JSX.Element;
}
export default class FormItem extends React.Component<IFormItemProps, IFormItemState> {
    constructor(props: IFormItemProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export declare class FormItemContainer extends React.Component<{
    itemConfig: ItemConfig;
}, IFormItemState> {
    lastContainerProps: {};
    static contextType: React.Context<{
        children: any;
    }>;
    styleTransform: import("mobx-utils").ITransformer<ItemConfig<any, import("mobx").IKeyValueMap<any>>, {
        display: string;
    }>;
    propsTransform: import("mobx-utils").ITransformer<ItemConfig<any, import("mobx").IKeyValueMap<any>>, {
        type: import("./Interface/FormItem").FormItemType;
        displayProps: {
            colSpan: any;
            useColumn: any;
        };
        lg: any;
        sm: any;
        xs: any;
        offset: any;
    }>;
    readonly style: {
        display: string;
        maxHeight: string;
    };
    readonly containerProps: {
        type: import("./Interface/FormItem").FormItemType;
        displayProps: {
            colSpan: any;
            useColumn: any;
        };
        lg: any;
        sm: any;
        xs: any;
        offset: any;
    };
    readonly renderer: {};
    render(): {};
}
