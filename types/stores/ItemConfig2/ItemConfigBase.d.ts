import { IKeyValueMap, IValueDidChange } from 'mobx';
import { Option } from '../../utils';
import { EventEmitter } from '../../utils/EventEmitter';
import { IFormItemConstructor, IItemConfig } from './interface';
import { CommonStore2 } from './interface';
import { RuleConfigList, RuleConfigMap } from '../ItemConfig/interface/RuleConfig';
import { DisplayConfig } from '../ItemConfig/ItemDisplayConfig';
export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
    name: string;
}
export declare class ItemConfigBase2 extends CommonStore2 implements IItemConfig {
    [key: string]: any;
    i: IFormItemConstructor;
    iKeys: string[];
    form: IKeyValueMap;
    componentProps: IKeyValueMap;
    initConfig: import("mobx").ObservableMap<any, any>;
    $version: number;
    private displayConfig;
    readonly displayProps: DisplayConfig;
    readonly isViewOnly: any;
    private readonly otherKey;
    onPropertyChange: EventEmitter<IPropertyChangeEvent<any>>;
    constructor(initModel: IFormItemConstructor, form?: any, componentProps?: any);
    registerObservables(baseConfig: any): void;
    setForm(form: any): void;
    optionsInited: boolean;
    setConfig(next: IFormItemConstructor): void;
    init(initModel: IFormItemConstructor, form: IKeyValueMap, componentProps?: {}): void;
    getComputedValue(key: string, target?: any, defaultValue?: any): any;
    readonly type: import("./interface").FormItemType;
    readonly code: string;
    readonly nameCode: string;
    readonly searchName: any;
    getSearchName(): any;
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
    getOptions(): Option[];
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
    readonly requiredRule: any;
    shadowRuleRegister(validator: any): (rule: any, value: any, callback: {
        (arg0: any): void;
        (): void;
    }) => any;
    getRuleList(i: IKeyValueMap<any>, componentProps: IKeyValueMap<any>): RuleConfigList | undefined;
    optionsMatcher(r: any, values: any, callback: any): Promise<any>;
    getOptionsSafe(): Promise<Option[]>;
    readonly defaultRule: RuleConfigMap<any, IKeyValueMap<any>> & {
        dateToDate30: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string[];
        }[];
        futureDate: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string;
        }[];
    };
    static getDefaultRules(itemConfig: IItemConfig, configStore: any): RuleConfigMap;
}
