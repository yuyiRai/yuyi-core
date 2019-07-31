import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import { RowProps } from 'antd/lib/row';
import * as React from 'react';
import { IFormContainerProps } from './FormContainer';
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
export interface IFormProps<FM = object> extends IFormContainerProps {
    model?: FM;
    mapPropsToFields?: () => any;
    onFieldsChange?: (changedFields: any) => any;
    config: IFormItemConstructor<any, FM>[];
    form?: WrappedFormUtils<any>;
    formContainerRow?: RowProps;
    formItemLayout?: typeof defaultFormItemLayout;
    [key: string]: any;
}
export interface IFormState {
    fieldDecorator: GetFieldDecoratorOptions[];
}
export declare function useWaitingFormItem<P = {}>(Component: React.FunctionComponent<P>): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    delay: number;
    itemKey: string;
}> & React.RefAttributes<unknown>>;
export declare const FormItemGroup: React.FunctionComponent<IFormProps<object>>;
export declare const InjectedForm: import("antd/lib/form/interface").ConnectedComponentClass<({ form, ...props }: IFormProps<object>) => JSX.Element, Pick<IFormProps<object> & import("antd/lib/form").FormComponentProps<any>, React.ReactText>>;
export declare const ChildrenContext: React.Context<any>;
export declare function filterToValue(v: any, defaultValue?: any): any;
export declare const ConfigrationalForm: React.FunctionComponent<IFormProps>;
export {};
//# sourceMappingURL=Form.d.ts.map