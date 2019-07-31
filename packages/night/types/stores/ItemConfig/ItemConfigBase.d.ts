import { EventEmitter, OptionBase } from "../../utils";
import { IKeyValueMap, IValueDidChange } from 'mobx';
import { IFormItemConstructor, IItemConfig } from './interface/ItemConfig';
import { ItemConfigBaseConfig } from './ItemConfigBaseConfig';
export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
    name: string;
}
export declare class ItemConfigBase<V, FM = any> extends ItemConfigBaseConfig<V, FM> implements IItemConfig<FM, V> {
    [key: string]: any;
    $version: number;
    private readonly otherKey;
    onPropertyChange: EventEmitter<IPropertyChangeEvent<any>>;
    constructor(initModel: IFormItemConstructor<FM, V>, form?: FM, componentProps?: any);
    registerObservables(baseConfig: IFormItemConstructor<FM, V>): void;
    optionsInited: boolean;
    setConfig(baseConfig: IFormItemConstructor<FM, V>, strict?: boolean): void;
    init(initModel: IFormItemConstructor<FM, V>, form: IKeyValueMap, componentProps?: {}): void;
    readonly searchName: any;
    getSearchName(): any;
    readonly currentValue: any;
    validateHandler(value: any, strict?: boolean): Promise<unknown>;
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
    optionsMatcher(r: any, values: any, callback: any): Promise<any>;
    getOptionsSafe(): Promise<OptionBase[]>;
}
//# sourceMappingURL=ItemConfigBase.d.ts.map