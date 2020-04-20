/**
 * 测试工具方法集合
 * @packageDocumentation
 */

export * from './BenchmarkUtils'

/* istanbul ignore next */
export function getTestArray(length: number) {
  const arr = []
  for (let i = length; i > 0; i--) {
    arr[i - 1] = i
  }
  return arr
}
