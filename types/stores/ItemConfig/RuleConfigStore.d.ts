import { IItemConfig, IItemConfigBase } from "./interface";
import { CommonStore } from "./interface/CommonStore";
import { IValidator, RuleConfigConstructor, RuleConfigMap, RuleList, ValidatorCallback, RuleConfig } from './interface/RuleConfig';
export declare type RuleErrorIntercept = (value?: any, error?: Error, callback?: ValidatorCallback) => any;
export interface IRuleStoreBase<V, FM> {
    rule?: RuleConfigConstructor<V, FM>;
}
export interface IRuleStoreConstructor<V, FM> extends IRuleStoreBase<V, FM> {
}
export interface IRuleStore<V, FM> extends IRuleStoreBase<V, FM> {
    rule?: RuleConfig<V> | RuleList<V>;
    rules?: RuleConfig<V> | RuleList<V>;
}
export declare class RuleStore<V, FM> extends CommonStore {
    itemConfig: IItemConfigBase<V, FM>;
    constructor(itemConfig: IItemConfigBase<V, FM>);
    readonly requiredRule: (false & {
        validator: (...args: any[]) => any;
    }) | (true & {
        validator: (...args: any[]) => any;
    }) | (RuleConfig<V> & {
        validator: (...args: any[]) => any;
    }) | {
        required: boolean;
        validator: IValidator<string | number>;
        trigger: string;
    };
    static ruleErrorIntercept: RuleErrorIntercept;
    static setRuleErrorIntercept(register: RuleErrorIntercept): void;
    useRuleErrorIntercept(validator: IValidator<V>): IValidator<V>;
    getRuleList(i?: import("./interface").IFormItemConstructor<V, FM>): RuleList | undefined;
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
    private static customRuleMap;
    static registerCustomRule<V, FM>(key: string, rule: RuleConfigConstructor<V, FM>): void;
    static getDefaultRules<FM, V = any>(itemConfig: IItemConfig<V, FM>): RuleConfigMap<V, FM>;
}
