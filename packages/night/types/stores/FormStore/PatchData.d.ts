import { FormModel } from "../ItemConfig";
export declare type PatchData<T = FormModel> = {
    name: keyof T;
    value?: any;
    validating?: boolean;
    errors?: Error[];
};
export declare type PatchDataTree<T> = {
    [key: string]: PatchDataTree<T> | PatchData<T>;
};
//# sourceMappingURL=PatchData.d.ts.map