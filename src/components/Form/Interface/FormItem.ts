import { FormStore } from '../FormStore';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ItemConfig } from '../../../stores';
export interface OFormItemCommon {
  code: string;
  formStore?: FormStore;
  antdForm?: WrappedFormUtils;
  itemConfig?: ItemConfig;
}
export * from '../../../stores/ItemConfig/interface'