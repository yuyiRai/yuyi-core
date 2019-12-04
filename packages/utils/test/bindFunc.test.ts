import { Constant$ } from '../src/Constransts'

var list = [1, 2, 3, 4, 5]
var arg = [6, 7, 8]
var initLength = list.length
test('Array', () => {
  var res = [...list]
  var length = Constant$.ARR_PUSH(res, ...arg)
  expect(res).toMatchInlineSnapshot(`
    Array [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
    ]
  `)
  expect(res).not.toBe(list.concat(arg))
  expect(res).toEqual(list.concat(arg))
  expect(length).toBe(initLength + arg.length)
})

test('RegExp', () => {
  const t1 = Constant$.BindArg$$(Constant$.REGEXP_TEST, /123/)
  const t2 = Constant$.BindArg$$(Constant$.REGEXP_TEST, /123/, '123')
  expect(t1('123')).toBe(true)
  expect(t2()).toBe(true)
  expect(Constant$.REGEXP_TEST(/123/, '123')).toBe(true)
})
