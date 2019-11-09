import '../../../env'

const a = 1
console.log(
  filters<() => void>(null)
)
console.log(
  filters<number>(a, '3', 2)
)
console.log(
  filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6)
)