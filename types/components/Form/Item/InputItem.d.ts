import { InputProps, TextAreaProps } from 'antd/lib/input';
import 'antd/lib/input/style/css';
import React, { FocusEventHandler, ChangeEventHandler } from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
export interface IHasShadowValueProps<V = any> extends OFormItemCommon {
    onChange?: ChangeEventHandler<V>;
    onBlur?: FocusEventHandler<V>;
    value?: V;
}
export declare function useShadowValue<P = any>(initValue: any, props: IHasShadowValueProps): {
    value: any;
    onChange(e: any): void;
    onBlur: (event: React.FocusEvent<any>) => void;
};
export declare type IInputItemProps = InputProps & OFormItemCommon;
export declare const InputItem: React.FunctionComponent<IInputItemProps>;
export declare type ITextAreaProps = TextAreaProps & OFormItemCommon;
export declare const TextAreaItem: React.FunctionComponent<ITextAreaProps>;
declare const Text: React.FunctionComponent<IInputItemProps>;
export default Text;