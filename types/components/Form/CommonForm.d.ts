import * as React from 'react';
import { IFormItemConfig } from './Interface';
import { IKeyValueMap } from 'mobx';
import { FormStore } from './FormStore';
export declare const NativeStore: React.Context<{
    storeForm: any;
}>;
export interface ICommonFormProps extends IKeyValueMap {
    model: any;
    config?: IFormItemConfig[];
    formStore?: FormStore;
    storeRef?: (store: FormStore) => void;
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
