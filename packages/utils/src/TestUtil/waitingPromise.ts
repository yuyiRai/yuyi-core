/**
 * {@inheritDoc sleep}
 * @deprecated 该方法迟早被弃用，使用 {@link sleep | sleep()} 代替
 */
export function waitingPromise<V = any>(time: number, emitValue?: any, isError = false): Promise<V> {
  return sleep(time, emitValue, isError)
}

/**
 * 异步等候
 * @param time - 等候时间
 * @param emitValue - 默认不需要
 * @param isError - 是否以reject
 * @returns 返回Promise<emitValue>
 * @public
 */
export function sleep<V = any>(time: number, emitValue?: any, isError = false): Promise<V> {
  return new Promise((resolve, reject) => {
    setTimeout(isError ? reject : resolve, time, emitValue);
  });
}