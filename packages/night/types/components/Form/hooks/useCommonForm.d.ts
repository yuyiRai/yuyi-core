import { UseSafeStoreProviderReturns } from "../../../hooks";
import { CommonStore } from "../../../stores/CommonStore";
import { FormStore } from "../../../stores/FormStore";
import { FormItemStoreCore, IFormItemStoreConstructor, IFormItemStoreCore } from "../../../stores/FormStore/FormItemStoreBase";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { IReactionDisposer } from "mobx";
import * as React from 'react';
import { ICommonFormProps } from "../CommonForm";
export declare type CommonFormStoreContextRef<FM> = UseSafeStoreProviderReturns<CommonFormStore<FM>>;
export declare function createFormStoreContext<FM = any>(init?: CommonFormStoreContextRef<FM>): React.Context<[{
    useCallback?: import("../../../hooks").SafeCallbackFactory<CommonFormStore<FM>>;
    useObserver<R>(fn: (store: CommonFormStore<FM>) => R, deps?: any[], useName?: string): R;
    useComputedChild?: (fn: (store: CommonFormStore<FM>) => any, deps?: any[]) => any;
}, React.MutableRefObject<import("../../../hooks").SafeRef<CommonFormStore<FM>>>]>;
export declare const FormStoreContext: React.Context<[{
    useCallback?: import("../../../hooks").SafeCallbackFactory<CommonFormStore<any>>;
    useObserver<R>(fn: (store: CommonFormStore<any>) => R, deps?: any[], useName?: string): R;
    useComputedChild?: (fn: (store: CommonFormStore<any>) => any, deps?: any[]) => any;
}, React.MutableRefObject<import("../../../hooks").SafeRef<CommonFormStore<any>>>]>;
export declare const CommonFormCoreContext: React.Context<React.Context<CommonFormStore<any>>>;
export declare function factory<FM extends any>(props: ICommonFormProps<FM>): CommonFormStore<FM>;
export declare function useFormStoreContextProvider<FM>(props: ICommonFormProps<FM>): (props: {
    children?: React.ReactNode;
}) => JSX.Element;
export declare function useFormCoreContext<FM>(init?: CommonFormStore<FM>): {
    core: CommonFormStore<FM>;
    Provider: React.ProviderExoticComponent<Partial<React.ProviderProps<CommonFormStore<FM>>>>;
};
export declare type CommonFormStoreInitParam<FM> = {
    props: ICommonFormProps<FM>;
    ref?: React.MutableRefObject<CommonFormStore>;
};
export declare class CommonFormStore<FM = any> extends CommonStore {
    formStore: FormStore<FM>;
    formProps: ICommonFormProps<FM>;
    lastModel: FM;
    init({ props, ref }: CommonFormStoreInitParam<FM>): this;
    nextModel(model: FM): void;
    disposedLastForm(): void;
    setFormStore(formStore: FormStore): void;
    useItemStore(code: string): FormItemStore<FM>;
    readonly itemStores: any[];
}
export declare class FormItemStore<FM = any, V = any> extends FormItemStoreCore<FM, V> implements IFormItemStoreCore<FM, V> {
    formStore: FormStore<FM, IFormItemStoreConstructor<FM>>;
    ruleWatcher: IReactionDisposer;
    validateReset: IReactionDisposer;
    constructor(formStore: FormStore<FM, any>, code: string);
    readonly antdForm: WrappedFormUtils;
    setAntdForm(antdForm: WrappedFormUtils): void;
    init(): void;
    readonly fieldDecorator: (node: import("react").ReactNode) => import("react").ReactNode;
    readonly decoratorOptions: {
        validateTrigger: string[];
        rules: import("../Interface").IRuleConfig<any>[];
        initialValue: any;
        getValueProps: (value: any) => {
            value: any;
        };
    };
    readonly render: import("react").ReactNode;
    readonly Component: JSX.Element;
}
export declare class ExportStore extends CommonStore {
    store: FormItemStore;
    constructor();
    init2(list: any): void;
    init(formStore: any, code: any): void;
}
//# sourceMappingURL=useCommonForm.d.ts.map