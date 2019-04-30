import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormItemProps } from 'antd/lib/form/FormItem';
import 'antd/lib/form/style/css';
import * as React from 'react';
import { ItemConfig } from '../../stores';
import { OFormItemCommon } from './Interface/FormItem';
import { IReactionDisposer } from 'mobx';
import { FormStore } from './FormStore';
export interface IFormItemProps extends FormItemProps, OFormItemCommon {
    store?: FormItemStore;
}
export interface IFormItemState {
    instance: FormItem;
    init: boolean;
}
export declare const OAntFormItem: (props: any) => JSX.Element;
export declare class FormItemStore {
    ruleWatcher: IReactionDisposer;
    validateReset: IReactionDisposer;
    itemConfig: ItemConfig;
    storeForm: FormStore;
    readonly antdForm: WrappedFormUtils;
    setAntdForm(antdForm: WrappedFormUtils): void;
    constructor(storeForm: FormStore, code: string);
    readonly code: string;
    init(): void;
    dispose(): void;
    readonly fieldDecorator: (node: React.ReactNode) => React.ReactNode;
    getFieldDecorator: (store: FormItemStore) => (node: React.ReactNode) => React.ReactNode;
    readonly decoratorOptions: {
        validateTrigger: string[];
        rules: import("../../stores").RuleConfig<any>[];
        initialValue: any;
        getValueProps(): {
            value: any;
        };
    };
    getFieldDecoratorOptions: import("mobx-utils").ITransformer<ItemConfig, {
        validateTrigger: string[];
        rules: import("../../stores").RuleConfig<any>[];
        initialValue: any;
        getValueProps(): {
            value: any;
        };
    }>;
    readonly Component: JSX.Element;
    readonly renderer: (children: JSX.Element) => JSX.Element;
}
export default class FormItem extends React.Component<IFormItemProps, IFormItemState> {
    constructor(props: IFormItemProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export declare class FormItemContainer extends React.Component<any, IFormItemState> {
    lastContainerProps: {};
    styleTransform: import("mobx-utils").ITransformer<ItemConfig, {
        display: string;
    }>;
    propsTransform: import("mobx-utils").ITransformer<ItemConfig, {
        type: any;
        displayProps: {
            colSpan: number;
            useColumn: any;
        };
        lg: any;
        sm: any;
        xs: any;
        offset: any;
    }>;
    readonly style: {
        display: string;
    };
    readonly containerProps: {
        type: any;
        displayProps: {
            colSpan: number;
            useColumn: any;
        };
        lg: any;
        sm: any;
        xs: any;
        offset: any;
    };
    readonly children: JSX.Element;
    readonly renderer: JSX.Element;
    render(): JSX.Element;
}
