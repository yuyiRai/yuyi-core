import { IKeyValueMap } from 'mobx';
import * as React from 'react';
import { FormStore, onItemChangeCallback } from './FormStore';
export declare const NativeStore: React.Context<{
    formStore: FormStore<any, any>;
}>;
export interface ICommonFormProps<FM = object> extends IKeyValueMap {
    /**
     * 表单2
     */
    model: FM;
    formStore?: FormStore<FM>;
    storeRef?: (store: FormStore<FM>) => void;
    onItemChange?: onItemChangeCallback;
}
export interface ICommonFormState extends IKeyValueMap {
    formStore: FormStore;
}
export declare const CommonFormContext: React.Context<{
    formProps: ICommonFormProps<object>;
    formInstance: CommonForm;
}>;
export declare class CommonForm extends React.Component<ICommonFormProps, ICommonFormState> {
    constructor(props: ICommonFormProps);
    static getDerivedStateFromProps(nextProps: ICommonFormProps, prevState: ICommonFormState): ICommonFormState;
    render(): JSX.Element;
}
