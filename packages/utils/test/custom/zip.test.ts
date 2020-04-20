import { zipEmptyData, argShifter, sleep, getAge, getDay } from '../../src'

test('sleep', async () => {
  // expect(getDay().format('YYYY-MM-DD')).toEqual(getDay(0).format('YYYY-MM-DD'))
  // expect(getAge('1996-06-30')).toMatchInlineSnapshot(`23`)
  // expect(getAge('2020-06-30')).toMatchInlineSnapshot(`0`)
  // expect(getAge('2020-01-16')).toMatchInlineSnapshot(`0`)
  // expect(getAge('2020-01-30')).toMatchInlineSnapshot(`0`)
  // expect(getAge('2019-01-01')).toMatchInlineSnapshot(`1`)
  // expect(getAge('2019-01-31')).toMatchInlineSnapshot(`0`)
  // expect(getAge('2024-01-31')).toMatchInlineSnapshot(`-1`)
  // const testNow = new Date()
  // testNow.setMonth(11)
  // expect(getAge('2019-01-30', testNow)).toMatchInlineSnapshot(`1`)

  const r = await sleep(1000, true)
  expect(r).toBe(true)
  try {
    await sleep(1000, false, true)
  } catch (error) {
    expect(error).toBe(false)
  }
})

test('zip', () => {
  expect(zipEmptyData([])).toEqual([])
  expect(zipEmptyData([1, 2, 1, null])).toEqual([1, 2]);
  expect(zipEmptyData([1, 2, 1, null], true)).toEqual([1, 2]);
  expect(zipEmptyData([1, 2, 1], false)).toEqual([1, 2, 1])
  expect(zipEmptyData({ a: 1, b: 2, c: null })).toEqual({ a: 1, b: 2 })
  expect(zipEmptyData(null)).toEqual(null)
  expect(zipEmptyData(undefined)).toEqual(undefined)
  expect(zipEmptyData(1 as any)).toEqual(1)
  expect(zipEmptyData(true as any)).toEqual(true)

  const zzip = argShifter(zipEmptyData)
  expect(zzip([1, 2, null])).toEqual(undefined)
  expect(zzip(0, [1, 2, null])).toEqual([1, 2])
})
import { getPropByPath, getPropByPath2 } from '../../src'

test('zip', () => {
  expect(getPropByPath({ a: [2] }, 'a[0]')).toEqual({
    innerObj: [2],
    key: '0',
    value: 2
  })
  expect(getPropByPath2({ a: [2] }, 'a[0]')).toEqual({
    deep: 1,
    innerObj: [2],
    key: '0',
    value: 2
  })
})
