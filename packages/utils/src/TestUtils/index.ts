/**
 * 测试工具方法集合
 * @packageDocumentation
 */

export * from './waitingPromise'
export * from './BenchmarkUtils'

export function getTestArray(length: number) {
  const arr = []
  for (let i = length; i > 0; i--) {
    arr[i - 1] = i
  }
  return arr
}
