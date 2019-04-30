import * as React from 'react'
import { IFormItemConfig } from './Interface';
import { IKeyValueMap } from 'mobx';
import { FormStore } from './FormStore';
import { observer, inject, Provider } from 'mobx-react';

import LocaleProvider from 'antd/lib/locale-provider';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { FormGroup } from './Form';
import { Utils } from '../../utils';

export interface ICommonFormProps extends IKeyValueMap {
  model: any;
  config?: IFormItemConfig[];
  formStore?: FormStore;
  storeRef?: (store: FormStore) => void
}
export interface ICommonFormState extends IKeyValueMap {
  formStore: FormStore;
}

@inject(
  (stores, nextProps: ICommonFormProps, context) => {
    console.log('CommonForm get store', stores, nextProps, context)
    return { 'storeForm': stores['storeForm'] }
  }
)
@observer
export class CommonForm extends React.Component<ICommonFormProps, ICommonFormState> {
  constructor(props: ICommonFormProps) {
    super(props)
    console.log('init parsent formStore', props.formStore)
    this.state = {
      formStore: FormStore.registerForm(props.model, this)
    }
  }
  @Utils.observable state: ICommonFormState

  static getDerivedStateFromProps(nextProps: ICommonFormProps, prevState: ICommonFormState) {
    const { formStore: last } = prevState
    if (nextProps.formStore) {
      // console.log('getter parsent formStore', nextProps.formStore)
    }
    if (last.formSource !== nextProps.model) {
      // console.log('getDerivedStateFromProps', nextProps, prevState)
      FormStore.disposedForm(prevState.formStore.formSource)
      prevState.formStore.formItemMap.delete(prevState.formStore.formSource)
    }
    const formStore = FormStore.registerForm(nextProps.model, prevState.formStore.instance, prevState.formStore)
    if (nextProps.config) {
      formStore.setConfig(nextProps.config)
    }
    if (Utils.isFunction(nextProps.storeRef)) {
      nextProps.storeRef(formStore)
    }
    // console.log('formStore diff', formStore, prevState.formStore, formStore !== prevState.formStore)
    if (formStore !== prevState.formStore) {
      return { ...prevState, formStore }
    }
    return prevState
  }


  public render() {
    const { children, config } = this.props
    return (
      <LocaleProvider locale={zh_CN}>
        <Provider storeForm={this.state.formStore} ><>
          {Utils.isArray(config) && <FormGroup config={config} ></FormGroup>}
          {children}
        </></Provider>
      </LocaleProvider>
    );
  }
}