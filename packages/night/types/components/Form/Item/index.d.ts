import * as React from 'react';
import Loadable from 'react-loadable';
import { FormItemType, IItemTypeComponent, OFormItemCommon } from '../Interface/FormItem';
export declare const Loader: (loader: (() => Promise<React.ComponentClass<any, any> | React.FunctionComponent<any> | {
    default: React.ComponentType<any>;
}>) | (() => Promise<any>)) => (React.ComponentClass<any, any> & Loadable.LoadableComponent) | (React.FunctionComponent<any> & Loadable.LoadableComponent);
export declare const itemType: IItemTypeComponent;
export declare function ItemSwitchType<T extends FormItemType>(type: T): IItemTypeComponent[T];
export declare function ItemSwitchType<T extends FormItemType>(type?: never | ""): IItemTypeComponent['text'];
export interface IItemSwitchProps extends OFormItemCommon {
    type: FormItemType;
    [k: string]: any;
}
export declare function checkItemSwitch(type: FormItemType): React.FunctionComponent<OFormItemCommon> | React.FunctionComponent<import("./InputItem").IInputItemProps> | React.FunctionComponent<import("./InputItem").ITextAreaItemProps>;
export declare const isUseHooks: {
    [x: string]: React.FunctionComponent<OFormItemCommon> | React.FunctionComponent<import("./InputItem").IInputItemProps> | React.FunctionComponent<import("./InputItem").ITextAreaItemProps>;
};
export declare function useItemSwitch(type: FormItemType, props: OFormItemCommon, ref: React.Ref<any>): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
export declare const ItemSwitch: React.ForwardRefExoticComponent<Pick<IItemSwitchProps, string | number> & React.RefAttributes<unknown>>;
export * from './DateItem';
export * from './InputItem';
//# sourceMappingURL=index.d.ts.map