import { pipe, pipeFilter, pipeTrack, expect$ } from '../../src';

test('pipe function', () => {
  expect(pipe(-1.1, Math.abs, Math.ceil)).toBe(2);
  expect(pipeTrack(-1.1, Math.abs, Math.ceil)).toEqual([-1.1, 1.1, 2]);

  expect(pipeFilter(1, v => !expect$.isNil(v), expect$.isNumber)).toBe(1);
  expect(pipeFilter(null, v => !expect$.isNil(v), expect$.isNumber)).toBe(undefined);
  expect(pipeFilter(1, expect$.isNil.not, expect$.isNumber)).toBe(1);
  expect(pipeFilter([], expect$.isArray, expect$.isObject)).toEqual([]);
  expect(pipeFilter([], expect$.isArray, expect$.isNotEmptyArray)).toEqual(undefined)
})
