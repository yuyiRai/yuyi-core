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
export declare class ItemConfig<V = any, FM = FormModel> extends ItemConfigBase<V, FM> implements IItemConfig<V, FM> {
    private static commonTransformerConfig;
    static setCommonTransformerPipe(func: BaseItemConfigTransformer<FormModel>): void;
    static readonly commonTransformer: BaseItemConfigTransformer<FormModel>;
    [key: string]: any;
    $version: number;
    private displayConfig;
    readonly displayProps: DisplayConfig;
    searchStore: SearchStore<V, FM>;
    setSearchStore(searchStore: SearchStore<V, FM>): void;
    useSearchStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config?: ItemConfig<V, FM>): SearchStore<any, any>;
    readonly formValueTransform: IFormValueTransform<FM>;
    readonly transformer: FilterType<FM>;
    readonly form2Value: IFormValueTransformHandler<FM>;
    readonly value2Form: IFormValueTransformHandler<FM>;
    readonly currentComponentValue: any;
    readonly computed: any;
    readonly isComputedEnable: boolean;
    optionsStore: OptionsStore;
    useOptionsStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config?: IItemConfig<V, FM>): OptionsStore<any>;
    childrenConfig: IKeyValueMap<ItemConfig<V, FM>>;
    log(message: string): this;
    constructor(initModel: any, form?: any, componentProps?: any, formStore?: FormStore);
}
