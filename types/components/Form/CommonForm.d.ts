import { IKeyValueMap } from 'mobx';
import * as React from 'react';
import { FormStore, onItemChangeCallback } from './FormStore';
export declare const NativeStore: React.Context<{
    formStore: FormStore<any, any>;
}>;
export interface ICommonFormProps extends IKeyValueMap {
    model: any;
    formStore?: FormStore;
    storeRef?: (store: FormStore) => void;
    onItemChange?: onItemChangeCallback;
}
export interface ICommonFormState extends IKeyValueMap {
    formStore: FormStore;
}
export declare const CommonFormContext: React.Context<{
    formProps: ICommonFormProps;
    formInstance: CommonForm;
}>;
export declare class CommonForm extends React.Component<ICommonFormProps, ICommonFormState> {
    constructor(props: ICommonFormProps);
    static getDerivedStateFromProps(nextProps: ICommonFormProps, prevState: ICommonFormState): ICommonFormState;
    render(): JSX.Element;
}
