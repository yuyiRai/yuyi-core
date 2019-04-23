import { IKeyValueMap, IReactionDisposer, IReactionOptions, IReactionPublic } from 'mobx';
import { DisplayConfig } from './ItemDisplayConfig';
import { Option } from '../../utils';
export declare class ItemConfig {
    [key: string]: any;
    destorySet: Set<IReactionDisposer>;
    i: IKeyValueMap;
    iKeys: string[];
    /**
     * @type { FormStore }
     */
    form: IKeyValueMap;
    componentProps: IKeyValueMap;
    initConfig: import("mobx").ObservableMap<any, any>;
    $version: number;
    displayConfig: DisplayConfig;
    readonly displayProps: DisplayConfig;
    readonly isViewOnly: any;
    readonly otherKey: string[];
    constructor(initModel: any, form?: any, componentProps?: any);
    reaction(source: (r: IReactionPublic) => {}, callback: (arg: {}, r: IReactionPublic) => void, options?: IReactionOptions): void;
    registerObservables(baseConfig: any): void;
    registerKey(i: any, key: string): void;
    setForm(form: any): void;
    optionsInited: boolean;
    setConfig(next: any): void;
    init(initModel: IKeyValueMap, form: IKeyValueMap, componentProps?: {}): void;
    getComputedValue(key: string, target?: any, defaultValue?: any): any;
    /**
     * 是否控制必录
     */
    readonly required: any;
    /**
     * 是否
     */
    readonly hidden: any;
    readonly label: any;
    readonly type: any;
    readonly code: any;
    readonly nameCode: any;
    readonly searchName: any;
    getSearchName(): any;
    readonly currentValue: any;
    readonly remoteMethod: ((keyWord: any, form?: any) => Promise<any>) | (() => void);
    readonly remoteOptions: Promise<any[]> | any[];
    remoteSearchBySearchName(keyWordStr: string): Promise<Option[]>;
    remoteSearch(keyWord: string[]): Promise<Option[]>;
    readonly rule: any[];
    setRule(v: any): void;
    validateHandler: (value: any) => Promise<{}>;
    readonly loading: any;
    setLoading(v: boolean): void;
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
    getRuleList(i: IKeyValueMap<any>, componentProps: IKeyValueMap<any>): any[] | undefined;
    optionsMatcher(r: any, values: any, callback: any): Promise<any>;
    getOptionsSafe(): any[] | Promise<any[]>;
    readonly defaultRule: {
        phone: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string;
            message: string;
        }[];
        'chejiahao': {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string;
            message: string;
        }[];
        plusOnly: (form: any, config: {
            label: any;
        }) => {
            validator($: any, value: string, callback: {
                (arg0: Error): void;
                (): void;
            }): void;
            tirgger: string;
            message: string;
        }[];
        licanseNo: (form: {
            licenseType: any;
        }, config: any) => {
            validator: (rule: any, value: string, callback: {
                (): void;
                (): void;
                (arg0: Error): void;
                (): void;
            }) => void;
            trigger: string;
            message: string;
        }[];
        idCard: {
            pattern: RegExp;
            trigger: string;
            message: string;
        }[];
        commonCode: {
            pattern: RegExp;
            trigger: string;
            message: string;
        }[];
    } & {
        dateToDate30: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string[];
        }[];
        futureDate: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string;
        }[];
    };
    static getDefaultRules(itemConfig: ItemConfig, configStore: any): {
        phone: {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string;
            message: string;
        }[];
        'chejiahao': {
            validator: (rule: any, value: any, callback: any) => any;
            trigger: string;
            message: string;
        }[];
        plusOnly: (form: any, config: {
            label: any;
        }) => {
            validator($: any, value: string, callback: {
                (arg0: Error): void;
                (): void;
            }): void;
            tirgger: string;
            message: string;
        }[];
        licanseNo: (form: {
            licenseType: any;
        }, config: any) => {
            validator: (rule: any, value: string, callback: {
                (): void;
                (): void;
                (arg0: Error): void;
                (): void;
            }) => void;
            trigger: string;
            message: string;
        }[];
        idCard: {
            pattern: RegExp;
            trigger: string;
            message: string;
        }[];
        commonCode: {
            pattern: RegExp;
            trigger: string;
            message: string;
        }[];
    };
}
