import { ItemConfig } from "../../stores";
import { FormItemProps } from 'antd/lib/form/FormItem';
import 'antd/lib/form/style/css';
import * as React from 'react';
import { FormStore } from '../../stores/FormStore';
import { FormItemStore } from './hooks';
import { OFormItemCommon } from './Interface/FormItem';
export interface IFormItemProps extends FormItemProps, OFormItemCommon {
}
export declare function withFormItem([code, formStore]: [string, FormStore]): {
    formStore: FormStore<any, import("../../stores/FormStore/FormItemStoreBase").IFormItemStoreConstructor<any, any, import("../../stores/FormStore/FormItemStoreBase").IFormItemStoreCore<any, any>>>;
    readonly store: FormItemStore<any, any>;
    dispose: (() => void) & import("mobx").IAction;
    readonly itemConfig: any;
    readonly configProps: {
        code: string;
        itemConfig: any;
    };
    readonly props: {
        help: JSX.Element;
        style: any;
        validateStatus: string;
        hasFeedback: boolean;
    };
};
export declare function useAntFormItem(props: FormItemProps): JSX.Element;
export declare const FormItemStoreContext: React.Context<React.MutableRefObject<{
    formStore: FormStore<any, import("../../stores/FormStore/FormItemStoreBase").IFormItemStoreConstructor<any, any, import("../../stores/FormStore/FormItemStoreBase").IFormItemStoreCore<any, any>>>;
    readonly store: FormItemStore<any, any>;
    dispose: (() => void) & import("mobx").IAction;
    readonly itemConfig: any;
    readonly configProps: {
        code: string;
        itemConfig: any;
    };
    readonly props: {
        help: JSX.Element;
        style: any;
        validateStatus: string;
        hasFeedback: boolean;
    };
}>>;
export declare type FormItemStoreContextType = React.MutableRefObject<ReturnType<typeof withFormItem>>;
export declare const FormItem: React.SFC<IFormItemProps>;
export default FormItem;
export declare const FormItemContainer: React.SFC<{
    itemConfig: ItemConfig;
}>;
export declare function useFormItemContainer(children: any, itemConfig: ItemConfig): JSX.Element;
//# sourceMappingURL=FormItem.d.ts.map