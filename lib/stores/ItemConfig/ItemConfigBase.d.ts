import { IKeyValueMap, IValueDidChange, ObservableMap } from 'mobx';
import { Option, OptionBase } from '../../utils';
import { EventEmitter } from '../../utils/EventEmitter';
import { RuleList, RuleConfigMap } from './interface';
import { IFormItemConstructor, IItemConfig } from './interface/ItemConfig';
import { ItemConfigBaseConfig } from './ItemConfigBaseConfig';
export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
    name: string;
}
export declare class ItemConfigBase<V, FM = any> extends ItemConfigBaseConfig<V, FM> implements IItemConfig<FM, V> {
    [key: string]: any;
    initConfig: ObservableMap<string, any>;
    $version: number;
    private readonly otherKey;
    onPropertyChange: EventEmitter<IPropertyChangeEvent<any>>;
    constructor(initModel: IFormItemConstructor<FM, V>, form?: FM, componentProps?: any);
    registerObservables(baseConfig: any): void;
    optionsInited: boolean;
    setConfig(baseConfig: IFormItemConstructor<FM, V>, strict?: boolean): void;
    init(initModel: IFormItemConstructor<FM, V>, form: IKeyValueMap, componentProps?: {}): void;
    readonly searchName: any;
    getSearchName(): any;
    readonly currentValue: any;
    readonly remoteMethod: (keyWord: string, form?: any) => Promise<any>;
    readonly remoteOptions: Promise<any[]> | any[];
    remoteSearchBySearchName(keyWordStr: string): Promise<Option[]>;
    remoteSearch(keyWord: string[]): Promise<Option[]>;
    readonly rule: RuleList;
    setRule(v: RuleList): void;
    validateHandler: (value: any, strict?: boolean) => Promise<{}>;
    readonly allowCreate: boolean | ((data: any, form?: any) => Option);
    readonly allowInput: boolean;
    updateVersion(): void;
    /**
     * @type {function}
     */
    onValidateHandler: () => void;
    /**
     *
     * @param { (code: string, isValid: boolean, errorMsg: string, config: this) => void} callback
     */
    onValidate(callback: () => void): void;
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
    }) | {
        required: boolean;
        validator: (rule: any, value: any, callback: {
            (arg0: any): void;
            (): void;
        }) => any;
        trigger: string;
    };
    shadowRuleRegister(validator: any): (rule: any, value: any, callback: {
        (arg0: any): void;
        (): void;
    }) => any;
    getRuleList(i: IKeyValueMap<any>, componentProps: IKeyValueMap<any>): RuleList | undefined;
    optionsMatcher(r: any, values: any, callback: any): Promise<any>;
    getOptionsSafe(): Promise<OptionBase[]>;
    readonly defaultRule: RuleConfigMap<any, IKeyValueMap<any>> & RuleConfigMap<any, any>;
    static getDefaultRules<V, FM>(itemConfig: IItemConfig<FM, V>, configStore: any): RuleConfigMap;
}
