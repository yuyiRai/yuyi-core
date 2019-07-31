/// <reference types="react" />
import { FormItemType } from "../../../stores/ItemConfig/interface";
export interface OFormItemCommon {
    code: string;
    [key: string]: any;
}
declare global {
    type FormItemTypeGroup<T = any> = Record<FormItemType, T>;
    interface IFormItemComponentType extends Partial<FormItemTypeGroup<OFormItemCommon>> {
    }
}
export declare type IItemTypeComponent = {
    [K in FormItemType]?: React.FunctionComponent<IFormItemComponentType[K]>;
};
export * from "../../../stores/ItemConfig/interface";
//# sourceMappingURL=FormItem.d.ts.map