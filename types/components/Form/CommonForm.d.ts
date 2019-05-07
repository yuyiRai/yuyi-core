import * as React from 'react';
import { IFormItemConstructor } from './Interface';
import { IKeyValueMap } from 'mobx';
import { FormStore, onItemChangeCallback } from './FormStore';
export declare const NativeStore: React.Context<{
    formStore: any;
}>;
export interface ICommonFormProps extends IKeyValueMap {
    model: any;
    config?: IFormItemConstructor[];
    formStore?: FormStore;
    storeRef?: (store: FormStore) => void;
    onItemChange?: onItemChangeCallback;
}
export interface ICommonFormState extends IKeyValueMap {
    formStore: FormStore;
}
export declare class CommonForm extends React.Component<ICommonFormProps, ICommonFormState> {
    constructor(props: ICommonFormProps);
    state: ICommonFormState;
    static defaultProps: {
        model: {};
    };
    static getDerivedStateFromProps(nextProps: ICommonFormProps, prevState: ICommonFormState): ICommonFormState;
    render(): JSX.Element;
}
