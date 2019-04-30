import { Col } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import AntFormItem, { FormItemProps } from 'antd/lib/form/FormItem';
import 'antd/lib/form/style/css';
import { inject, observer, Provider } from 'mobx-react';
import * as React from 'react';
import { ItemConfig } from '../../stores';
import Utils, { } from '../../utils';
import { OFormItemCommon } from './Interface/FormItem';
import { ItemSwitchType } from './Item';
import { computed, autorun, IReactionDisposer, runInAction, reaction, observable, action,  } from 'mobx';
import { set } from 'lodash'
import { createTransformer, expr } from 'mobx-utils';
import { FormStore } from './FormStore';
import { autobind } from 'core-decorators';

const ChildrenContext = React.createContext({
  children: null
})

export interface IFormItemProps extends FormItemProps, OFormItemCommon {
  store?: FormItemStore;
}

export interface IFormItemState {
  instance: FormItem;
  init: boolean;
}
export const OAntFormItem = observer((props: any) => {
  const { itemConfig, children, ...other } = props
  return <AntFormItem colon={itemConfig.isViewOnly} label={itemConfig.label} {...other}>{children}</AntFormItem>
})

export class FormItemStore {
  ruleWatcher: IReactionDisposer;
  validateReset: IReactionDisposer;
  @observable itemConfig: ItemConfig;
  @observable.ref storeForm: FormStore;

  @computed.struct get antdForm(): WrappedFormUtils {
    return this.storeForm.antdFormMap.get(this.code)
  }

  @action.bound setAntdForm(antdForm: WrappedFormUtils){
    this.storeForm.setAntdForm(antdForm, this.code)
  }

  constructor(storeForm: FormStore, code: string) {
    this.storeForm = storeForm
    this.itemConfig = new ItemConfig(storeForm.getConfig(code), storeForm.formSource, this)
    this.setAntdForm(storeForm.antdForm)
    
    this.ruleWatcher = reaction(() => this.itemConfig.rule, (rule) => {
      console.log('ruleWatcher', rule)
      this.itemConfig.updateVersion()
      storeForm.updateError(code)
      const value = Utils.cloneDeep(this.itemConfig.currentValue)
      // this.antdForm.resetFields([this.code])
      if(this.antdForm.getFieldError(this.code)){
        this.antdForm.setFields(set({}, this.code, {value}))
        // this.antdForm.validateFields([this.code])
      }
    })
  }
  @computed get code(): string {
    return this.itemConfig.code;
  }

  @action.bound init() {
    const { storeForm, code } = this;
    // reaction(() => this.fieldDecorator, () => {
    //   console.log('fieldDecorator change', code)
    // })
    this.validateReset = autorun(() => {
      if (!storeForm.hasErrors(code) || !this.itemConfig.rule) {
        storeForm.reactionAntdForm(antdForm => {
          // console.log('updateVersion', code, this.antdForm.getFieldError(code))
          this.itemConfig.updateVersion()
          this.setAntdForm(antdForm)
        })
      }
        // this.antdForm.validateFields([code])
    })
  }

  @autobind dispose() {
    this.ruleWatcher()
    this.validateReset()
  }

  @computed get fieldDecorator() {
    // console.log('get fieldDecorator')
    // trace()
    return this.itemConfig.$version >-1 && this.getFieldDecorator(this)
  }
  
