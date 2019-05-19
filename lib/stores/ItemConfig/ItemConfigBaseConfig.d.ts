import { IKeyValueMap } from 'mobx';
import { OptionBase } from '../../utils';
import { FormItemType, IItemConfig, RuleList } from './interface';
import { ItemConfigBaseConfigModel } from './ItemConfigBaseConfigModel';
import { RuleConfig } from './RuleConfigStore';
export declare class ItemConfigBaseConfig<V, FM> extends ItemConfigBaseConfigModel<V, FM> implements IItemConfig<FM, V> {
    componentProps: IKeyValueMap;
    ruleConfig: RuleConfig<V, FM>;
    readonly code: string;
    readonly label: string;
    readonly type: FormItemType;
    readonly placeholder: string;
    readonly nameCode: string;
    readonly viewOnly: boolean;
    readonly required: boolean;
    readonly hidden: boolean;
    readonly disabled: boolean;
    readonly isViewOnly: boolean;
    readonly rules: RuleList;
    setRules(v: RuleList): void;
    readonly options: OptionBase[];
    getOptions(): OptionBase[];
    setOptions(v: any): void;
    childrenConfig: IKeyValueMap<ItemConfigBaseConfig<V, FM>>;
    readonly allConfig: IKeyValueMap<ItemConfigBaseConfig<V, FM>>;
    parentConfig: ItemConfigBaseConfig<V, FM>;
    setParentConfig(parentConfig: ItemConfigBaseConfig<V, FM>): void;
    readonly _loading: boolean;
    readonly loading: boolean;
    setLoading(v: boolean, source?: string): void;
    readonly loadData: (key: import("../../utils").Option, keyList: import("../../utils").Option[], form?: FM, itemConfig?: IItemConfig<FM, V, V>) => import("../../utils").Option[] | Promise<import("../../utils").Option[]>;
    readonly useSlot: boolean;
    readonly slot: string;
    readonly loadDataDeep: number;
}