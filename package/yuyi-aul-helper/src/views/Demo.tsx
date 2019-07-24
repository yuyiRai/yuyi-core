import { Button } from 'antd';
import { action, observable } from 'mobx';
import * as React from 'react';
import { AMapService, CommonForm, ConfigrationalForm, PageContainer, useRefCallback, useSafeStoreProvider, useUnmount, Utils, useMountHooks, useForceUpdate } from 'yuyi-core-night';

export { PageContainer };

AMapService.setKey("70a802cd733e9a9a96bedd0ae23f19a2")
const voiceroid = ['1', '2', '3', '4', '5']
// const voiceroid = ['yukari','maki','zunko','akane','aoi']
const options = [
  { label: 'A', value: 'a', code: 'AAA' },
  { label: 'B', value: 'b', code: 'AAA' },
  { label: 'C', value: 'c', code: 'AAA' },
  { label: 'C1', value: 'c1', code: 'AAA' },
  { label: 'A1', value: 'a1', code: 'AAA' },
  { label: 'B1', value: 'b1', code: 'AAA' }
]
const treeOptions = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
      code: 752100,
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
      code: 453400,
    }],
  }],
}]
const model = {
  name: 'yuyi',
  password: '123456', search2: 'a,b', search: 'b',
  info: {
    birthday: '1996-06-30',
    voiceroid: [...voiceroid],
    trree: 'zhejiang,hangzhou,xihu'
  },
  addressGroup: {
    address: '上海市'
  },
  info2: {
    trree: "xihu"
  },
  showVoiceroid: '1'
}
const amap = new AMapService()
const config = [
  { label: '姓名', code: 'username', useLabel: false, required: form => form.showVoiceroid !== '1', rule: 'commonCode' },
  { label: '密码', code: 'password' },
  { label: '生日', code: 'info.birthday', value: new Date(), type: "date", rule: 'futureDate' },
  {
    label: '年龄', code: 'info.birthday2', type: "number", computed(form) {
      return new Date(form.info.birthday).getFullYear() + form.password
    }
  },
  {
    label: '提交时间', code: 'info.submitTime', type: "dateToDate", rule: 'dateToDate30', disabled: (form, itemConfig) => {
      // console.log(form, itemConfig);
      return form.showVoiceroid !== '1'
    }
  },
  { label: 'A', code: 'showVoiceroid', type: "checkOne", value: '1' },
  { label: '单选', code: 'search', type: "search", allowInput: true, options, nameCode: 'searchName' },
  {
    label: '多选', code: 'search2', type: "search", nameCode: 'search2Name', multiple: true,
    getOptionsLabel({ item }) {
      return `${item.name} ${
        [item.address].join("/") ? `(${[item.address].join("/")})` : ""
        }`;
    },
    async remoteMethod(key) {
      if (key) {
        console.log(key)
        try {
          const locationData = await amap.getAutoComplete({ city: '全国', search: key })
          return locationData.filter(item => item.location).map(locationData => {
            const { name, id, district } = locationData
            return {
              label: name,
              value: `${name}(${district})`,
              key: id,
              item: locationData
            }
          })
        } catch (e) {
          return []
        }
      }
      return []
    }
  },
  {
    label: '地址', code: 'addressGroup', type: 'group', col: 1, children: {
      trree3: {
        col: 1,
        label: '产品c2', code: 'trree3', transformer: 'path', type: "cascader", loadData: (key, currentOptions) => {
          // console.log('loadData', key, currentOptions)
          return Utils.waitingPromise(100, key ? options.map(opt => ({ ...opt, value: [key.value, opt.value].join('.') })) : options)
        }
      },
      address: {
        col: 2,
        label: '地址查询', code: 'address', type: "search", nameCode: 'addressName',
        async remoteMethod(key) {
          if (key) {
            try {
              const locationData = await amap.getAutoComplete({ city: '全国', search: key })
              return locationData.filter(item => item.location).map(locationData => {
                const { name } = locationData
                return {
                  label: name,
                  value: name,
                  item: locationData
                }
              })
            } catch (e) {
              return []
            }
          }
          return []
        }
      }
    }
  },
  { label: 'B', code: 'info.voiceroid', type: "check", options: voiceroid, hidden: form => form.showVoiceroid !== '1' },
  { label: 'C', code: 'info.voiceroid2', type: "radio", options: voiceroid, hidden: form => form.showVoiceroid !== '1' },
  // { label: '产品介绍', code: 'info.introduce', type: "textarea", options: voiceroid, hidden: form => form.showVoiceroid !== '1' },
  {
    label: '产品c', code: 'info.trree', transformer: 'path', type: "cascader", loadData: (key, currentOptions) => {
      // console.log('loadData', key, currentOptions)
      return Utils.waitingPromise(100, key ? options.map(opt => ({ ...opt, value: [key.value, opt.value].join('.') })) : options)
    }
  },
  {
    label: '产品c2', code: 'info2.trree', type: "selectTree", loadData: (key, currentOptions) => {
      // console.log('loadData', key, options)
      return Utils.waitingPromise(100, key ? treeOptions.map(opt => ({ ...opt, value: [key.value, opt.value].join('.') })) : treeOptions)
    }
  }
]


