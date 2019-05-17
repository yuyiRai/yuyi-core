import { ItemConfig } from '../ItemConfig/ItemConfig';
import { OptionsStore2 } from './OptionsStore';
import { Option } from '../../utils';
export declare class SelectAndSearchStore {
    [k: string]: any;
    type: string;
    /**
     * @type { ItemConfig }
     */
    itemConfig: ItemConfig;
    /**
     * @type { OptionsStore2 }
     */
    OptionsStore2: OptionsStore2;
    searchEventEmitter: (...params: any[]) => Promise<any>;
    /**
     * 至今为止选择过的optionList
     * @type { Array }
     */
    selectedOptions: Option[];
    value: string | string[];
    readonly shadowOption: Option;
    setShadowOption(label: any, source: any): void;
    setShadowOptionByValue(value: any, source: any): void;
    readonly displayOptions: Option[];
    /**
     * 设置当前值
     * @param {string | Array<string>} value
     * @param {string} source
     */
    setValue(value: any, source: any): void;
    /**
     * 设置配置
     * @param {'select' | 'search'} type
     * @param { ItemConfig } itemConfig
     */
    setConfig(type: 'select' | 'search', itemConfig: ItemConfig): void;
    /**
     *
     * @param { string | string[] } key
     */
    searchMethods(key: string | string[]): void;
    readonly placeholder: any;
    readonly isSearch: boolean;
    readonly hasNameCode: boolean;
    readonly useEmpty: (options: Option[]) => boolean;
    readonly isCenter: boolean;
    readonly popperClass: "" | "center";
    /**
     * 远程搜索方法
     * @param {string | Array<string>} keyWord 搜索关键字，可以是数组
     */
    remoteMethod(keyWord: string | string[]): Promise<void>;
    onChangeWithLabel(label: string): any;
    defaultCreater(value: string): {
        label: string;
        value: string;
    };
    onChange(value: string | string[], source?: 'options patch' | 'options delete' | 'options' | 'blur' | 'select'): any;
    patchSelectedOption(pushOptionsList: Option[]): void;
    readonly selectedLables: any[];
    readonly selectedLablesStr: string;
    readonly selectedLablesConfig: {
        label: any;
        remove: () => void;
    }[];
    readonly hasSelectedTag: boolean;
    /**
     * 格式化Label
     * @param { string } str
     * @return { {prefix: string, label: string, suffix: string} } {prefix, label, suffix}
     */
    static getConvertLabel(str: string): {
        prefix: string;
        label: string;
        suffix: string;
    };
    /**
     * @type {{ prefix: string, label: string, suffix: string }}
     */
    readonly selectedLabelConveration: {
        prefix: string;
        label: string;
        suffix: string;
    };
    /**
     * @type {{ prefix: string, label: string, suffix: string }}
     */
    readonly shadowLabelConveration: {
        prefix: string;
        label: string;
        suffix: string;
    };
    labelsToValues(label: any): string[];
    valuesToLabels(value: any, joinKey?: string): string;
}
