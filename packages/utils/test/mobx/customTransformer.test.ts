import { autorun, createTransformer, observable } from '../../src'

console.info = () => { }
/*
  store 保存了我们的领域对象: boxes 和 arrows
*/
const store = observable({
  boxes: [],
  arrows: [],
  selection: null
})
type Store = typeof store

/**
    每次更改会把 store 序列化成 json 并将其添加到状态列表中
  */
const states: ReturnType<typeof serializeState>[] = []

const serializeState = createTransformer((store: Store) => ({
  boxes: store.boxes.map(serializeBox),
  arrows: store.arrows.map(serializeArrow),
  selection: store.selection ? store.selection.id : null
}))

const serializeBox = createTransformer((box: any) => ({ ...box }))

const serializeArrow = createTransformer((arrow: any) => ({
  id: arrow.id,
  to: arrow.to.id,
  from: arrow.from.id
}))

autorun(() => {
  states.push(serializeState(store))
})


describe('simple test', () => {
  it('不可变视图', async () => {
    store.boxes.push({ a: 1 })
    store.boxes.push({ b: 2 }, { c: 3 })
    expect(states[1].boxes[0]).toBe(states[2].boxes[0])
    return
  })
})
