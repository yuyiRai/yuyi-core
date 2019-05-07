export declare type RuleConfig<T = any> = {
    validator?(rules: any, value: T, callback: ValidatorCallback): void;
    strict?: boolean | undefined;
    trigger?: 'change' | 'blur' | Array<'change' | 'blur'>;
    message?: string;
    pattern?: RegExp;
    required?: boolean;
};
export declare type ValidatorCallback = (error?: string | Error) => void;
export declare type RuleConfigList<T = any> = Array<RuleConfig<T>>;
export declare type RuleConfigGetter<T = any> = (...args: any[]) => RuleConfig<T> | RuleConfigList<T>;
export declare type RuleConfigMap<T = any> = {
    [k: string]: RuleConfig<T> | RuleConfigList<T> | RuleConfigGetter<T>;
};
