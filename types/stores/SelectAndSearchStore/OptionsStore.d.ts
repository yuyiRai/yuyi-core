import { Option } from '../../utils';
import { ITransformer } from 'mobx-utils';
import { IItemConfig } from '../ItemConfig/interface';
export declare class OptionsStore<V = any> {
    [k: string]: any;
    itemConfig: IItemConfig;
    __keyMap: {};
    __optionMap: WeakMap<object, any>;
    transformer: ITransformer<OptionsStore, V[]>;
    constructor(itemConfig: IItemConfig, transformer?: ITransformer<OptionsStore, V[]>);
    shadowOption: Option;
    readonly shadowOptionMode: "text" | "code";
    /**
     * 录入值的自动转化
     * @param { string } value
     * @param { string } label
     */
    setShadowOptionByValue(value: string, source: any): Promise<void>;
    /**
     * 录入值的自动转化
     * @param { string } value
     * @param { string } label
     */
    setShadowOption(label: string, source: any): Promise<void>;
    labelToValue(label: any): string;
    shadowUpdateDispatcher(label: any, value: any, source: any): Promise<void>;
    updateShadowOption(value: any, label?: any): {
        [x: string]: any;
        value?: string;
        label?: string;
    };
    readonly isValidShadowOption: boolean;
    static getOptionsKey(item: any, index: any): string;
    readonly __optionArr: Option[];
    toConvertedOption(item: Option, index: number): Option;
    readonly convertedOption: Option[];
    readonly filterOptions: Option[];
    readonly selectedItemIndex: number;
    readonly displayOptions: Option[];
    readonly transformOption: V[];
    valuesToLabels(value: any): string[];
    labelsToValues(label: any): string[];
    readonly selectedLables: any[];
    readonly selectedLablesStr: string;
    readonly selectedLablesConfig: any[];
    readonly hasSelectedTag: boolean;
}
