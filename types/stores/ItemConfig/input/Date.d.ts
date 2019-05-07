import { IItemConfig } from '../interface/ItemConfig';
export declare const checkDateToDate: (date: any, itemConfig: IItemConfig) => (rule: any, value: any, callback: any) => any;
export declare const checkFutureDate: (itemConfig: IItemConfig) => (rule: any, value: any, callback: any) => any;
export declare const getDefaultRules: (itemConfig: IItemConfig) => {
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
