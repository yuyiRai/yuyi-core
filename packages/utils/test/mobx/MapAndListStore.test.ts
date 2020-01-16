// import { toJS } from 'mobx'
// import {  } from 'mobx-utils'
import { IKeyData, IMapTransformer, observable, reaction, RecordMapStore, toJS } from '../..'

console.info = () => { }

var testData = [
  {
    source: [{ code: 'name' }, { code: 'password' }],
    target: {
      name: { code: 'name' },
      password: { code: 'password' }
    }
  }
]
function test(
  testData: { source: IKeyData<'code'>[]; target: IKeyValueMap<IKeyData<'code'>> },
  transformer: IMapTransformer<'code', IKeyData<'code'>, IKeyData<'code'>>
) {
  
  describe('simple test', () => {
    let map = new RecordMapStore<'code', IKeyData<'code'>, IKeyData<'code'>>('code', transformer)
    let initData = map.sourceData
    let view = observable({
      get name() {
        return map.targetData.name
      },
      get pwd() {
        return map.targetData.password
      }
    })
    let { source: sourceData, target: targetData } = testData
    let onNameChange, onPasswordChange, keysChange, sourceValuesChange
    reaction(
      () => view.name,
      obj => onNameChange(obj)
    )
    reaction(
      () => view.pwd,
      obj => onPasswordChange(obj)
    )
    reaction(
      () => map.keyList,
      obj => keysChange(obj)
    )
    reaction(
      () => map.valueList,
      obj => sourceValuesChange(obj)
    )
    beforeEach(() => {
      onNameChange = jest.fn(obj => console.log('onNameChange', obj))
      onPasswordChange = jest.fn(obj => console.log('onPasswordChange', obj))
      keysChange = jest.fn(obj => console.log('keysChange', obj))
      sourceValuesChange = jest.fn(obj => console.log('sourceValuesChange', obj))
    })
    it('init data', async () => {
      expect(initData).toEqual({})
      map.setSourceData(sourceData)
      expect(initData).not.toBe(map.sourceData)
      expect(view).toEqual({})
      expect(view.name).toBe(map.targetData.name)
      expect(toJS(view)).toMatchInlineSnapshot(`Object {}`)
      expect(view.name).not.toBe(targetData.name)
      expect(map.targetData).toEqual(targetData)
      expect(onNameChange).toBeCalledTimes(1)
      expect(onPasswordChange).toBeCalledTimes(1)
      expect(keysChange).toBeCalledTimes(1)
      expect(sourceValuesChange).toBeCalledTimes(1)
      return
    })
    it('init equals to last data', async () => {
      initData = map.targetData
      map.setSourceData(sourceData)
      expect(initData).toEqual(targetData)
      expect(initData).toBe(map.targetData)
      expect(initData).toEqual(targetData)
      expect(onNameChange).toBeCalledTimes(0)
      expect(onPasswordChange).toBeCalledTimes(0)
      expect(keysChange).toBeCalledTimes(0)
      expect(sourceValuesChange).toBeCalledTimes(0)
      return
    })
    it('删除code为password的记录', async () => {
      map.setSourceData([{ code: 'name' }])
      expect(initData).not.toBe(map.sourceData)
      expect(onNameChange).toBeCalledTimes(0)
      expect(onPasswordChange).toBeCalledTimes(1)
      expect(keysChange).toBeCalledTimes(1)
      expect(sourceValuesChange).toBeCalledTimes(1)
      return
    })

  })
}
test(testData[0], {
  create(source) {
    return { code: source.code }
  },
  update({ code }, target) {
    return {
      ...target,
      codeName: code
    }
  },
  delete(target, source) {
    console.log(target, source)
  }
})

// test({
//   create(source: IFormItemConstructor) {
//     return new ItemConfig(source, {});
//   },
//   update(source, target) {;
//     return target.setConfig(source);
//   },
//   delete(target, source) {
//     console.info(target, source);
//   }
// } as IMapTransformer<'code', IFormItemConstructor, ItemConfig>)
