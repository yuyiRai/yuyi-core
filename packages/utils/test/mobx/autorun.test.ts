import { get } from 'lodash'
import { AutoRunClass } from '../../src'

describe('mobx autorun 1', () => {
  const context = new AutoRunClass()
  let result: any = undefined
  let times = 0

  const callbackfn = jest.fn(form => {
    result = form && form.b
    console.log('current', result)
  })

  it('初始化自动触发一次', () => {
    context.nextData({ a: { z: 1 }, b: 2 })
    context.autorun(callbackfn)
    expect(callbackfn).toBeCalledTimes(++times)
    expect(result).toBe(2)
  })

  it('由于值没有更新，不会继续触发', () => {
    context.nextData({ a: { z: 2 }, b: 2 })
    expect(callbackfn).toBeCalledTimes(times)
    expect(result).toBe(2)
  })

  it('由于值没有更新，不会继续触发', () => {
    context.nextData({ a: { z: 2 }, b: 2 })
    expect(callbackfn).toBeCalledTimes(times)
    expect(result).toBe(2)
  })

  var tmp: any;
  it('新增字段会触发同级', () => {
    context.nextData({ a: { z: 3 }, b: 2, c: { d: 1 } })
    expect(callbackfn).toBeCalledTimes(++times)
    expect(result).toBe(2)
    tmp = context.pureData
  })

  it('这里不会触发', () => {
    context.nextData({ a: { z: 3 }, b: 3, c: { d: 1 } })
    expect(callbackfn).toBeCalledTimes(++times)
    expect(result).toBe(3)
    expect(context.pureData.a).toBe(tmp.a)
    expect(context.pureData.c).toBe(tmp.c)
  })

  it('看看结果', () => {
    expect(context.getTrack(1).a).toBe(context.getTrack().a)
    expect(context.getTrack(1).c).toBe(context.getTrack().c)
    expect(context.getTrack(2).a).not.toBe(context.getTrack(1).a)
    expect(context.serializeTrack()).toMatchInlineSnapshot(`
      Array [
        Object {
          "a": Object {
            "z": 1,
          },
          "b": 2,
        },
        Object {
          "a": Object {
            "z": 2,
          },
          "b": 2,
        },
        Object {
          "a": Object {
            "z": 3,
          },
          "b": 2,
          "c": Object {
            "d": 1,
          },
        },
        Object {
          "a": Object {
            "z": 3,
          },
          "b": 3,
          "c": Object {
            "d": 1,
          },
        },
      ]
    `)
  })
})

describe('mobx autorun 2', () => {
  const context = new AutoRunClass()
  let result = { A: undefined, B: undefined, C: undefined }
  let a_times = 0,
    b_times = 0,
    c_times = 0
  const callbackfnA = jest.fn(a => {
    result.A = a
    console.log('form.a update', result.A)
  })
  const callbackfnB = jest.fn(form => {
    result.B = form && form.b
    console.log('form.b update', result.B)
  })
  const callbackfnC = jest.fn(form => {
    result.C = get(form, 'c.d.e') || undefined
    console.log('form.c.d.e update', result.C)
  })
  it('初始化，AB自动触发一次', () => {
    context.nextData({ a: 1, b: 2 })
    context.reaction(form => form && form.a, callbackfnA)
    context.autorun(callbackfnB)
    context.autorun(callbackfnC)
    expect(callbackfnA).toBeCalledTimes(a_times)
    expect(callbackfnB).toBeCalledTimes(++b_times)
    expect(callbackfnC).toBeCalledTimes(++c_times)
    expect(result.A).toBe(undefined)
    expect(result.B).toBe(2)
    expect(result.C).toBe(undefined)
  })

  it('由于值没有更新，BC不会继续触发', () => {
    context.nextData({ a: 2, b: 2 })
    expect(callbackfnA).toBeCalledTimes(++a_times)
    expect(callbackfnB).toBeCalledTimes(b_times)
    expect(callbackfnC).toBeCalledTimes(c_times)
    expect(result.A).toBe(2)
    expect(result.B).toBe(2)
    expect(result.C).toBe(undefined)
  })

  it('这里A不会触发', () => {
    context.nextData({ a: 2, b: 2, c: { d: {} } })
    // 新增字段，除了reaction的结果没有变化的情况以外也会触发一次
    expect(callbackfnA).toBeCalledTimes(a_times)
    expect(callbackfnB).toBeCalledTimes(++b_times)
    expect(callbackfnC).toBeCalledTimes(++c_times)
    expect(result.A).toBe(2)
    expect(result.B).toBe(2)
    expect(result.C).toBe(undefined)
  })

  it('这里B不会触发', () => {
    context.nextData({ a: 1, b: 2, c: { d: { e: 1 } } })
    expect(callbackfnA).toBeCalledTimes(++a_times)
    expect(callbackfnB).toBeCalledTimes(b_times)
    expect(callbackfnC).toBeCalledTimes(++c_times)
    expect(result.A).toBe(1)
    expect(result.B).toBe(2)
    expect(result.C).toBe(1)
  })

  it('这里C不会触发', () => {
    context.nextData({ a: 2, b: 4, c: { d: { e: 1 } } })
    expect(callbackfnA).toBeCalledTimes(++a_times)
    expect(callbackfnB).toBeCalledTimes(++b_times)
    expect(callbackfnC).toBeCalledTimes(c_times)
    expect(result.A).toBe(2)
    expect(result.B).toBe(4)
    expect(result.C).toBe(1)
  })

  it('这里只有C会触发', () => {
    context.nextData({ a: 2, b: 4, c: { d: { e: 2 } } })
    expect(callbackfnA).toBeCalledTimes(a_times)
    expect(callbackfnB).toBeCalledTimes(b_times)
    expect(callbackfnC).toBeCalledTimes(++c_times)
    expect(result.A).toBe(2)
    expect(result.B).toBe(4)
    expect(result.C).toBe(2)
  })
})
