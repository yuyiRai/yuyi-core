import { FormStore } from '../FormStore';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ItemConfig } from '../../../stores';
export type FormItemType<T extends string = string> = "" | "text" 
| 'number' 
| 'date' | 'dateTime' | 'dateToDate' 
| 'select' | 'search' 
| 'check' | 'radio' 
| 'checkOne' | 'switch' | T | undefined | null | never

export interface IFormItemConfig {
  type?: FormItemType;
  code: string | '_';
  label?: string;
  value?: any;
  defaultValue?: any;
  options?: any[];
  rule?: any[] | string;
  remoteMethod?: <T = any>(key: string) => Promise<T>
}

export interface OFormItemCommon {
  code: string;
  storeForm?: FormStore;
  antdForm?: WrappedFormUtils;
  itemConfig?: ItemConfig;
}