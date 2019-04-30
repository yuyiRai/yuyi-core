import { IReactComponent } from 'mobx-react';
import { slotInjectContainer, useSlots, react2Vue } from '../../utils/SlotUtils';
import { FormGroup } from './Form';
import { CommonForm } from './CommonForm';
import React from 'react'

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

@slotInjectContainer
export class RCommonForm2 extends React.Component<any, any> {
  @useSlots App: IReactComponent<any>;
  public render() {
    const { config, model, children, ...other } = this.props
    console.log('ElCommonForm', this)
    return (
      <CommonForm {...other} model={model}>
        <FormGroup config={config} >{children}</FormGroup>
      </CommonForm>
    );
  }
}
export const ElCommonForm2 = react2Vue(RCommonForm);