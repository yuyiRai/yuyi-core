import * as OptionsUtils from '../src/OptionsUtils'

const optionsList = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
  { label: 'D', value: 'd' },
  { label: 'E', value: 'e' }
]

/**
 * Dummy test
 */
describe('OptionsUtils test', () => {
  it('works if getOptionsByLabel is Function', () => {
    expect(OptionsUtils.getOptionsByLabel).toBeInstanceOf(Function)
  })
  it('works if getOptionsByLabel is Function', () => {
    expect(OptionsUtils.convertValueOption([1, 2, 3, 4, 5])).toMatchInlineSnapshot(`
                  Array [
                    Object {
                      "value": "1",
                    },
                    Object {
                      "value": "2",
                    },
                    Object {
                      "value": "3",
                    },
                    Object {
                      "value": "4",
                    },
                    Object {
                      "value": "5",
                    },
                  ]
            `)
  })

  it('OptionsUtils getOptionsByLabel', () => {
    const findList = OptionsUtils.getOptionsByLabel(optionsList, 'A')
    const findOne = OptionsUtils.getOptionsByLabel(optionsList, 'A', true)
    expect(findList).toBeInstanceOf(Array)
    expect(findList.length).toBe(1)
    expect(findOne).toBeInstanceOf(Object)
    expect(findList[0]).toBe(findOne)
  })
})

describe('Nested-object', () => {
  var testObject = {
    a: {
      a: 2,
      b: {
        a: 1
      },
      c: {
        a: 2,
        d: 4
      }
    },
    b: {
      c: {
        d: 1
      }
    }
  }
  const testPath = [
    'a.cz', // !invalid
    'a.b.a', // * valid
    'a.b.c', // !invalid
    'b.c', // * valid
    'b.c.d' // * valid
  ]
  expect(OptionsUtils.getValuePath(testObject)).toMatchInlineSnapshot(`
    Array [
      "a.a",
      "a.b.a",
      "a.c.a",
      "a.c.d",
      "b.c.d",
    ]
  `)
  expect(OptionsUtils.getValuePath(testObject, testPath)).toMatchInlineSnapshot(`
        Array [
          "a.b.a",
          "b.c",
        ]
    `)
  expect(OptionsUtils.getValueAndPath(testObject, testPath)).toMatchInlineSnapshot(`
        Array [
          Array [
            "a.b.a",
            1,
          ],
          Array [
            "b.c",
            Object {
              "d": 1,
            },
          ],
        ]
    `)
  expect(OptionsUtils.getValueAndPath(testObject)).toMatchInlineSnapshot(`
        Array [
          Array [
            "a.a",
            2,
          ],
          Array [
            "a.b.a",
            1,
          ],
          Array [
            "a.c.a",
            2,
          ],
          Array [
            "a.c.d",
            4,
          ],
          Array [
            "b.c.d",
            1,
          ],
        ]
    `)
})
