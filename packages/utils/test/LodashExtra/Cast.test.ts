import { castFunction, castArray, castComputed, castString } from '../../src'

test('castArray', () => {
  expect([
    castArray(null),
    castArray([undefined, null]),
    castArray(null, false),
    castArray([undefined, null], false),
    castArray([undefined, null, ''], false),
    castArray([undefined, null, ''], 'strict')
  ]).toEqual([[null], [undefined, null], [], [], [''], []])
})

test('castComputed', () => {
  expect([
    castComputed((a: number, b: number, c: number): number => a + b + c, 1, 2, 3),
    castComputed(a => a),
    castComputed(1),
    castComputed(1, 2, 3)
  ]).toEqual([6, undefined, 1, 1])
})

test('castFunction', () => {
  const tmpFunction = () => undefined
  expect(castFunction(tmpFunction)).toBe(tmpFunction)
  expect(castFunction(tmpFunction, true)).not.toBe(tmpFunction)
  const tmp = {}
  expect(castFunction(tmp)()).toBe(tmp)
  expect(castFunction(tmp, true)()).not.toBe(tmp)
})

test('castString', () => {
  expect(castString([1, 2, 3])).toMatchInlineSnapshot(`"1,2,3"`)
  expect(castString(-2)).toBe('-2')
  expect(castString('')).toBe('')
})
