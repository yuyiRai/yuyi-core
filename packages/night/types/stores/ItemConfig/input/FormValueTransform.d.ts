import { FormModel } from '../interface';
export declare type FilterTypeKey<K = string> = 'group' | 'path' | 'dateTime' | 'date' | 'dateToDate' | K;
export declare type FilterType<FM, FV = any, CV = any> = FilterTypeKey | IFormValueTransform<FM, FV, CV>;
export declare enum TransformerType {
    NONE = 0,
    /**
     * form值转换为组件值(component-value, form-field-value)
     */
    F2V = 1,
    /**
     * 组件值(component-value, form-field-value)转换为form值
     */
    V2F = 2
}
export interface IFormValueTransformHandler<FM, PS = any, PT = any> {
    <S = any, T = any>(value: PS | S, form?: FM): PT | T;
}
export interface IFormTransformHandler<FM, PV = any> {
    <V = any>(value: PV | V, form: FM): FM;
}
export interface IFormValueTransform<FM, FV = any, CV = any> {
    F2V: IFormValueTransformHandler<FM, FV, CV>;
    V2F: IFormValueTransformHandler<FM, CV, FV>;
    Form2ComponentModel?: IFormTransformHandler<FM, FV>;
    Component2FormModel?: IFormTransformHandler<FM, CV>;
}
export declare class FormValueTransform<FM extends FormModel, FV = any, CV = any> implements IFormValueTransform<FM, FV, CV> {
    private type;
    private code;
    postInit(type: FilterType<FM>, code: string): this;
    readonly F2V: IFormValueTransformHandler<FM, any, any>;
    readonly V2F: IFormValueTransformHandler<FM, any, any>;
    readonly Component2FormModel: IFormTransformHandler<FM, CV>;
    readonly Form2ComponentModel: IFormTransformHandler<FM, FV>;
    private normalCommon;
    private dateFormatter;
    private getGroupF2V;
    private getGroupV2F;
    private groupF2V;
    private groupV2F;
}
export default function getTransform<FM extends FormModel, FV = any, CV = any>(code: string, type: FilterType<FM>): IFormValueTransform<FM, FV, CV>;
//# sourceMappingURL=FormValueTransform.d.ts.map