import { ItemConfig } from '../ItemConfig';
import { Option } from '../../utils';
export declare class OptionsStore {
    [k: string]: any;
    itemConfig: ItemConfig;
    __keyMap: {};
    __optionMap: WeakMap<object, any>;
    constructor(itemConfig: ItemConfig);
    shadowOption: any;
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
    labelToValue(label: any): any;
    shadowUpdateDispatcher(label: any, value: any, source: any): Promise<void>;
    updateShadowOption(value: any, label?: any): any;
    readonly isValidShadowOption: boolean;
    static getOptionsKey(item: any, index: any): any;
    readonly __optionArr: Option[];
    toConvertedOption(item: Option, index: number): Option;
    readonly convertedOption: Option[];
    readonly filterOptions: Option[];
    readonly selectedItemIndex: number;
    readonly displayOptions: any;
}
