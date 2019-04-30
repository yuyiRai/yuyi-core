import * as React from 'react';
import { CommonForm } from './CommonForm';
import { FormGroup } from './Form';
import Button from 'antd/lib/button';
import { FormStore } from './FormStore';
import { ItemConfig } from '../../stores';
import { Icon } from 'antd';

interface IAppProps {
}
const voiceroid = ['1', '2', '3', '4', '5']
// const voiceroid = ['yukari','maki','zunko','akane','aoi']
const props: any = {
  model: {
    name: 'yuyi',
    password: '123456',
    info: {
      birthday: '1996-06-30',
      voiceroid: [...voiceroid]
    },
    // showVoiceroid: false
  },
  config: [
    { label: '姓名', code: 'name', suffix: <Icon type='plus' />, required: form => !form.showVoiceroid, rule: 'commonCode' },
    { label: '密码', code: 'password' },
    { label: '生日', code: 'info.birthday', value: new Date(), type: "date", rule: 'futureDate' },
    { label: '年龄', code: 'info.birthday2', type: "number" },
    {
      label: '提交时间', code: 'info.submitTime', type: "dateToDate", rule: 'dateToDate30', disabled: (form: any, itemConfig: ItemConfig) => {
        // console.log(form, itemConfig);
        return form.showVoiceroid
      }
    },
    { label: 'A', code: 'showVoiceroid', type: "checkOne", value: false },
    { label: 'B', code: 'info.voiceroid', type: "check", options: voiceroid, hidden: form => !form.showVoiceroid },
    { label: 'C', code: 'info.voiceroid2', type: "radio", options: voiceroid, hidden: form => !form.showVoiceroid },
    { label: '产品介绍', code: 'info.introduce', type: "textarea", options: voiceroid, hidden: form => !form.showVoiceroid },
  ]
}


export const App: React.FunctionComponent<IAppProps> = () => {
  const [state, setstate] = React.useState(0)
  const [store, getStore] = React.useState<FormStore>(null)
  return (
    <CommonForm model={props.model} storeRef={getStore}>
      
      <For index='i' each="name" of={[1,2,3]}>
        <span key={name}>{name}</span>
      </For>
      <FormGroup key={0} config={props.config}>
        <Button type="primary" icon="search">Search</Button>
        <Button onClick={() => {
          console.log(props)
          props.config[6].options = [...props.config[6].options,'qqq']
          props.config[7].options = [...props.config[7].options,'qqq']
          // voiceroid.push('aaa')
          setstate(state + 1)
        }}>增加选项</Button>
        <Button onClick={() => {
          console.log(store)
          props.config[0].rule = undefined
          props.config[2].rule = undefined
          // setstate(state+1)
        }}>移除生日校验</Button>
        <Button onClick={() => {
          store.validate()
        }}>校验</Button>
        <Button onClick={() => {
          props.model = {}
          setstate(state + 1)
        }}>表单重载</Button>
      </FormGroup>
    </CommonForm>
  );
};


export default App;