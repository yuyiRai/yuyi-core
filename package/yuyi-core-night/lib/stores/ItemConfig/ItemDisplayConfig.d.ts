import { IKeyValueMap } from 'mobx';
import { ComputedPick, ComputedPropertyCreater, IItemConfig } from './interface';
import { FormStore } from '@/components';
export interface IDisplayConfigCreater<FM> {
    inline?: ComputedPropertyCreater<boolean, FM>;
    isViewOnly?: ComputedPropertyCreater<boolean, FM>;
    showMessage?: ComputedPropertyCreater<boolean, FM>;
    textAlign?: ComputedPropertyCreater<'center' | 'left' | 'right', FM>;
    size?: ComputedPropertyCreater<boolean, FM>;
    col?: ComputedPropertyCreater<number, FM>;
    offset?: ComputedPropertyCreater<number, FM>;
    offectRight?: ComputedPropertyCreater<number, FM>;
    prefix?: ComputedPropertyCreater<any, FM>;
    suffix?: ComputedPropertyCreater<any, FM>;
    height?: ComputedPropertyCreater<string, FM>;
    useLabel?: ComputedPropertyCreater<boolean, FM>;
}
export interface IDisplayConfig<FM> extends ComputedPick<IDisplayConfigCreater<FM>, FM> {
}
export declare class DisplayConfig<FM> {
    itemConfig: IItemConfig<FM>;
    staticProps: IKeyValueMap;
    readonly props: Partial<FormStore> & IKeyValueMap;
    constructor(itemConfig?: IItemConfig<FM>, staticProps?: IKeyValueMap);
    init(itemConfig: IItemConfig<FM>, staticProps: IKeyValueMap): this;
    readonly isInlineMessage: boolean;
    readonly isShowMessage: boolean;
    readonly textAlign: string;
    readonly isDisabled: any;
    readonly showSize: any;
    readonly label: string;
    readonly coltal: number;
    readonly colSpan: number;
    readonly formItemStyle: {
        width: string;
        height: string;
        marginBottom: number;
        textAlign: string;
    };
    readonly prefix: any;
    readonly suffix: any;
    readonly useColumn: any;
}
