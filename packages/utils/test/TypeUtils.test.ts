import { isNotEmptyValue, isFunction } from '../src'


/**
 * 类型判断工具测试
 */
describe("TypeUtils test", () => {
  const expectMap = new Map()
  expectMap.set({}, true)
  expectMap.set([], true)
  expectMap.set(true, true)
  expectMap.set(0, true)
  expectMap.set("", false)
  expectMap.set("N", true)
  expectMap.set(null, false)
  expectMap.set(undefined, false)
  expectMap.set(NaN, false)
  expectMap.forEach((r, v) => {
    it("isNotEmptyValue:" + JSON.stringify(v) + "=" + r, () => {
      expect(isNotEmptyValue(v)).toBe(r);
    })
  })


  // tslint:disable-next-line: no-empty
  function TestFunction() { }
  it("native instanceof", () => {
    const r = TestFunction instanceof Function
    const r2 = isFunction(TestFunction)

    expect(r).toBeTruthy()
    expect(r2).toBeTruthy()

  })
})
