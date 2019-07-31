import { isNotEmptyValue } from '../src'

/**
 * Dummy test
 */
describe("TypeUtils test", () => {
  const expectMap = new Map()
  expectMap.set({}, true)
  expectMap.set([], true)
  expectMap.set(true, true)
  expectMap.set(0, true)
  expectMap.set("", false)
  expectMap.set(null, false)
  expectMap.set(undefined, false)
  expectMap.set(NaN, false)
  expectMap.forEach((r, v) => {
    it("isNotEmptyValue:" + JSON.stringify(v) + "=" + r, () => {
      expect(isNotEmptyValue(v)).toBe(r);
    })
  })

})
