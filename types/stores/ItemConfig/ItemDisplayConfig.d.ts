import { IKeyValueMap } from 'mobx';
import { IItemConfig, ComputedProperty } from './interface';
export interface IDisplayConfigConstructor {
    inline?: ComputedProperty<boolean>;
    isViewOnly?: ComputedProperty<boolean>;
    showMessage?: ComputedProperty<boolean>;
    textAlign?: ComputedProperty<'center' | 'left' | 'right'>;
    disabled?: ComputedProperty<boolean>;
    size?: ComputedProperty<boolean>;
    col?: ComputedProperty<number>;
    offset?: ComputedProperty<number>;
    offectRight?: ComputedProperty<number>;
    prefix?: ComputedProperty<any>;
    suffix?: ComputedProperty<any>;
    height?: ComputedProperty<string>;
    useLabel?: ComputedProperty<boolean>;
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
