import { IItemConfig, FormModel } from "./ItemConfig";
import { FormStore } from "src/components";

export type RuleConfig<V = any> = {
  validator?(rules: any, value: V, callback: ValidatorCallback): void;
  strict?: boolean | undefined;
  trigger?: 'change' | 'blur' | Array<'change' | 'blur'>;
  message?: string;
  pattern?: RegExp;
  required?: boolean;
};
export type ValidatorCallback = (error?: string | Error) => void;
export type RuleConfigList<V = any> = Array<RuleConfig<V>>;

export type RuleConfigGetter<V = any, FM = FormModel> = (form: FM, config?: IItemConfig<FM>, formStore?: FormStore) => RuleConfig<V> | RuleConfigList<V>;
export type RuleConfigMap<V = any, FM = FormModel> = {
  [k: string]: RuleConfig<V> | RuleConfigList<V> | RuleConfigGetter<V, FM>;
};
