import { IKeyValueMap, IValueDidChange } from 'mobx';
import { FormStore } from '../../components/Form/FormStore';
import { IItemConfig, BaseItemConfigTransformer } from './interface';
import { ItemConfigBase2 } from './ItemConfigBase';
import { SearchStore } from '../ItemConfig/SearchStore';
import { ITransformer } from 'mobx-utils';
import { OptionsStore2 } from '../SelectAndSearchStore';
import { IFormValueTransform, FilterType } from '../ItemConfig/input/FormValueTransform';
export interface IPropertyChangeEvent<T = any> extends IValueDidChange<T> {
    name: string;
}
export declare class ItemConfig2 extends ItemConfigBase2 implements IItemConfig {
    private static commonTransformerConfig;
    static setCommonTransformerPipe(func: BaseItemConfigTransformer<FilterType<any>>): void;
    static readonly commonTransformer: BaseItemConfigTransformer<FilterType<any>>;
    [key: string]: any;
    form: IKeyValueMap;
    $version: number;
    searchStore: SearchStore<any, any>;
    setSearchStore(searchStore: SearchStore<any, any>): void;
    useSearchStore<T>(transformer?: ITransformer<OptionsStore2, T[]>, config?: ItemConfig2): SearchStore<any, any>;
    readonly formValueTransform: IFormValueTransform<any>;
    readonly transformer: any;
    readonly form2Value: any;
    readonly value2Form: any;
    readonly currentComponentValue: any;
    OptionsStore2: OptionsStore2;
    useOptionsStore<T>(transformer?: ITransformer<OptionsStore2, T[]>, config?: IItemConfig): OptionsStore2<any>;
    private readonly keyCode;
    private readonly keyInnerCode;
    formStore: FormStore;
    setFormStore(formStore: FormStore): void;
    readonly formSource: any;
    constructor(initModel: any, form?: any, componentProps?: any);
    export(): any;
}
