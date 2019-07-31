import { IKeyValueMap } from 'mobx';
import * as React from 'react';
import { FormStore, onItemChangeCallback } from '../../stores/FormStore';
export interface ICommonFormProps<FM = object> extends IKeyValueMap {
    /**
     * 表单2
     */
    model: FM;
    storeRef?: (instance: {
        formStore: FormStore<FM>;
    }) => void;
    onItemChange?: onItemChangeCallback;
}
export interface ICommonFormState extends IKeyValueMap {
    formProps: ICommonFormProps;
    formStore: FormStore;
}
export declare const CommonFormContext: React.Context<ICommonFormState>;
export declare const CommonForm: React.SFC<ICommonFormProps>;
export default CommonForm;
//# sourceMappingURL=CommonForm.d.ts.map