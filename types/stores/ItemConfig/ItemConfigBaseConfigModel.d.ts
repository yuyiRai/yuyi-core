import { IKeyValueMap } from 'mobx';
import { IViewModel } from 'mobx-utils';
import { FormStore } from '../../components/Form/FormStore';
import { CommonStore } from "./interface/CommonStore";
import { IFormItemConstructor } from './interface/ItemConfig';
export declare class ItemConfigBaseConfigModel<V, FM> extends CommonStore {
    [k: string]: any;
    form: FM;
    baseConfigKeys: string[];
    baseConfig: IFormItemConstructor<V, FM>;
    baseConfigModel: IViewModel<IFormItemConstructor<V, FM>>;
    readonly i: IFormItemConstructor<V, FM>;
    readonly type: import("./interface/ItemConfig").FormItemType;
    readonly code: string;
    readonly keyCode: string;
    readonly keyInnerCode: string;
    readonly children: IKeyValueMap<IFormItemConstructor<V, FM>> | false;
    setForm(form: any): void;
    formStore: FormStore;
    setFormStore(formStore: FormStore): void;
    readonly formSource: any;
    private lastReceiveConfig;
    protected configInited: boolean;
    setBaseConfig(baseConfig: IFormItemConstructor<V, FM>, strict?: boolean): boolean | IFormItemConstructor<V, FM>;
    getComputedValue(key: string, target?: any, defaultValue?: any): any;
    export(): any;
    static export: import("mobx-utils").ITransformer<ItemConfigBaseConfigModel<any, any>, any>;
}
