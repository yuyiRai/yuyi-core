import { IKeyValueMap } from 'mobx';
import { SelectAndSearchStore } from './Store';
export interface OptionComplier {
    (props: {
        key: string;
        label: string;
        value: string;
        data?: any;
    }): any;
}
export interface TagComplier {
    (props: {
        prefix: string;
        label: string;
        suffix: string;
    }): any;
}
export declare class SelectAndSearchViewStore extends SelectAndSearchStore {
    tagComplier: TagComplier;
    optionComplier: OptionComplier;
    readonly classNames: {
        [x: string]: any;
        'line-height-36': any;
    };
    readonly style: {
        "width": any;
    };
    extendFromVueComponent: (properties: IKeyValueMap<any>) => this & IKeyValueMap<any>;
    readonly prefixDom: any;
    readonly emptyOptionsDom: any;
    readonly displayOptionsDom: any[];
    readonly popperOptionsDom: any[];
}
