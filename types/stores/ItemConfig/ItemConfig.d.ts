import { IKeyValueMap, IValueDidChange } from 'mobx';
import { FormStore } from '../../components/Form/FormStore';
import { IItemConfig, BaseItemConfigTransformer } from './interface/ItemConfig';
import { ItemConfigBase } from './ItemConfigBase';
import { SearchStore } from './SearchStore';
import { ITransformer } from 'mobx-utils';
import { OptionsStore } from '../SelectAndSearchStore';
import { IFormValueTransform, FilterType } from './input/FormValueTransform';
export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
    name: string;
}
export declare class ItemConfig extends ItemConfigBase implements IItemConfig {
    private static commonTransformerConfig;
    static setCommonTransformerPipe(func: BaseItemConfigTransformer<FilterType>): void;
    static readonly commonTransformer: BaseItemConfigTransformer<FilterType>;
    [key: string]: any;
    form: IKeyValueMap;
    $version: number;
    searchStore: SearchStore;
    setSearchStore(searchStore: SearchStore): void;
    useSearchStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config?: ItemConfig): SearchStore;
    readonly formValueTransform: IFormValueTransform;
    readonly transformer: any;
    readonly form2Value: Function;
    readonly value2Form: Function;
    readonly currentComponentValue: any;
    optionsStore: OptionsStore;
    useOptionsStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config?: IItemConfig): OptionsStore<any>;
    private readonly keyCode;
    private readonly keyInnerCode;
    formStore: FormStore;
    setFormStore(formStore: FormStore): void;
    readonly formSource: any;
    constructor(initModel: any, form?: any, componentProps?: any);
    export(): any;
}
