import { FormComponentProps } from 'antd/lib/form';
import { IFormProps } from './Form';
import { IFormItemConfig } from './Interface';
import { IKeyValueMap } from 'mobx';
import { FormStore } from './FormStore';
import { WrappedFormUtils } from 'antd/lib/form/Form';
export declare function filterToValue(v: any, defaultValue?: any): any;
export declare const objToForm: (model: IKeyValueMap<any>, configList: IFormItemConfig[], store: FormStore<any>, form: WrappedFormUtils<any>) => {};
export declare const form: import("antd/lib/form/interface").FormWrappedProps<IFormProps & FormComponentProps<any>>;
