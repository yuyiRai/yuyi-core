import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import 'antd/lib/row/style/css';
import * as React from 'react';
import { FormStore } from './FormStore';
import { IFormItemConstructor } from './Interface';
export interface IFormProps {
    formStore?: FormStore;
    config: IFormItemConstructor[];
    form?: WrappedFormUtils<any>;
    [key: string]: any;
}
export interface IFormState {
    fieldDecorator: GetFieldDecoratorOptions[];
}
export default class Form extends React.Component<IFormProps, any> {
    state: any;
    static getDerivedStateFromProps(nextProps: IFormProps, prevState: any): any;
    render(): JSX.Element;
}
export declare const StyledForm: import("styled-components").StyledComponent<typeof Form, any, {}, never>;
export declare const InjectedForm: any;
export declare const FormGroup: React.FunctionComponent<IFormProps>;
