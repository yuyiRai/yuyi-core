import { ITransformer } from 'mobx-utils';
import { Option, OptionBase } from '../../utils';
import { IItemConfig } from './interface';
export interface PathOption extends Option {
    path: string;
    parentOption?: Option;
}
export declare class OptionsTransformerStore<V> {
    [k: string]: any;
    itemConfig: IItemConfig<any, any>;
    __keyMap: {};
    transformer: ITransformer<OptionsStore, V[]>;
    constructor(itemConfig: IItemConfig<any, any>, transformer?: ITransformer<OptionsStore, V[]>);
    static getOptionsKey(item: any, index: number, parentKey?: string): string;
    readonly __optionArr: Option[];
    static getOptionArr(sourceOptions: OptionBase[], parentKey?: any): Option[];
    private toConvertedOption;
    readonly convertedOption: PathOption[];
    private todoConvertOption;
    readonly filterOptions: Option[];
    readonly getOptionsLabel: any;
}
export declare class OptionsStore<V = any> extends OptionsTransformerStore<V> {
    shadowOption: Option;
    readonly shadowOptionMode: "text" | "code";
    /**
     * 录入值的自动转化
     */
    setShadowOptionByValue(value: string, source: any): Promise<void>;
    /**
     * 录入值的自动转化
     */
    setShadowOption(label: string, source: any): Promise<void>;
    labelToValue(label: any): any;
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
    readonly selectedItemIndex: number;
    readonly displayOptions: Option[];
    readonly nativeDisplayOptionList: Option[];
    readonly transformOption: (V | Option)[];
    readonly nativeTransformOption: Option[];
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
