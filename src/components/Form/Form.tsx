import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import Row from 'antd/lib/row';
import 'antd/lib/row/style/css';
import { observer, Provider } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import FormItem from './FormItem';
import { FormStore } from './FormStore';
import { IFormItemConstructor } from './Interface';
import { form } from './util';
import { NativeStore } from './CommonForm';
import { Observer } from 'mobx-react-lite';
// import { Utils } from '../../build';

export interface IFormProps {
  formStore?: FormStore;
  config: IFormItemConstructor[];
  form?: WrappedFormUtils<any>;
  [key: string]: any;
}
export interface IFormState {
  fieldDecorator: GetFieldDecoratorOptions[]
}

const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18, offset: 1 } }


// declare const config: IFormItemConfig
// declare const i: number
@observer
export default class Form extends React.Component<IFormProps, any> {
  state: any = {
    itemChildren: [],
    lastConfig: [],
    lastStore: null,
    form: null
  }
  static getDerivedStateFromProps(nextProps: IFormProps, prevState: any) {
    const { form, formStore } = nextProps
    if (formStore instanceof FormStore) {
      if (nextProps.config !== prevState.lastConfig) {
        formStore.setConfig(nextProps.config)
      }
      if (formStore !== prevState.lastStore) {
        console.log(Utils)
        console.log(formStore.configList, prevState.lastConfig, formStore.configList === prevState.lastConfig)
        prevState.itemChildren = (
          // <For index='i' each="config" of={formStore.configList}>
          //   <FormItem {...formItemLayout} key={i} code={config.code}></FormItem>
          // </For>
          formStore.configList.map(config => {
            return <FormItem {...formItemLayout} key={config.code} code={config.code}></FormItem>
          })
        )
        // prevState.a = (
        //   <For each="config" of={formStore.configList} index="i">
        //     <FormItem {...formItemLayout} key={config.code} code={config.code}></FormItem>
        //   </For>
        // )
        prevState.form = form
        prevState.lastStore = formStore
        prevState.lastConfig = nextProps.config
        formStore.setAntdForm(form)
      }
      formStore.receiveAntdForm(form)
      console.log('getDerivedStateFromProps', nextProps)
    }
    return prevState
  }
  // @Utils.computed get itemChildren(){
  //   const { formStore } = this.props
  //   return formStore.configList.map(config => {
  //     return <FormItem {...formItemLayout} key={config.code} code={config.code}></FormItem>
  //   })
  // }
  public render() {
    const { form } = this.state
    const { children, className } = this.props
    // console.log(form, children)
    return (
      <Provider antdForm={form} formStore={this.props.formStore}>
        <>
          {/* <If condition={true}>
            good taste in music
          </If> */}
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

export const FormGroup: React.FunctionComponent<IFormProps> = (props: IFormProps) => {

  return (
    <NativeStore.Consumer>{
      (value: any) => {
        console.log('fromgroup get store', props, value)
        return (
          <Observer render={() => (
            value.formStore && <InjectedForm {...props} formStore={value.formStore} />
          )}></Observer>
        )
      }
    }</NativeStore.Consumer>
  )
}