import { ObservableMap } from 'mobx';
export declare class FormStore {
    static formMap: WeakMap<any, FormStore>;
    static registerForm(form: any): FormStore;
    readonly form: import("mobx").IKeyValueMap<any>;
    formMap: ObservableMap<any, any>;
    setForm(form: any): void;
    replaceForm(formMap: ObservableMap<string, any>): void;
}
