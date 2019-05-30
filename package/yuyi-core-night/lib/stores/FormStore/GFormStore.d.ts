import { CommonStore } from '@/stores/ItemConfig/interface/CommonStore';
import { FormStore } from './FormStore';
export declare class GFormStore extends CommonStore {
    static formMap: WeakMap<any, FormStore<any, any>>;
    static disposedForm(form: any): void;
    static registerForm<T = any>(form: any, instance: T, replace?: FormStore<any, any>): FormStore<any, any>;
}
