import Form, { FormComponentProps } from 'antd/lib/form'
import { } from 'antd/lib/form/interface'
import { IFormProps } from './Form';
import { IKeyValueMap, } from 'mobx';
import { get, set } from 'lodash';
import Utils from '../../utils';
import { FormStore } from './FormStore';
import { WrappedFormUtils } from 'antd/lib/form/Form';

export function filterToValue(v: any, defaultValue?: any) {
  const v2 = Utils.isNotEmptyValueFilter(Utils.isArray(v) ? Utils.zipEmptyData(v) : v, defaultValue)
  return v2 === null ? undefined : v2
}

export const objToForm = (model: IKeyValueMap, store: FormStore, form: WrappedFormUtils) => {
  let target = {}
  const r = {}
  // console.log('formValueTransform', store.formValueTransform)
  for (const config of store.configList) {
    const v = get(model, config.code)
    const value = store.getF2VValue(config.code, filterToValue(v, config.value))
    // console.log('formValueTransform', value, v)
    set(target, config.code, Form.createFormField({ value }))
    // console.log('initvalue', config.code, v, value);
    if (!Utils.isEqual(v, value, true)) {
      // set(model, config.code, value)
      Object.assign(r, store.patchFieldsChange(set({}, config.code, { value, name: config.code })))
      // console.log('patchFieldsChange result', r, store);
    }
  }
  // setTimeout(() => {
    
  //   console.log('patchFieldsChange result', store.formItemConfigMap.$antdForm.validateFields(Object.keys(r)), r, store);
  // }, 100);
  // console.log('mapPropsToFields', target)
  // for (let [key, value] of Object.entries(model)) {
  //   target[key] = Form.createFormField({ value })
  // }
  return target
}

export const form = Form.create({
  onFieldsChange(props: IFormProps & FormComponentProps<any>, changedFields: any, allValues) {
    //将表单变化的值绑定到store中
    // console.log('onFieldsChange', props, changedFields, allValues);
    const r = props.formStore.patchFieldsChange(changedFields);
    console.log('onFieldsChange patchFieldsChange result', r, changedFields);
  },
  onValuesChange(props: IFormProps & FormComponentProps<any>, values, allValues) {
    // console.log('onValuesChange', props, values, allValues);
  },
  mapPropsToFields(props: IFormProps & FormComponentProps<any>) {
    //将store中的值绑定到视图中
    return objToForm(props.formStore.formSource, props.formStore, props.form)
  },
})