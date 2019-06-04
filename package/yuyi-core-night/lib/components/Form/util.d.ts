import { FormComponentProps } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IKeyValueMap } from 'mobx';
import { FormStore } from '../../stores/FormStore';
import { IFormProps } from './Form';
export declare function filterToValue(v: any, defaultValue?: any): any;
export declare const objToForm: (model: IKeyValueMap<any>, store: FormStore<any, import("../../stores/FormStore/FormItemStoreBase").IFormItemStoreCore<any, any>>, form: WrappedFormUtils<any>) => {};
export declare const form: import("antd/lib/form/interface").FormWrappedProps<IFormProps<object> & FormComponentProps<any>>;
