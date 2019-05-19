import { CommonStore } from '@/stores/ItemConfig/interface/CommonStore';
import { FormStore } from './index';
export declare class GFormStore extends CommonStore {
    static formMap: WeakMap<any, FormStore>;
    static disposedForm(form: any): void;
    static registerForm<T = any>(form: any, instance: T, replace?: FormStore): FormStore<any, import("./FormItemStoreBase").IFormItemStoreCore<any, any>>;
}
