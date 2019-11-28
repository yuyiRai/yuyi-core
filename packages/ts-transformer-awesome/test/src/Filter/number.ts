import '../../../env'

const Utils = {
  a: filters,
  b: 1,
  c() {
    return Utils.a
  },
  get dc() {
    return filters
  }
}
Utils.a = filters

const a = 1
const key = tsKeys<typeof Utils>()
console.log(
  Utils.a<() => void>(null)
)
console.log(
  filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6)
)
export function test(a: any, b: any[]) {
  function test() {
    const d = Utils.dc<number>(a, ...b, '3', 2)
    return d;
  }
  return filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6) && test()
}
