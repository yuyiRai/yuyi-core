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
