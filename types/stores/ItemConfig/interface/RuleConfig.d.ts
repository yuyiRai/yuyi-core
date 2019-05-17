import { FormStoreCore } from "src/components/Form/FormStore/FormStoreCore";
import { FormModel, IItemConfig } from "./ItemConfig";
export interface IValidator<V> {
    (rules: any, value: V, callback: ValidatorCallback): void | any;
}
export declare type TriggerType = 'change' | 'blur' | 'onBlur' | 'onChange';
export declare type RuleConfig<V = any> = {
    validator?: IValidator<V>;
    strict?: boolean | undefined;
    trigger?: TriggerType | Array<TriggerType>;
    message?: string;
    pattern?: RegExp;
    required?: boolean;
};
export declare type ValidatorCallback = (error?: string | Error) => void;
export declare type RuleList<V = any> = Array<RuleConfig<V>>;
export declare type RuleConfigGetter<V = any, FM = FormModel> = (form: FM, config?: IItemConfig<FM, V>, formStore?: FormStoreCore<FM>) => RuleConfig<V> | RuleList<V>;
export declare type RuleConfigMap<V = any, FM = FormModel> = {
    [k: string]: RuleConfigConstructor<V, FM>;
};
export declare type RuleConfigGetterInit = RegExp | string;
export declare type RuleConfigConstructor<V, FM> = RuleConfig<V> | RuleList<V> | RuleConfigGetter<V, FM> | RuleConfigGetterInit;
