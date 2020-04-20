import { reduceMap, filterKeys } from "../../src";

test('reduceMap', () => {
  expect(reduceMap([
    1, 2, 3
  ], i => {
      return { [i]: i }
  })).toEqual({
    1: 1,
    2: 2,
    3: 3
  })
})

test('filterMap', () => {
  expect(filterKeys({
    a: 1,
    b: 2
  }, (k, v) => k !== 'a')).toEqual(['b']);
  expect(filterKeys({
    a: 1,
    b: 2
  }, (k, v) => v !== 2)).toEqual(['a'])
})
