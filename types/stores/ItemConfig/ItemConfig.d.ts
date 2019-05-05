import { IKeyValueMap, IReactionDisposer, IReactionOptions, IReactionPublic, IObservableValue, IComputedValue, IValueDidChange, Lambda } from 'mobx';
import { DisplayConfig } from './ItemDisplayConfig';
import { Option } from '../../utils';
import { FormStore } from '../../components/Form/FormStore';
import { EventEmitter } from '../../utils/EventEmitter';
export declare type ValidatorCallback = (error?: string | Error) => void;
export declare type RuleConfig<T = any> = {
    validator?(rules: any, value: T, callback: ValidatorCallback): void;
    strict?: boolean | undefined;
    trigger?: 'change' | 'blur' | Array<'change' | 'blur'>;
    message?: string;
    pattern?: RegExp;
    required?: boolean;
};
export declare type RuleConfigList<T = any> = Array<RuleConfig<T>>;
export declare type RuleConfigGetter<T = any> = (...args: any[]) => RuleConfig<T> | RuleConfigList<T>;
export declare type RuleConfigMap<T = any> = {
    [k: string]: RuleConfig<T> | RuleConfigList<T> | RuleConfigGetter<T>;
};
export interface IItemConfig {
    multiple?: boolean;
    [key: string]: any;
}
export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
    name: string;
}
export declare class ItemConfig implements IItemConfig {
    [key: string]: any;
    destorySet: Set<IReactionDisposer | Lambda>;
    i: IKeyValueMap;
    iKeys: string[];
    /**
     * @type { FormStore }
     */
    form: IKeyValueMap;
    readonly formStore: FormStore<any>;
    componentProps: IKeyValueMap;
    initConfig: import("mobx").ObservableMap<any, any>;
    $version: number;
    private displayConfig;
    readonly displayProps: DisplayConfig;
    readonly isViewOnly: any;
    readonly otherKey: string[];
    onPropertyChange: EventEmitter<IPropertyChangeEvent<any>>;
    constructor(initModel: any, form?: any, componentProps?: any);
    reaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): void;
    observe<T = any>(value: IObservableValue<T> | IComputedValue<T>, listener: (change: IValueDidChange<T>) => void, fireImmediately?: boolean): void;
    registerObservables(baseConfig: any): void;
    setForm(form: any): void;
    optionsInited: boolean;
    setConfig(next: any): void;
    init(initModel: IKeyValueMap, form: IKeyValueMap, componentProps?: {}): void;
    getComputedValue(key: string, target?: any, defaultValue?: any): any;
    readonly type: any;
    readonly code: any;
    readonly nameCode: any;
    readonly searchName: string;
    getSearchName(): string;
    readonly currentValue: any;
    readonly remoteMethod: (keyWord: string, form?: any) => Promise<any>;
    readonly remoteOptions: Promise<any[]> | any[];
    remoteSearchBySearchName(keyWordStr: string): Promise<Option[]>;
    remoteSearch(keyWord: string[]): Promise<Option[]>;
    readonly rule: RuleConfigList;
    setRule(v: RuleConfigList): void;
    validateHandler: (value: any, strict?: boolean) => Promise<{}>;
    readonly loading: any;
    setLoading(v: boolean): void;
    readonly allowCreate: boolean | ((data: any, form?: any) => Option);
    readonly allowInput: boolean;
    /**
     * @type { Array } 配置项Array
     */
    readonly options: Option[];
    setOptions(v: any): void;
    updateVersion(): void;
    export(): {};
    /**
     * @type {function}
     */
    onValidateHandler: () => void;
    /**
     *
     * @param { (code: string, isValid: boolean, errorMsg: string, config: this) => void} callback
     */
    onValidate(callback: () => void): void;
    destory(): void;
    readonly requiredRule: any;
    shadowRuleRegister(validator: any): (rule: any, value: any, callback: {
        (arg0: any): void;
        (): void;
    }) => any;
    getRuleList(i: IKeyValueMap<any>, componentProps: IKeyValueMap<any>): RuleConfigList | undefined;
    optionsMatcher(r: any, values: any, callback: any): Promise<any>;
    getOptionsSafe(): Promise<Option[]>;
    readonly defaultRule: RuleConfigMap<any> & {
        dateToDate30: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string[];
        }[];
        futureDate: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string;
        }[];
    };
    static getDefaultRules(itemConfig: ItemConfig, configStore: any): RuleConfigMap;
}