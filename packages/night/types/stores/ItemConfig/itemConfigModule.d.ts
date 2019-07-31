import { CommonStore } from "../CommonStore";
import { IItemConfig } from "./interface";
export declare class ItemConfigModule<FM, V> extends CommonStore {
    itemConfig: IItemConfig<FM, V>;
    code: string;
    constructor(itemConfig: IItemConfig<FM, V>);
    protected moduleInit(itemConfig: IItemConfig<FM, V>): void;
}
//# sourceMappingURL=itemConfigModule.d.ts.map