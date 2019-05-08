import * as React from 'react';
import { CommonForm } from './CommonForm';
import { FormGroup } from './Form';
import Button from 'antd/lib/button';
import { FormStore } from './FormStore';
import { Icon } from 'antd';
import { IFormItemConstructor } from './Interface';
// import { ajax } from 'rxjs/ajax'

interface IAppProps {
}
const voiceroid = ['1', '2', '3', '4', '5']
// const voiceroid = ['yukari','maki','zunko','akane','aoi']
const options = [{label: 'A', value: 'a'}, {label: 'B', value: 'b'}, {label: 'C1', value: 'c1'},{label: 'A1', value: 'a1'}, {label: 'B1', value: 'b1'}, {label: 'C', value: 'c'}]
const model = {
  name: 'yuyi',
  password: '123456', search2: 'a,b', search: 'd',
  info: {
    birthday: '1996-06-30',
    voiceroid: [...voiceroid]
  },
  showVoiceroid: '0'
}
const config: IFormItemConstructor<typeof model>[] = [
  { label: '姓名', code: 'name', suffix: <Icon type='plus' />, required: form => form.showVoiceroid !== '1', rule: 'commonCode' },
  { label: '密码', code: 'password' },
  { label: '生日', code: 'info.birthday', value: new Date(), type: "date", rule: 'futureDate' },
  { label: '年龄', code: 'info.birthday2', type: "number" },
  {
    label: '提交时间', code: 'info.submitTime', type: "dateToDate", rule: 'dateToDate30', disabled: (form, itemConfig) => {
      // console.log(form, itemConfig);
      return form.showVoiceroid !== '1'
    }
  },
  { label: 'A', code: 'showVoiceroid', type: "checkOne", value: '0' },
  { label: '单选', code: 'search', type: "search", options, nameCode: 'searchName' },
  { label: '多选', code: 'search2', type: "search", nameCode: 'search2Name', multiple: true, remoteMethod(key: string) {
    return Utils.waitingPromise(1000, Utils.getCodeListByKey(options)(key))
  } },
  { label: 'B', code: 'info.voiceroid', type: "check", options: voiceroid, hidden: form => form.showVoiceroid !== '1' },
  { label: 'C', code: 'info.voiceroid2', type: "radio", options: voiceroid, hidden: form => form.showVoiceroid !== '1' },
  { label: '产品介绍', code: 'info.introduce', type: "textarea", options: voiceroid, hidden: form => form.showVoiceroid !== '1' },
]
const props: any = {
  model,
  config
}


export const App: React.FunctionComponent<IAppProps> = () => {
  const [state, setstate] = React.useState(0)
  const [store, getStore] = React.useState<FormStore>(null)
  return (
    <CommonForm model={props.model} storeRef={getStore}>s
      <For index='i' each="name" of={[1,2,3]}>
        <span key={name}>{name}</span>
      </For>
      <FormGroup key={0} config={props.config}>
        <Button type="primary" icon="search">Search</Button>
        <Button onClick={() => {
          console.log(props, config)
          // debugger
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