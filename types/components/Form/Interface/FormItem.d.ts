import { FormStore } from '../FormStore';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ItemConfig } from '../../../stores';
export interface OFormItemCommon {
    code: string;
    formStore?: FormStore;
    antdForm?: WrappedFormUtils;
    itemConfig?: ItemConfig;
    [key: string]: any;
}
export * from '../../../stores/ItemConfig/interface';
