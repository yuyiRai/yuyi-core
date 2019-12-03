import { Constant$ } from '../src/Constransts'

var list = [1, 2, 3, 4, 5]
var initLength = list.length
test('Array', () => {
  var length = Constant$.ARR_PUSH(list, 6, 7, 8)
  expect(list).toMatchInlineSnapshot(`
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
  expect(length).toBe(initLength + 3)
})
