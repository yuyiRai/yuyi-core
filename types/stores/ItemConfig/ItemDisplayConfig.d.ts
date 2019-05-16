import { IKeyValueMap } from 'mobx';
import { IItemConfig, ComputedProperty } from './interface';
export interface IDisplayConfigConstructor<FM> {
    inline?: ComputedProperty<boolean, FM>;
    isViewOnly?: ComputedProperty<boolean, FM>;
    showMessage?: ComputedProperty<boolean, FM>;
    textAlign?: ComputedProperty<'center' | 'left' | 'right', FM>;
    disabled?: ComputedProperty<boolean, FM>;
    size?: ComputedProperty<boolean, FM>;
    col?: ComputedProperty<number, FM>;
    offset?: ComputedProperty<number, FM>;
    offectRight?: ComputedProperty<number, FM>;
    prefix?: ComputedProperty<any, FM>;
    suffix?: ComputedProperty<any, FM>;
    height?: ComputedProperty<string, FM>;
    useLabel?: ComputedProperty<boolean, FM>;
}
export interface IDisplayConfig {
    inline?: boolean;
    isViewOnly?: boolean;
    showMessage?: boolean;
    textAlign?: 'center' | 'left' | 'right';
    disabled?: boolean;
    size?: boolean;
    col?: number;
    offset?: number;
    offectRight?: number;
    prefix?: any;
    suffix?: any;
    height?: string;
    useLabel?: boolean;
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
