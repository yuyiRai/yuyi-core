export declare type FilterType = 'group' | 'check' | 'checkOne' | 'dateTime' | 'dateToDate';
export declare class CommonValueFilter {
    type: FilterType;
    constructor(type: FilterType);
    readonly filter: (string: any) => any;
    readonly filterToValue: (value: any) => any;
    normalFilter(value: any): any;
    groupFilter(string: any): any;
    groupFilterToValue(array: any): string;
}
export default function getFilter(type: FilterType): CommonValueFilter;
