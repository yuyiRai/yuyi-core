import { Option } from '@/utils';
import { ITransformer } from 'mobx-utils';
import { IItemConfig } from '../ItemConfig/interface';
export declare class OptionsStore2<V = any> {
    [k: string]: any;
    itemConfig: IItemConfig<any, V>;
    __keyMap: {};
    __optionMap: WeakMap<object, any>;
    transformer: ITransformer<OptionsStore2, V[]>;
    constructor(itemConfig: IItemConfig<any, V>, transformer?: ITransformer<OptionsStore2, V[]>);
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
        children?: Option[];
        disabled?: boolean;
        isLeaf?: boolean;
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
    readonly selectedOptions: any[];
    readonly selectedLablesStr: string;
    readonly selectedLablesConfig: LabelsConfigList;
    readonly hasSelectedTag: boolean;
}
export declare type onChangeHandler = (value: any) => void;
export interface ILabelsConfig {
    label: string;
    remove(onChange: onChangeHandler): void;
}
export declare type LabelsConfigList = Array<ILabelsConfig>;
