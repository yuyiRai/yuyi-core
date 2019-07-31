import { IKeyValueMap, IValueDidChange } from 'mobx';
import { ITransformer } from 'mobx-utils';
import { FormStore } from '../../components';
import { FilterType, IFormValueTransform, IFormValueTransformHandler } from './input/FormValueTransform';
import { BaseItemConfigTransformer, FormModel, IItemConfig } from './interface/ItemConfig';
import { ItemConfigBase } from './ItemConfigBase';
import { DisplayConfig } from './ItemDisplayConfig';
import { OptionsStore } from './OptionsStore';
import { SearchStore } from './SearchStore';
export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
    name: string;
}
export declare class ItemConfig<V = any, FM = FormModel> extends ItemConfigBase<V, FM> implements IItemConfig<FM, V> {
    name: string;
    itemConfig: never;
    uuid: string;
    private static commonTransformerConfig;
    static setCommonTransformerPipe(func: BaseItemConfigTransformer<FormModel>): void;
    static readonly commonTransformer: BaseItemConfigTransformer<any, any>;
    [key: string]: any;
    $version: number;
    displayProps: DisplayConfig<FM>;
    initDisplayProps(): void;
    searchStore: SearchStore<V, FM>;
    optionsStore: OptionsStore<V>;
    setSearchStore(searchStore?: SearchStore<V, FM>): void;
    setOptionsStore(optionsStore?: OptionsStore<V>): void;
    useOptionsStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config?: IItemConfig<FM, V>): OptionsStore<V>;
    useSearchStore<T>(transformer?: ITransformer<OptionsStore, T[]>, config?: ItemConfig<V, FM>): SearchStore<V, FM>;
    readonly formValueTransform: IFormValueTransform<FM>;
    readonly transformer: FilterType<FM, V>;
    readonly form2Value: IFormValueTransformHandler<FM>;
    readonly value2Form: IFormValueTransformHandler<FM>;
    readonly currentComponentValue: any;
    readonly computed: any;
    readonly isComputedEnable: boolean;
    childrenConfig: IKeyValueMap<ItemConfig<V, FM>>;
    constructor(initModel: any, form?: any, componentProps?: any, formStore?: FormStore);
}
//# sourceMappingURL=ItemConfig.d.ts.map