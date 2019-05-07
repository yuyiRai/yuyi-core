export declare type FilterType = 'group' | 'check' | 'checkOne' | 'dateTime' | 'dateToDate';
export declare class FormValueTransform {
    type: FilterType;
    constructor(type: FilterType);
    readonly F2V: (string: any) => any;
    readonly V2F: (value: any) => any;
    normalF2V(value: any): any;
    groupF2V(string: any): any;
    groupV2F(array: any): string;
}
export default function getTransform(type: FilterType): FormValueTransform;
