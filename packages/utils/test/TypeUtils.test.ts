import { EventEmitter, expect$, FilterFunction, isEmptyObject, isFunction, isNotEmptyObject, isNotEmptyValue } from '../src'
import { Constant$ } from '../src/Constransts'

/**
 * 类型判断工具测试
 */
describe('TypeUtils test', () => {
  const expectMap = new Map()
  expectMap.set({}, true)
  expectMap.set([], true)
  expectMap.set(true, true)
  expectMap.set(0, true)
  expectMap.set('', false)
  expectMap.set('N', true)
  expectMap.set(null, false)
  expectMap.set(undefined, false)
  expectMap.set(NaN, false)
  expectMap.forEach((r, v) => {
    it('isNotEmptyValue:' + JSON.stringify(v) + '=' + r, () => {
      expect(isNotEmptyValue(v)).toBe(r)
    })
  })

  // tslint:disable-next-line: no-empty
  function TestFunction() { }
  const testGroupA = [NaN, null, undefined, 1, {}, [null], [1], 1, 20, '1,2,3']
  const keys: (keyof typeof expect$)[] = Object.keys(expect$) as any
  Constant$.FOR_EACH(keys, (key) => {
    if (key !== 'filter' && key !== 'pure') {
      it(`测试 expect$.filters - ${key}`, () => {
        expect((expect$[key].filter as FilterFunction<any>)(...testGroupA)).toMatchSnapshot()
      })
    }
  })
  it('isEmpty etc.', () => {
    expect(expect$.isEmptyObject({})).toBe(true)
    expect(isEmptyObject({ test: 1 })).toBe(false)
    expect(isEmptyObject(Object.create(null))).toBe(true)
    expect(isEmptyObject(Function)).toBe(false)
    expect(isEmptyObject(TestFunction)).toBe(false)

    expect(expect$.filter.isNotEmptyObject<'string'>(...testGroupA)).toBe(undefined)
    expect(expect$.filter.isNotEmptyData<EventEmitter>(...testGroupA)).toEqual(1)
    expect(expect$.filter.isEmptyObject(...testGroupA)).toEqual({})
    expect(expect$.isNotNil.filter<string>(...testGroupA)).toEqual(NaN)
    expect(expect$.isNil.filter<string>(...testGroupA)).toEqual(null)
    expect(expect$.isEventEmitter.filter<'a'>(...testGroupA)).toBe(undefined)
    expect(expect$.isString.filter<'a'>(...testGroupA)).toBe('1,2,3')
    expect(expect$.isBoolean.filter(...testGroupA)).toBe(undefined)

    expect(expect$.isArray.filter<'str'>(...testGroupA)).toEqual([null])
    expect(expect$.isNotEmptyArray.filter(...testGroupA)).toEqual([null])
    expect(expect$.isNotEmptyArrayStrict.filter(...testGroupA)).toEqual([1])

    expect(isNotEmptyObject({})).toBe(false)
    expect(isNotEmptyObject({ test: 1 })).toBe(true)
    
  })


  it('native instanceof', () => {
    const r = TestFunction instanceof Function
    const r2 = isFunction(TestFunction)

    expect(r).toBeTruthy()
    expect(r2).toBeTruthy()
  })
})
