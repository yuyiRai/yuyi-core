import { CommonStore } from '../CommonStore';
import { FormStore } from './FormStore';
export declare class GlobalFormStore extends CommonStore {
    constructor();
    formMap: WeakMap<any, FormStore<any, any>>;
    disposedForm(form: any): void;
    registerForm<T = any>(form: any, instance: T, replace?: FormStore<any, any>): FormStore<any, any>;
}
export declare class GFormStore extends CommonStore {
    static globalFormStore: GlobalFormStore;
    static readonly formMap: WeakMap<any, FormStore<any, any>>;
    static disposedForm(form: any): void;
    static registerForm<T = any>(form: any, instance: T, replace?: FormStore<any, any>): FormStore<any, any>;
}
export declare class Test {
    uuid: string;
    list: number[];
    ttt: any;
    constructor();
    a(): GlobalFormStore[];
    b(): GlobalFormStore[];
    c(): GlobalFormStore;
    readonly GlobalFormStore: GlobalFormStore;
    dispose(): void;
}
//# sourceMappingURL=GFormStore.d.ts.map