import { ItemConfig } from '../ItemConfig';
export declare const checkDateToDate: (date: any, itemConfig: ItemConfig) => (rule: any, value: any, callback: any) => any;
export declare const checkFutureDate: (itemConfig: ItemConfig) => (rule: any, value: any, callback: any) => any;
export declare const getDefaultRules: (itemConfig: ItemConfig) => {
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
