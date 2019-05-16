import { IItemConfig } from '../interface';
export declare const checkDateToDate: <FM>(date: any, itemConfig: IItemConfig<FM, import("mobx").IKeyValueMap<any>>) => (rule: any, value: any, callback: any) => any;
export declare const checkFutureDate: <FM>(itemConfig: IItemConfig<FM, import("mobx").IKeyValueMap<any>>) => (rule: any, value: any, callback: any) => any;
export declare const getDefaultRules: <FM>(itemConfig: IItemConfig<FM, import("mobx").IKeyValueMap<any>>) => {
    dateToDate30: {
        validator: (rule: any, value: any, callback: any) => any;
        trigger: string[];
    }[];
    futureDate: {
        validator: (rule: any, value: any, callback: any) => any;
        trigger: string;
    }[];
};
export declare const DateUtils: {
    getDateRange(days: number): Date[];
};
