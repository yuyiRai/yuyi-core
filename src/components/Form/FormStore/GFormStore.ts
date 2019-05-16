import { CommonStore } from '@/stores/ItemConfig/interface/CommonStore';
import { FormStore } from './index';
export class GFormStore extends CommonStore {
  static formMap: WeakMap<any, FormStore> = new WeakMap<any, FormStore>();
  static disposedForm(form: any) {
    this.formMap.delete(form);
  }
  static registerForm<T = any>(form: any, instance: T, replace?: FormStore) {
    let formStore: FormStore | undefined = this.formMap.get(form);
    if (!formStore) {
      formStore = replace || new FormStore();
      formStore.setForm(form, instance);
      // console.log('register form', form)
      this.formMap.set(form, formStore);
    }
    return formStore;
  }
}