  getFieldDecorator = (store: FormItemStore) => {
    const { code, antdForm, storeForm } = store;
    const { itemConfig } = store;
    const { value } = itemConfig
    const hasError = storeForm.hasErrors(itemConfig.code)
    console.log('get fieldDecorator', value, hasError)
    // const { itemConfig } = this.state;
    // const { value } = itemConfig
    return antdForm.getFieldDecorator(code, this.decoratorOptions);
  }
  @computed get decoratorOptions(){
    return this.getFieldDecoratorOptions(this.itemConfig)
  }
  getFieldDecoratorOptions = createTransformer((itemConfig: ItemConfig) => {
    // console.log('update fieldDecorator options', itemConfig.rule)
    return {
      validateTrigger: ['onChange', 'onBlur'],
      rules: itemConfig.rule, initialValue: itemConfig.value, getValueProps() {
        // console.log('value filter', itemConfig, props);
        return { value: Utils.isNotEmptyValueFilter(itemConfig.currentValue, itemConfig.value) || null }
      }
    }
  }, { debugNameGenerator: () => 'getFieldDecoratorOptions' })

  
  @computed get Component() {
    const { code, antdForm, itemConfig } = this
    const { type, displayProps } = itemConfig
    const Component = ItemSwitchType(type)
    // console.log('getComponent');
    return <Component code={code} antdForm={antdForm} disabled={displayProps.isDisabled} placeholder={itemConfig.placeholder || `请输入${itemConfig.label}`} />;
  }

  @computed get renderer() {
    const { itemConfig } = this;
    // const { label } = itemConfig
    // console.log('get renderer', itemConfig.$version)
    return (children: JSX.Element) => {
      return (
        <Provider itemConfig={itemConfig}>
          <ChildrenContext.Provider value={{ children }}>
            <FormItemContainer>
              {children}
            </FormItemContainer>
          </ChildrenContext.Provider>
        </Provider>
      );
    }
  }
}

@inject((stores: { storeForm: FormStore }, props: IFormItemProps, context) => {
  // console.log('fromitem get store', stores, props, context)
  const { storeForm } = stores;
  const store = storeForm.registerItemStore(props.code) 
  store.itemConfig.setForm(storeForm.formSource)
  return { store }
})
@observer
export default class FormItem extends React.Component<IFormItemProps, IFormItemState> {
  constructor(props: IFormItemProps) {
    super(props);
    // console.log('FormItem init', props);
    this.state = {
      instance: this,
      init: false
    }
  }
  componentDidMount() {
    this.props.store.init()
  }
  componentWillUnmount() {
    runInAction(() => this.props.store.dispose())
  }

  public render() {
    const { code, store, ...other } = this.props;
    // console.log('remder', store.itemConfig.code, store.itemConfig.rule);
    // console.log(this.store.itemConfig.label)
    return store.renderer(
      <OAntFormItem itemConfig={store.itemConfig} {...other}>{
        store.fieldDecorator(React.cloneElement(store.Component))
      }</OAntFormItem>
    )
  }
}

@inject('itemConfig')
@observer
export class FormItemContainer extends React.Component<any, IFormItemState> {
  lastContainerProps = {}
  styleTransform = createTransformer((itemConfig: ItemConfig) => {
    // console.log('FormItemContainer style change')
    return { display: itemConfig.hidden ? 'none' : undefined }
  })
  propsTransform = createTransformer((itemConfig: ItemConfig) => {
    // console.log('FormItemContainer props change')
    const { type, displayProps: { colSpan, useColumn }, lg, sm, xs, offset } = itemConfig
    return { type, displayProps: { colSpan, useColumn }, lg, sm, xs, offset }
  })
  @computed get style() {
    return { display: expr(() => this.props.itemConfig.hidden ? 'none' : undefined) }
  }
  @computed get containerProps() {
    const { itemConfig } = this.props;
    return this.propsTransform(itemConfig)
  }
  @computed get children() {
    // console.log('FormItemContainer children change')
    return (
      <ChildrenContext.Consumer>{
        ({ children }) => children
      }</ChildrenContext.Consumer>
    )
  }
  @computed get renderer() {
    // console.log('FormItemContainer container change')
    const { type, displayProps: { colSpan, useColumn }, lg, sm, xs, offset } = this.containerProps
    if (useColumn === false) {
      return this.children;
    }
    if (type === 'address') {
      return (
        <Col className='use-item-col' lg={lg || 16} sm={24} offset={offset} style={this.style}>
          {this.children}
        </Col>
      )
    }
    return (
      <Col className='use-item-col' lg={colSpan} sm={sm || 12} xs={xs || 24} offset={offset} style={this.style}>
        {this.children}
      </Col>
    )
  }
  render() {
    return this.renderer
  }
}
