import { isNumber, isNum, trackMerge } from '../../src'
import { merge } from 'lodash'
// const suite = new Benchmark.Suite;

test('tttt', () => {
  expect(trackMerge({ a: [1, 2, 3] }, { a: [1, 2, 3] })).toEqual({
    a: [1, 2, 3, 1, 2, 3]
  })
  expect(merge({ a: [1, 2, 3] }, { a: [1, 2, 3] })).toEqual({
    a: [1, 2, 3]
  })
})

function getExpectMap(allowNaN = false) {
  return new Map<any, any>([
    [{}, false],
    [[], false],
    [true, false],
    [false, false],
    ["", false],
    [0, true],
    [NaN, allowNaN],
    [undefined, false],
    [null, false],
    [Number(0), true],
  ])
}

export const A = getExpectMap()
export const B = getExpectMap(true)


describe("isNumber Auto Test", () => {
  A.forEach((r, v) => {
    it("isNumber Strict" + JSON.stringify(v) + "=" + r, () => {
      expect(isNumber(v)).toBe(r);
    })
  })
  B.forEach((r, v) => {
    it("isNumber" + JSON.stringify(v) + "=" + r, () => {
      expect(isNumber(v, true)).toBe(r);
    })
  })
})
describe("isNumber Auto Test", () => {
  A.forEach((r, v) => {
    it("isNumber Strict" + JSON.stringify(v) + "=" + r, () => {
      expect(isNum(v)).toBe(r);
    })
  })
  B.forEach((r, v) => {
    it("isNumber" + JSON.stringify(v) + "=" + r, () => {
      expect(isNum(v, true)).toBe(r);
    })
  })
})

