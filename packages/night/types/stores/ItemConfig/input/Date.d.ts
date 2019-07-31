import { IItemConfig, RuleConfigMap } from '../interface';
export declare const checkDateToDate: <V, FM>(date: any, itemConfig: IItemConfig<FM, V, V>) => (rule: any, value: any, callback: any) => any;
export declare const checkFutureDate: <V, FM>(itemConfig: IItemConfig<FM, V, V>) => (rule: any, value: any, callback: any) => any;
export declare const getDefaultRules: <V, FM>(itemConfig: IItemConfig<FM, V, V>) => RuleConfigMap<V, FM>;
export declare const DateUtils: {
    getDateRange(days: number): Date[];
};
//# sourceMappingURL=Date.d.ts.map