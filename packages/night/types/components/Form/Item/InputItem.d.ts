import Input, { InputProps, TextAreaProps } from 'antd/lib/input';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
export declare type IHasShadowValueProps<C, V = any> = OFormItemCommon & {
    value?: V;
} & Partial<C extends React.Component<infer P> ? P : any>;
export declare function useShadowValue<C extends Input | TextArea, V extends string = any>(initValue: V, props: IHasShadowValueProps<C, V>, ref: React.Ref<C>): {
    onBlur: React.FocusEventHandler<any>;
    onChange: React.ChangeEventHandler<any>;
    value: any;
};
declare global {
    interface IFormItemComponentType {
        'text': IInputItemProps;
        'textArea': ITextAreaItemProps;
        'textarea': ITextAreaItemProps;
    }
}
export declare type IInputItemProps = InputProps & OFormItemCommon;
export declare const useInputItem: (props: IInputItemProps, ref: any) => JSX.Element;
export declare type ITextAreaItemProps = TextAreaProps & OFormItemCommon;
export declare const useTextAreaItem: React.FunctionComponent<ITextAreaItemProps>;
export default useInputItem;
//# sourceMappingURL=InputItem.d.ts.map