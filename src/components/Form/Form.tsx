import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import Row from 'antd/lib/row';
import 'antd/lib/row/style/css';
import { inject, observer, Provider } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import FormItem from './FormItem';
import { FormStore } from './FormStore';
import { IFormItemConfig } from './Interface';
import { form } from './util';
// import { Utils } from '../../build';

export interface IFormProps {
  storeForm?: FormStore;
  config: IFormItemConfig[];
  form?: WrappedFormUtils<any>;
  [key: string]: any;
}
export interface IFormState {
  fieldDecorator: GetFieldDecoratorOptions[]
}

const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18, offset: 1 } }


declare const config: IFormItemConfig
declare const i: number
@observer
export default class Form extends React.Component<IFormProps, any> {
  state: any = {
    itemChildren: [],
    lastConfig: [],
    form: null
  }
  static getDerivedStateFromProps(nextProps: IFormProps, prevState: any) {
    const { form, storeForm } = nextProps
    if (storeForm !== prevState.lastConfig) {
      console.log(Utils)
      console.log(storeForm.configList, prevState.lastConfig, storeForm.configList===prevState.lastConfig)
      prevState.itemChildren = (
        <For index='i' each="config" of={storeForm.configList}>
          <FormItem {...formItemLayout} key={i} code={config.code}></FormItem>
        </For>
        // storeForm.configList.map(config => {
        //   return <FormItem {...formItemLayout} key={config.code} code={config.code}></FormItem>
        // })
      )
      // prevState.a = (
      //   <For each="config" of={storeForm.configList} index="i">
      //     <FormItem {...formItemLayout} key={config.code} code={config.code}></FormItem>
      //   </For>
      // )
      prevState.form = form
      prevState.lastConfig = storeForm
      storeForm.setAntdForm(form)
    }
    storeForm.receiveAntdForm(form)
    console.log('getDerivedStateFromProps')
    return prevState
  }
  // @Utils.computed get itemChildren(){
  //   const { storeForm } = this.props
  //   return storeForm.configList.map(config => {
  //     return <FormItem {...formItemLayout} key={config.code} code={config.code}></FormItem>
  //   })
  // }
  public render() {
    const { form } = this.state
    const { children, className } = this.props
    console.log(form, children)
    return (
      <Provider antdForm={form}>
        <>
          <If condition={true}>
              good taste in music
          </If>
          <Row className={className}>
            {this.state.itemChildren}
          </Row>
          <div>{children}</div>
        </>
      </Provider>
    );
  }
}

export const StyledForm = styled(Form)`
  border-color: #f522d2;
  .has-error .el-input__inner, .has-error .el-input__inner:hover {
    border-color: #f5222d !important;
  }
  .el-input__inner:not(.is-disabled) {
    &.is-active, &.is-hover, &:hover, &:focus {
      border-color: #40a9ff;
      transition: all 0.3s;
    }
    &.is-active, &:focus {
      border-right-width: 1px !important;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);    
    }
  }
  .has-error .el-input__inner:focus:not(.is-disabled) {
    border-color: #ff4d4f;
    box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
  }
`
export const InjectedForm = form(StyledForm as any) as any

export const FormGroup: React.FunctionComponent<IFormProps> = inject(
  (stores, nextProps: IFormProps, context) => {
    console.log('fromgroup get store', stores, nextProps, context)
    const store = stores['storeForm'];
    if (store) {
      store.setConfig(nextProps.config)
    }
    return { 'storeForm': stores['storeForm'] }
  }
)(observer((props: IFormProps) => {
  return <InjectedForm {...props} />
}))
