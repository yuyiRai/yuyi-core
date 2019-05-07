import { Row, Col } from 'antd';
import Checkbox, { CheckboxGroupProps } from 'antd/lib/checkbox';
import 'antd/lib/checkbox/style/css';
// import Switch, { SwitchProps } from 'antd/lib/switch';
// import 'antd/lib/switch/style/css';
import 'element-theme-default/lib/switch.css';
import { Switch } from 'element-react'
import * as React from 'react';
import { OFormItemCommon } from '../Interface/FormItem';
import { commonInjectItem } from "./commonInjectItem";
import { useOptionsStore } from './OptionsUtil';
import { Observer } from "mobx-react-lite";
export interface IAppProps extends CheckboxGroupProps, OFormItemCommon {

}
export const CheckItem: React.FunctionComponent<IAppProps> = commonInjectItem(
  props => <Check {...props} />
)

const Check: React.FunctionComponent<IAppProps> = ({ antdForm, formStore, code, itemConfig, onChange, ...other }) => {
  const store = useOptionsStore(itemConfig)
  // console.log(other, optionStore, optionStore.displayOptions)
  return (
    <Observer>{() =>
      <Checkbox.Group {...other} style={{ width: '100%' }} onChange={onChange} options={store.displayOptions as any}>
        <Row>
          <Col span={8}><Checkbox value="A">A</Checkbox></Col>
          <Col span={8}><Checkbox value="B">B</Checkbox></Col>
          <Col span={8}><Checkbox value="C">C</Checkbox></Col>
          <Col span={8}><Checkbox value="D">D</Checkbox></Col>
          <Col span={8}><Checkbox value="E">E</Checkbox></Col>
        </Row>
      </Checkbox.Group>
    }</Observer>
  );
}
interface SwitchProps extends ElementReactLibs.ComponentProps<{}> {
  value?: number | string | boolean
  disabled?: boolean
  width?: number
  onIconClass?: string
  offIconClass?: string
  onText?: string
  offText?: string
  onColor?: string
  offColor?: string
  onValue?: number | string | boolean
  offValue?: number | string | boolean
  name?: string
  onChange?(value: number | string | boolean): void
}
export interface ISwitchItemProps extends SwitchProps, OFormItemCommon {

}
const OSwitch = ({ antdForm, formStore, code, itemConfig, ...other }: ISwitchItemProps) => {
  console.log(other)
  return <Switch {...other} />
}
export const SwitchItem: React.FunctionComponent<ISwitchItemProps> = commonInjectItem(
  (props) => <OSwitch {...props} onText='' offText='' />
)