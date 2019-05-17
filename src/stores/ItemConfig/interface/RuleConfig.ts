import { FormModel, IItemConfigBase } from "./ItemConfig";
import { FormStore } from "src/components";

export interface IValidator<V> {
  (rules: any, value: V, callback: ValidatorCallback): void | any;
}
export type RuleConfig<V = any> = {
  validator?: IValidator<V>;
  strict?: boolean | undefined;
  trigger?: 'change' | 'blur' | Array<'change' | 'blur'>;
  message?: string;
  pattern?: RegExp;
  required?: boolean;
};
export type ValidatorCallback = (error?: string | Error) => void;
export type RuleList<V = any> = Array<RuleConfig<V>>;

export type RuleConfigGetter<V = any, FM = FormModel> = (form: FM, config?: IItemConfigBase<V, FM>, formStore?: FormStore) => RuleConfig<V> | RuleList<V>;
export type RuleConfigMap<V = any, FM = FormModel> = {
  [k: string]: RuleConfigConstructor<V, FM>;
};
export type RuleConfigConstructor<V, FM> = RegExp | string | RuleConfig<V> | RuleList<V> | RuleConfigGetter<V, FM>