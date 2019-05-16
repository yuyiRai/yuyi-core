import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import 'antd/lib/row/style/css';
import * as React from 'react';
import { FormStore } from './FormStore';
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
export interface IFormProps {
    formStore?: FormStore;
    config: IFormItemConstructor[];
    form?: WrappedFormUtils<any>;
    labelWidth?: number;
    formItemLayout?: typeof defaultFormItemLayout;
    [key: string]: any;
}
export interface IFormState {
    fieldDecorator: GetFieldDecoratorOptions[];
}
export declare const FormContainer: import("styled-components").StyledComponent<"form", any, IFormProps, never>;
export default class Form extends React.Component<IFormProps, any> {
    state: any;
    static getDerivedStateFromProps(nextProps: IFormProps, prevState: any): any;
    render(): JSX.Element;
    static defaultProps: {
        labelWidth: number;
    };
}
export declare const InjectedForm: import("antd/lib/form/interface").ConnectedComponentClass<typeof Form, Pick<import("./Form").IFormProps & import("antd/lib/form/Form").FormComponentProps<any>, React.ReactText>>;
export declare const FormGroup: React.FunctionComponent<IFormProps>;
export {};
