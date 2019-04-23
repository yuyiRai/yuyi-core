import { IKeyValueMap } from 'mobx';
import { ItemConfig } from './ItemConfig';
export declare class DisplayConfig {
    itemConfig: ItemConfig;
    props: IKeyValueMap;
    init(itemConfig: ItemConfig, props: IKeyValueMap): this;
    readonly isInlineMessage: any;
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
