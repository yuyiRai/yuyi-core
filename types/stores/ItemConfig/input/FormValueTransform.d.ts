import { FormItemType } from '../interface';
export declare type FilterType = 'group' | FormItemType;
export interface IFormValueTransform {
    F2V: (value: any) => any;
    V2F: (value: any) => any;
}
export declare class FormValueTransform implements IFormValueTransform {
    private type;
    constructor(type: FilterType);
    readonly F2V: (value: any) => any;
    readonly V2F: (value: any) => any;
    private normalF2V;
    private groupF2V;
    private groupV2F;
}
export default function getTransform(type: FilterType | string): IFormValueTransform;
