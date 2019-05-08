export declare type FilterTypeKey = 'group' | 'dateTime' | 'date' | 'dateToDate';
export declare type FilterType = FilterTypeKey | IFormValueTransform;
export interface IFormValueTransform {
    F2V: (value: any) => any;
    V2F: (value: any) => any;
}
export declare class FormValueTransform implements IFormValueTransform {
    private type;
    constructor(type: FilterType);
    readonly F2V: (value: any) => any;
    readonly V2F: (value: any) => any;
    private normalCommon;
    private dateFormatter;
    private groupF2V;
    private groupV2F;
}
export default function getTransform(type: FilterType | string): IFormValueTransform;