const props: any = {
  model,
  config
}
export class BBBBB {
  @observable.ref name = 'bbb2'
  @action.bound update() {
    this.name += 'b'
  }
}

function useState(init?: Function) {
  const ref = React.useRef(null)
  if (!ref.current) {
    ref.current = init ? init() : null;
  }
  const forceUpdate = useForceUpdate()
  useUnmount(() => {
    ref.current = null
  }, [ref])
  const setState = React.useCallback((v) => {
    if (ref.current !== v) {
      forceUpdate()
    }
    ref.current = v
  }, [ref])
  return [ref.current, setState]
}

export const B: React.FunctionComponent<{ getCurrent: any, getStore: any }> = ({ getCurrent: storeRef, getStore }) => {
  const store = useState(() => new BBBBB())
  const [{ useCallback, useComputedChild }] = useSafeStoreProvider(() => new BBBBB(), null, { storeRef })
  const onClick = useCallback((ref) => ref.update())
  useMountHooks(() => {
    getStore(store[0])
    return () => {
      getStore(null)
    }
  }, [store])
  return (
    <div>
      {useComputedChild((store) => <span>{store.name}</span>)}
      <Button onClick={onClick}>update</Button>
    </div>
  )
}

export const EnabledPanel: React.FunctionComponent = ({ children }) => {
  const [enabled, setEnabled] = React.useState(true)
  const todo = React.useCallback(() => {
    setEnabled(value => !value)
  }, [])
  React.useLayoutEffect(() => () => {
    setEnabled(false)
  }, [])
  return (
    <div>
      <Button onClick={todo}>{enabled ? '停用' : '启用'}</Button>
      <div>
        {enabled && children}
      </div>
    </div>
  )
}

export const A = () => {
  const storeRef = React.useRef()
  const forceUpdate = useForceUpdate()
  const getStore = React.useCallback((v) => {
    if (storeRef.current !== v) {
      forceUpdate()
    }
    storeRef.current = v
  }, [storeRef])
  const store = storeRef.current as any
  const [current, getCurrent, useCallback] = useRefCallback()
  // console.error(current);
  const click = useCallback((ref) => {
    console.error(ref)
  })

  return (
    <span>
      {store && store.name}
      <Button onClick={click}>view</Button>
      <B getCurrent={getCurrent} getStore={getStore}></B>
    </span>
  )
}
export const App = () => {
  // const [enabled, setEnabled] = React.useState(true)
  const [model, setModel] = React.useState({ ...props.model })
  const [config, setConfig] = React.useState([...props.config])
  const [store, setStore] = React.useState(null)
  const storeRef = React.useRef(null)
  const getStore = React.useCallback(({ formStore }) => {
    storeRef.current = formStore
    // console.error('callback');
    setStore(formStore)
  }, [store])
  useUnmount(() => {
    storeRef.current = null
    // console.error('demo destory', storeRef.current);
    setStore(null)
  }, [setStore, store])
  return (
    <span>
      <EnabledPanel>
        <A />
      </EnabledPanel>
      <EnabledPanel>
        <CommonForm model={model} storeRef={getStore}>
          <ConfigrationalForm key={0} config={config} disabled={true}>
            <Button type="primary" icon="search">Search</Button>
            <Button onClick={() => {
              console.log(model, config)
              // debugger
              config[9].options = [...config[9].options, 'qqq']
              config[10].options = [...config[10].options, 'qqq']
              // voiceroid.push('aaa')
              setConfig([...config])
            }}>增加选项</Button>
            <Button onClick={() => {
              console.log(store)
              config[0].rule = undefined
              config[2].rule = undefined
              setConfig([...config])
              // setstate(state+1)
            }}>移除生日校验</Button>
            <Button onClick={() => {
              console.log(store, props)
              store.validate()
              console.log(store.formSource, model)
            }}>校验</Button>
            <Button onClick={() => {
              setModel({})
            }}>表单重载</Button>
          </ConfigrationalForm>
        </CommonForm>
      </EnabledPanel>
    </span>
  );
};


export default App;