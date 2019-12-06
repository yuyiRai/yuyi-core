import { zipEmptyData, argShifter } from "../..";

test('zip', () => {
  expect(zipEmptyData([])).toEqual([])
  expect(zipEmptyData([1, 2, null])).toEqual([1, 2])
  expect(zipEmptyData({ a: 1, b: 2, c: null })).toEqual({ a: 1, b: 2 })
  expect(zipEmptyData(null)).toEqual(null)
  expect(zipEmptyData(undefined)).toEqual(undefined)
  expect(zipEmptyData(1 as any)).toEqual(1)
  expect(zipEmptyData(true as any)).toEqual(true)

  const zzip = argShifter(zipEmptyData)
  expect(zzip([1, 2, null])).toEqual(undefined)
  expect(zzip(0, [1, 2, null])).toEqual([1, 2])
})
