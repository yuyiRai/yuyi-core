import { FormStore } from "../FormStore/FormStore";
import { IKeyValueMap } from 'mobx';
import { CommonStore } from "../CommonStore";
import { FormItemType, IFormItemConstructor } from './interface/ItemConfig';
export declare class ItemConfigBaseConfigModel<V, FM> extends CommonStore {
    [k: string]: any;
    baseConfigKeys: string[];
    baseConfigMap: import("mobx").ObservableMap<string | number, any>;
    readonly i: IFormItemConstructor<FM, V>;
    code: string;
    type: FormItemType;
    nameCode: string;
    readonly keyCode: string;
    readonly keyInnerCode: string;
    readonly children: IKeyValueMap<IFormItemConstructor<FM, V>> | false;
    readonly currentValueFromStore: any;
    formStore: FormStore;
    setFormStore(formStore: FormStore): void;
    readonly formSource: FM;
    private lastReceiveConfig;
    private baseConfigCache;
    protected configInited: boolean;
    readonly FormItemGroup: WeakMap<object, any>;
    constructor();
    /**
     * 设置
     * @param baseConfig 配置项内容
     * @param strict
     */
    protected setBaseConfig(baseConfig: IFormItemConstructor<FM, V>, strict?: boolean): boolean;
    protected getComputedValue(key: string, target?: IFormItemConstructor<FM, V>, defaultValue?: any): any;
    export(): ExportedFormModel<IFormItemConstructor<FM>>;
    static export: <FM_1>(config: ItemConfigBaseConfigModel<any, FM_1>) => ExportedFormModel<IFormItemConstructor<FM_1, any, any>>;
}
export declare type ExportedFormModel<T> = Partial<T> & {
    __isExportObject: true;
};
//# sourceMappingURL=ItemConfigBaseConfigModel.d.ts.map