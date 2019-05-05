import { IReactComponent } from 'mobx-react';
import { slotInjectContainer, useSlots, react2Vue } from '../../utils/SlotUtils';
import { FormGroup } from './Form';
import { CommonForm } from './CommonForm';
import React from 'react'
import { autobind } from 'core-decorators';
import { FormStore } from './FormStore';

@slotInjectContainer
export class RItemGroup extends React.Component<any, any> {
  @useSlots App: IReactComponent<any>;
  public render() {
    console.log('ElItemGroup', this)
    return <FormGroup {...this.props} config={this.props.config} />;
  }
}
export const ElItemGroup = react2Vue(RItemGroup);

@slotInjectContainer
export class RCommonForm extends React.Component<any, any> {
  @useSlots App: IReactComponent<any>;
  public render() {
    console.log('ElCommonForm', this)
    return <CommonForm {...this.props} model={this.props.model} />;
  }
}
export const ElCommonForm = react2Vue(RCommonForm);

(window as any).logger = []
const logger = (window as any).logger
@slotInjectContainer
export class RCommonForm2 extends React.PureComponent<any, any> {
  @useSlots App: IReactComponent<any>;
  state = {
    model: {},
    lastModel: {},
    lastConfig: {},
    config: []
  }
  // constructor(props: any) {
  //   super(props)
  //   logger.push('getDerivedStateFromProps chgange0');
  //   this.state = RCommonForm2.getDerivedStateFromProps(props, this.state)
  // }
  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if(prevState.lastModel !== nextProps.model) {
      logger.push('getDerivedStateFromProps chgange1');
      prevState.model = Utils.cloneDeep(nextProps.model)
      prevState.lastModel = nextProps.model
    }
    if(prevState.lastConfig !== nextProps.config) {
      logger.push('getDerivedStateFromProps chgange2');
      prevState.config = Utils.cloneDeep(nextProps.config)
      prevState.lastConfig = nextProps.config
    }
    return prevState
  }
  @autobind onChange(code: string, value: any) {
    console.log(code, value);
  }
  @autobind getStoreRef(store: FormStore) {
    if(this.props.storeRef) {
      this.props.storeRef(store)
    }
  }
  public render() {
    const { model } = this.state
    const { children, config, ...other } = this.props
    console.log('ElCommonForm2', this)
    return (
      <CommonForm {...other} model={model} onItemChange={this.onChange} storeRef={this.getStoreRef}>
        <FormGroup config={config} >{children}</FormGroup>
      </CommonForm>
    );
  }
}
export const ElCommonForm2 = react2Vue(RCommonForm2);