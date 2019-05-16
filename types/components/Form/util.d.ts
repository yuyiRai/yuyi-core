import { FormComponentProps } from 'antd/lib/form';
import { IFormProps } from './Form';
import { IKeyValueMap } from 'mobx';
import { FormStore } from './FormStore';
import { WrappedFormUtils } from 'antd/lib/form/Form';
export declare function filterToValue(v: any, defaultValue?: any): any;
export declare const objToForm: (model: IKeyValueMap<any>, store: FormStore<any, import("./FormStore/FormItemStoreBase").IFormItemStoreConstructor<any, any>>, form: WrappedFormUtils<any>) => {};
export declare const form: import("antd/lib/form/interface").FormWrappedProps<IFormProps<any> & FormComponentProps<any>>;
