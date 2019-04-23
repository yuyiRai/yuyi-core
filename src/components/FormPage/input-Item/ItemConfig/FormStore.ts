import { difference, keys, forEach, toArray, isNil } from 'lodash';
import { action, computed, extendObservable, observable, ObservableMap } from 'mobx';
import { Utils } from 'src/utils/Utils';
export class FormStore {
  static formMap: WeakMap<any, FormStore> = new WeakMap<any, FormStore>();
  static registerForm(form: any) {
    let formStore: FormStore | undefined = this.formMap.get(form);
    if (!formStore) {
      formStore = new FormStore();
      formStore.setForm(form);
      // console.log('register form', form)
      this.formMap.set(form, formStore);
    }
    return formStore;
  }
  @computed
  get form() {
    return extendObservable({}, this.formMap.toPOJO());
  }
  @observable.shallow
  formMap = observable.map({});
  @action.bound
  setForm(form: any) {
    // this.formMap.replace(form)
    const push = difference(keys(form), toArray(this.formMap.keys() as any));
    forEach(toArray(this.formMap), ([key, value]) => {
      if (isNil(form[key]))
        this.formMap.delete(key);
      else if (!Utils.isEqual(form[key], value)) {
        this.formMap.set(key, form[key]);
      }
    });
    forEach(push, key => {
      this.formMap.set(key, form[key]);
    });
    // this.form = form;
  }
  @action.bound
  replaceForm(formMap: ObservableMap<string, any>) {
    this.formMap = formMap;
  }
}
