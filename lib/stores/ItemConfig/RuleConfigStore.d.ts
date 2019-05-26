/// <reference types="react" />
import { ObservableMap } from "mobx";
import { FormStoreCore } from '@/components/Form/FormStore/FormStoreCore';
import { IItemConfig } from "./interface";
import { CommonStore } from "./interface/CommonStore";
import { IRuleConfig, IValidator, RuleConfigConstructor, RuleConfigMap, RuleList, ValidatorCallback } from './interface/RuleConfig';
export declare type RuleErrorIntercept = (value?: any, error?: Error, callback?: ValidatorCallback) => any;
export interface IRuleStoreBase<V, FM> {
    rule?: RuleConfigConstructor<V, FM>;
    requiredMessage?: string;
    regExpMessage?: string;
}
export interface IRuleStoreCreater<V, FM> extends IRuleStoreBase<V, FM> {
}
export interface IRuleStore<V, FM> extends IRuleStoreBase<V, FM> {
    rule?: IRuleConfig<V> | RuleList<V>;
    rules?: IRuleConfig<V> | RuleList<V>;
}
export declare class RuleConfig<V, FM> extends CommonStore {
    itemConfig: IItemConfig<FM, V>;
    constructor(itemConfig: IItemConfig<FM, V>);
    readonly requiredRule: (false & {
        validator: (...args: any[]) => any;
    }) | (true & {
        validator: (...args: any[]) => any;
    }) | (IRuleConfig<V> & {
        validator: (...args: any[]) => any;
    }) | {
        required: boolean;
        validator: IValidator<import("react").ReactText>;
        trigger: string;
    };
    static ruleErrorIntercept: RuleErrorIntercept;
    static setRuleErrorIntercept(register: RuleErrorIntercept): void;
    useRuleErrorIntercept(validator: IValidator<V>): IValidator<V>;
    readonly ruleGetterParams: [FM, IItemConfig<FM, V>, FormStoreCore<FM>];
    ruleConvert(rule: RuleConfigConstructor<V, FM>, i?: import("./interface").IFormItemConstructor<FM, V, V>): RuleList<V>;
    convertRegExpToFunction(ruleGetter: RegExp): (rule: any, value: any, callback: ValidatorCallback) => void;
    getRuleList(i?: import("./interface").IFormItemConstructor<FM, V, V>): RuleList | undefined;
    optionsMatcher(r: any, values: any, callback: any): Promise<any>;
    readonly defaultRule: RuleConfigMap<V, FM>;
    static customRuleMap: ObservableMap<string, RuleConfigConstructor<any, any>>;
    static registerCustomRule<V, FM>(key: string, rule: RuleConfigConstructor<V, FM>): void;
    static getDefaultRules<FM, V = any>(): RuleConfigMap<V, FM>;
}
export declare function initCustomRule(): void;
declare const _default: void;
export default _default;
