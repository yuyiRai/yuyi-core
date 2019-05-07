import { IKeyValueMap } from 'mobx';
export interface IDisplayConfig {
    code: string;
    name?: string;
    label?: string;
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
    itemConfig: IDisplayConfig;
    props: IKeyValueMap;
    init(itemConfig: IDisplayConfig, props: IKeyValueMap): this;
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
