import { IKeyValueMap } from "mobx";
import { IItemConfig, IItemConfigBase } from "./interface";
import { CommonStore } from "./interface/CommonStore";
import { IValidator, RuleConfigList, RuleConfigMap } from './interface/RuleConfig';
export declare class RuleStore<V, FM> extends CommonStore {
    itemConfig: IItemConfigBase<V, FM>;
    constructor(itemConfig: IItemConfigBase<V, FM>);
    readonly requiredRule: (false & {
        validator: (rule: any, value: any, callback: {
            (arg0: any): void;
            (): void;
        }) => any;
    }) | (true & {
        validator: (rule: any, value: any, callback: {
            (arg0: any): void;
            (): void;
        }) => any;
    }) | (import("./interface").RuleConfig<V> & {
        validator: (rule: any, value: any, callback: {
            (arg0: any): void;
            (): void;
        }) => any;
    }) | {
        required: boolean;
        validator: (rule: any, value: any, callback: {
            (arg0: any): void;
            (): void;
        }) => any;
        trigger: string;
    };
    shadowRuleRegister(validator: IValidator<string | number>): (rule: any, value: any, callback: {
        (arg0: any): void;
        (): void;
    }) => any;
    getRuleList(i: IKeyValueMap<any>): RuleConfigList | undefined;
    optionsMatcher(r: any, values: any, callback: any): Promise<any>;
    readonly defaultRule: RuleConfigMap<V, FM> & {
        dateToDate30: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string[];
        }[];
        futureDate: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string;
        }[];
    };
    static getDefaultRules<FM, V = any>(itemConfig: IItemConfig<V, FM>): RuleConfigMap<V, FM>;
}
