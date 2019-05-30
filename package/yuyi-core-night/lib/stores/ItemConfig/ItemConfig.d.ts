import { IKeyValueMap, IValueDidChange } from 'mobx';
import { ITransformer } from 'mobx-utils';
import { FormStore } from '../../components';
import { FilterType, IFormValueTransform, IFormValueTransformHandler } from './input/FormValueTransform';
import { BaseItemConfigTransformer, IItemConfig, FormModel } from './interface/ItemConfig';
import { ItemConfigBase } from './ItemConfigBase';
import { DisplayConfig } from './ItemDisplayConfig';
import { OptionsStore } from './OptionsStore';
import { SearchStore } from './SearchStore';
export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
    name: string;
}
export declare class ItemConfig<V = any, FM = FormModel> extends ItemConfigBase<V, FM> implements IItemConfig<FM, V> {
    private static commonTransformerConfig;
    static setCommonTransformerPipe(func: BaseItemConfigTransformer<FormModel>): void;
    static readonly commonTransformer: BaseItemConfigTransformer<any, any>;
    [key: string]: any;
    $version: number;
    private displayConfig;
    readonly displayProps: DisplayConfig<FM>;
    searchStore: SearchStore<V, FM>;
    setSearchStore(searchStore: SearchStore<V, FM>): void;
    useSearchStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config?: ItemConfig<V, FM>): SearchStore<any, any>;
    readonly formValueTransform: IFormValueTransform<FM>;
    readonly transformer: FilterType<FM, V>;
    readonly form2Value: IFormValueTransformHandler<FM>;
    readonly value2Form: IFormValueTransformHandler<FM>;
    readonly currentComponentValue: any;
    readonly computed: any;
    readonly isComputedEnable: boolean;
    optionsStore: OptionsStore<V>;
    useOptionsStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config?: IItemConfig<FM, V>): OptionsStore<V>;
    childrenConfig: IKeyValueMap<ItemConfig<V, FM>>;
    log(message: string): this;
    constructor(initModel: any, form?: any, componentProps?: any, formStore?: FormStore);
}
