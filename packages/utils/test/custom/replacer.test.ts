import { shiftKeyGroup } from '../../src'
import { shiftKeyTo, ShiftMode } from '../../src/CustomUtils/changeKeys'
// tslint:disable-next-line: no-eval
const testObj = eval(require('./test.json'))

const autotestObj = { a1: 2, a2: 4, a3: 6 }

describe('changeObjectKey', () => {
  it('shift key', () => {
    const shiftTest = { a: true, b: 1, c: '2' }
    expect(shiftKeyTo(shiftTest, 'a', 'b')).toEqual({ a: 1, b: true, c: '2' })
    expect(shiftKeyTo(shiftTest, 'a', 'b', ShiftMode.Auto)).toEqual({ a: 1, b: true, c: '2' })
    expect(shiftKeyTo(shiftTest, 'a', 'b', ShiftMode.Copy)).toEqual({ a: true, b: true, c: '2' })

    const r = shiftKeyTo.cut(shiftTest, 'a', 'b')
    expect(shiftKeyTo(shiftTest, 'a', 'b', ShiftMode.Cut)).toEqual(r)
    expect(shiftKeyTo(shiftTest, 'a', 'b', ShiftMode.Cut)).not.toBe(r)
    // @ts-ignore
    expect(r.a).toBe(undefined)
    expect(r.b).toBe(true)
    expect(r).toEqual({ b: true, c: '2' })
  })

  const testMap1 = { a1: 'a2' }
  for (const [key, title, result] of [
    [ShiftMode.Auto, 'auto模式会自动交换字段', { a1: 4, a2: 2, a3: 6 }],
    [undefined, '不设（同auto）', { a1: 4, a2: 2, a3: 6 }],
    [ShiftMode.Cut, '剪切模式，移动后删除原字段', { a2: 2, a3: 6 }],
    [ShiftMode.Copy, '复制模式，会保留原字段', { a1: 2, a2: 2, a3: 6 }]
  ]) {
    it('use replacer ' + title, () => {
      const r = shiftKeyGroup(autotestObj, testMap1, key as any)
      expect(r).not.toBe(autotestObj)
      const tmp = expect(r)
      result ? tmp.toEqual(result) : tmp.toMatchSnapshot();
    })
  }
  const testMap2 = { a1: 'a3', a2: 'a1', a3: 'a2' }
  const testMapResult = { a1: 4, a2: 6, a3: 2 }
  for (const [key, title] of [
    [ShiftMode.Auto, 'auto模式也会完全按照控制'],
    [ShiftMode.Cut, '删除模式也会完全按照控制'],
    [ShiftMode.Copy, '保留模式也会完全按照控制']
  ]) {
    it('use replacer ' + title, () => {
      expect(shiftKeyGroup(autotestObj, testMap2, key as any)).toEqual(testMapResult);
    })
  }

  it('use replacer', () => {
    const r = shiftKeyGroup(
      testObj,
      {
        '3': 7,
        '4': 5,
        '5': 6,
        '6': 3,
        '7': 4
      },
      (key, map) => {
        if (/CUST_[0-9]/.test(key)) {
          const [, num] = key.match(/CUST_([0-9])/) || []
          if (map[num]) {
            return key.replace(/CUST_([0-9])/, 'CUST_' + map[num])
          }
        }
        return null
      }
    )
    expect(r).toMatchSnapshot()
  })
})
