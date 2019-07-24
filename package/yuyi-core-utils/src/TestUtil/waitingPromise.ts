/**
 * @module TestUtils
 */

export function waitingPromise<V = any>(time: number, emitValue?: any, isError = false): Promise<V> {
  return new Promise((resolve, reject) => {
    setTimeout(isError ? reject : resolve, time, emitValue);
  });
}
