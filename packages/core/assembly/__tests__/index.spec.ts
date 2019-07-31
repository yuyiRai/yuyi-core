import { forEach } from '..';

// 外部导入的模块，

class Item {
  public a: i32
}

// @ts-ignore
@external("Modules", "getList")
declare function getList(): Array<Item>
// @ts-ignore
@external("Modules", "getList2")
declare function getList2(): Array<i32>
// @ts-ignore
@external("Modules", "getValue")
declare function getValue(i: i32): i32

// @ts-ignore
@external("Modules", "when")
declare function getWhen(): (item: Item, index: i32, arr: Array<Item>) => void

// @ts-ignore
@external("Modules", "result")
declare function result(): i32

// @ts-ignore
@external("Modules", "logger")
declare function logger(item: Item): void

// @ts-ignore
@external("Modules", "start")
declare function start(): void
// @ts-ignore
@external("Modules", "end")
declare function end(): void

const items: Array<Item> = getList()
const items2: i32[] = getList2()
const when = getWhen()
describe("JSON", (): void => {
  it('get 3', () => {
    log<string>('testtt')
    log<i32>(items[0].a)
    log<Item>(items[0])
    log<i32>(getValue(0))
    expect<i32>(items.length).toBe(1)
    expect<i32>(items2.length).toBe(1)
    // expect<i32>(items.pop().a).toBe(0)
    logger(items[0])
  })

  // it('add 1+2', () => {
  //   forEach<Item>(items, when)
  //   expect<i32>(result()).toBe(6)
  // })
});
