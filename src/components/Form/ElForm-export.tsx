import { autobind } from 'core-decorators';
import { IReactComponent } from 'mobx-react';
import React from 'react';
import Vue from 'vue';
import { react2Vue, SlotContext, slotInjectContainer, useSlots } from '@/utils/SlotUtils';
import { CommonForm } from './CommonForm';
import { FormGroup } from './Form';
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
  state = {
    model: {},
    lastModel: {},
    lastConfig: {},
    config: null
  }
  // constructor(props: any) {
  //   super(props)
  //   logger.push('getDerivedStateFromProps chgange0');
  //   this.state = RCommonForm2.getDerivedStateFromProps(props, this.state)
  // }
  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (!Utils.isEqual(prevState.lastModel, nextProps.model)) {
      logger.push('getDerivedStateFromProps chgange1');
      prevState.model = Utils.cloneDeep(nextProps.model)
      prevState.lastModel = nextProps.model
    }
    if (prevState.lastConfig !== nextProps.config) {
      logger.push('getDerivedStateFromProps chgange2');
      // if(!prevState.config)
        prevState.config = Utils.cloneDeep(nextProps.config)
      prevState.lastConfig = nextProps.config
    }
    return prevState
  }
  @autobind onChange(code: string, value: any) {
    Vue.prototype.$set(this.props.model, code, value)
    console.log(code, value, this);
  }
  @autobind getStoreRef(store: FormStore) {
    if(this.props.storeRef) {
      this.props.storeRef(store)
    }
  }
  @useSlots Inter: IReactComponent<any>;
  public render() {
    const { Inter } = this
    const { model, config } = this.state
    const { children, config: a, slots, scopedSlots, ...other } = this.props
    console.log('ElCommonForm2', this)
    return (
      <span>
        <Inter />
        { Utils.isNotEmptyArray(config) && <SlotContext.Provider value={{slots, scopedSlots}}>
          <CommonForm {...other} model={model} onItemChange={this.onChange} storeRef={this.getStoreRef}>
            <FormGroup config={config} >{children}</FormGroup>
          </CommonForm>
        </SlotContext.Provider>}
      </span>
    );
  }
}
export const ElCommonForm2 = react2Vue(RCommonForm2);