import { trackMergePipe, pipe, trackMerge, expect$ } from '../../src'

test('trackMerge', () => {
  expect(pipe.filter(1, expect$.isNil.not, expect$.isNumber)).toBe(1);
  expect(pipe.filter([], expect$.isArray, expect$.isObject)).toEqual([])
  expect(pipe.filter([], expect$.isArray, expect$.isNotEmptyArray)).toEqual(undefined)
})

const func = (a: number) => a + 1
test('trackMerge', () => {
  expect(trackMergePipe({ a: 1 }, { a: [1, 2, 3] })).toEqual({
    a: [1, 1, 2, 3]
  });
  expect(trackMerge({ a: 1 }, { a: 2 }, { extendsKeys: ["a"] })).toEqual({
    a: [1, 2]
  });
  expect(trackMerge({ a: [1, 2] }, { a: 2 }, { ignoreKeys: ["a"] })).toEqual({
    a: [1, 2]
  })
  expect(trackMergePipe({ a: func }, { a: [1, 2, 3] })).toEqual({
    a: [1, 2, 3]
  })
  expect(trackMergePipe({ a: [1, 2, 3] }, { a: func })).toEqual({
    a: func
  })
  expect(trackMergePipe({ a: [1, 2, 3] }, { a: [1, 2, 3, 5] })).toEqual({
    a: [1, 2, 3, 1, 2, 3, 5]
  })
  expect(trackMergePipe({ a: [1, 2, { b: 1 }] }, { a: [1, 2, 3, 5, { b: 2 }] })).toEqual({
    a: [1, 2, { b: 1 }, 1, 2, 3, 5, { b: 2 }]
  })
  expect(trackMergePipe({ c: [1], a: { b: 1 } }, { c: 2, a: { b: [2] } })).toEqual({
    a: { b: [1, 2] },
    c: [1, 2]
  })

});

test('trackMerge Object inner Function', () => {
  const test = trackMergePipe({ func }, { func }, { func });
  expect(test.func).toMatchInlineSnapshot(`[Function]`);
  expect(test.func(1)).toBe(4);
  expect((test.func as any).__track.length).toBe(3);
  expect(test).toMatchInlineSnapshot(`
    Object {
      "func": [Function],
    }
  `)
})

test('trackMerge stub Function', () => {
  const test = trackMergePipe(func, func, func);
  expect(test).toMatchInlineSnapshot(`[Function]`);
  expect(test(1)).toBe(4);
  expect((test as any).__track).toMatchInlineSnapshot(`
    Array [
      [Function],
      [Function],
      [Function],
    ]
  `)
})
test('trackMerge Function & Object', () => {
  const test = trackMergePipe(func, func, { func })
  expect(test(1)).toBe(3)
  expect(test).toMatchInlineSnapshot(`[Function]`)
  expect(test.func).toMatchInlineSnapshot(`[Function]`)
  expect(test.func.__track).toMatchInlineSnapshot(`undefined`)
  expect(test.func(1)).toBe(2)
})
test('trackMerge Object & Function', () => {
  const test = trackMergePipe({ func }, func, func, { func })
  expect(test(1)).toBe(3)
  expect(test).toMatchInlineSnapshot(`[Function]`)
  expect(test.func).toMatchInlineSnapshot(`[Function]`)
  expect(test.func.__track).toMatchInlineSnapshot(`
    Array [
      [Function],
      [Function],
    ]
  `)
  expect(test.func(1)).toBe(3)
})
