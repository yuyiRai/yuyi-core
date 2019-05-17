import { FormModel, IItemConfigBase } from "./ItemConfig";
import { FormStore } from "src/components";
export interface IValidator<V> {
    (rules: any, value: V, callback: ValidatorCallback): void | any;
}
export declare type RuleConfig<V = any> = {
    validator?: IValidator<V>;
    strict?: boolean | undefined;
    trigger?: 'change' | 'blur' | Array<'change' | 'blur'>;
    message?: string;
    pattern?: RegExp;
    required?: boolean;
};
export declare type ValidatorCallback = (error?: string | Error) => void;
export declare type RuleList<V = any> = Array<RuleConfig<V>>;
export declare type RuleConfigGetter<V = any, FM = FormModel> = (form: FM, config?: IItemConfigBase<V, FM>, formStore?: FormStore) => RuleConfig<V> | RuleList<V>;
export declare type RuleConfigMap<V = any, FM = FormModel> = {
    [k: string]: RuleConfigConstructor<V, FM>;
};
export declare type RuleConfigConstructor<V, FM> = RegExp | string | RuleConfig<V> | RuleList<V> | RuleConfigGetter<V, FM>;
