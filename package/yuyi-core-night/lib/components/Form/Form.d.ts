import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import 'antd/lib/row/style/css';
import * as React from 'react';
import { CommonForm } from './CommonForm';
import { FormStore } from '../../stores/FormStore';
import { IFormItemConstructor } from './Interface';
declare const defaultFormItemLayout: {
    labelCol: {
        span: number;
        offset: number;
    };
    wrapperCol: {
        span: number;
        offset: number;
    };
};
export interface IFormProps<FM = object> {
    model?: FM;
    formInstance?: CommonForm;
    formStore?: FormStore;
    config: IFormItemConstructor<any, FM>[];
    form?: WrappedFormUtils<any>;
    labelWidth?: number;
    formItemLayout?: typeof defaultFormItemLayout;
    [key: string]: any;
}
export interface IFormState {
    fieldDecorator: GetFieldDecoratorOptions[];
}
export declare const FormItemGroup: (props: IFormProps<object>) => JSX.Element;
export default class Form extends React.Component<IFormProps, any> {
    state: any;
    static getDerivedStateFromProps(nextProps: IFormProps, prevState: any): any;
    render(): JSX.Element;
    static defaultProps: {
        labelWidth: number;
    };
}
export declare const InjectedForm: import("antd/lib/form/interface").ConnectedComponentClass<typeof Form, Pick<IFormProps<object> & import("antd/lib/form/Form").FormComponentProps<any>, string | number>>;
export declare const FormGroup: React.FunctionComponent<IFormProps>;
export {};
