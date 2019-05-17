import { IKeyValueMap } from 'mobx';
import { IItemConfig, ComputedPropertyCreater, ComputedPick } from './interface';
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
export declare class DisplayConfig {
    itemConfig: IItemConfig;
    props: IKeyValueMap;
    init(itemConfig: IItemConfig, props: IKeyValueMap): this;
    readonly isInlineMessage: boolean;
    readonly isShowMessage: boolean;
    readonly textAlign: any;
    readonly isDisabled: any;
    readonly showSize: any;
    readonly label: string;
    readonly coltal: number;
    readonly colSpan: number;
    readonly formItemStyle: {
        width: string;
        height: string;
        marginBottom: number;
        textAlign: any;
    };
    readonly prefix: any;
    readonly suffix: any;
    readonly useColumn: any;
}
