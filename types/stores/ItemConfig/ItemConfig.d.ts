import { IKeyValueMap, IValueDidChange } from 'mobx';
import { FormStore } from '../../components/Form/FormStore';
import { IItemConfig } from './interface/ItemConfig';
import { ItemConfigBase } from './ItemConfigBase';
import { SearchStore } from './SearchStore';
import { ITransformer } from 'mobx-utils';
import { OptionsStore } from '../SelectAndSearchStore';
import { IFormValueTransform } from './input/FormValueTransform';
export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
    name: string;
}
export declare class ItemConfig extends ItemConfigBase implements IItemConfig {
    [key: string]: any;
    form: IKeyValueMap;
    $version: number;
    searchStore: SearchStore;
    setSearchStore(searchStore: SearchStore): void;
    useSearchStore(config?: IItemConfig): SearchStore;
    readonly formValueTransform: IFormValueTransform;
    readonly form2Value: Function;
    readonly value2Form: Function;
    readonly currentComponentValue: any;
    optionsStore: OptionsStore;
    useOptionsStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config?: IItemConfig): OptionsStore<T>;
    private readonly keyCode;
    private readonly keyInnerCode;
    formStore: FormStore;
    setFormStore(formStore: FormStore): void;
    readonly formSource: any;
    constructor(initModel: any, form?: any, componentProps?: any);
    export(): {};
}
