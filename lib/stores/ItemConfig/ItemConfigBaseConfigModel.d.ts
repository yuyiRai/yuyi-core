import { FormStore } from '@/components/Form/FormStore';
import { IKeyValueMap } from 'mobx';
import { IViewModel } from 'mobx-utils';
import { CommonStore } from "./interface/CommonStore";
import { IFormItemConstructor } from './interface/ItemConfig';
export declare class ItemConfigBaseConfigModel<V, FM> extends CommonStore {
    [k: string]: any;
    baseConfigKeys: string[];
    baseConfig: IFormItemConstructor<FM, V>;
    baseConfigModel: IViewModel<IFormItemConstructor<FM, V>>;
    readonly i: IFormItemConstructor<FM, V>;
    readonly type: import("./interface/ItemConfig").FormItemType;
    readonly code: string;
    readonly keyCode: string;
    readonly keyInnerCode: string;
    readonly children: IKeyValueMap<IFormItemConstructor<FM, V>> | false;
    readonly currentValueFromStore: any;
    formStore: FormStore;
    setFormStore(formStore: FormStore): void;
    readonly formSource: FM;
    private lastReceiveConfig;
    protected configInited: boolean;
    protected setBaseConfig(baseConfig: IFormItemConstructor<FM, V>, strict?: boolean): boolean;
    getComputedValue(key: string, target?: IFormItemConstructor<FM, V>, defaultValue?: any): any;
    export(): ExportedFormModel<IFormItemConstructor<FM>>;
    static export: <FM_1>(object: ItemConfigBaseConfigModel<any, FM_1>) => ExportedFormModel<IFormItemConstructor<FM_1, any, any>>;
}
export declare type ExportedFormModel<T> = Partial<T> & {
    __isExportObject: true;
};
