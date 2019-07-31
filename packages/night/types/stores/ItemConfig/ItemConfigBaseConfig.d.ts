import { Option, OptionBase } from "../../utils";
import { IKeyValueMap } from 'mobx';
import { IItemConfig, RuleList } from './interface';
import { ItemConfigBaseConfigModel } from './ItemConfigBaseConfigModel';
import { RuleConfig } from './RuleConfigStore';
export declare class ItemConfigBaseConfig<V, FM> extends ItemConfigBaseConfigModel<V, FM> implements IItemConfig<FM, V> {
    componentProps: IKeyValueMap;
    ruleConfig: RuleConfig<V, FM>;
    readonly label: string;
    readonly placeholder: string;
    readonly allowCreate: boolean | ((data: any, form?: any) => Option);
    readonly allowInput: boolean;
    readonly viewOnly: boolean;
    readonly required: boolean;
    readonly hidden: boolean;
    readonly disabled: boolean;
    readonly isViewOnly: boolean;
    readonly rules: RuleList;
    setRules(v: RuleList): void;
    readonly options: OptionBase[];
    private getOptions;
    setOptions(v: any): void;
    childrenConfig: IKeyValueMap<ItemConfigBaseConfig<V, FM>>;
    readonly allConfig: IKeyValueMap<ItemConfigBaseConfig<V, FM>>;
    parentConfig: ItemConfigBaseConfig<V, FM>;
    setParentConfig(parentConfig: ItemConfigBaseConfig<V, FM>): void;
    readonly _loading: boolean;
    readonly loading: boolean;
    setLoading(v: boolean, source?: string): void;
    readonly loadData: (key: Option, keyList: Option[], form?: FM, itemConfig?: IItemConfig<FM, V, V>) => Option[] | Promise<Option[]>;
    readonly useSlot: boolean;
    readonly slot: string;
    readonly loadDataDeep: number;
}
//# sourceMappingURL=ItemConfigBaseConfig.d.ts.map