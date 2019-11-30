import { Constant$ } from "../Constransts";

/**
 * {@inheritDoc sleep}
 * @deprecated 该方法迟早被弃用，使用 {@link sleep | sleep()} 代替
 */
export const waitingPromise = sleep

/**
 * 异步等候
 * @param time - 等候时间
 * @param emitValue - 默认不需要
 * @param isError - 是否以reject
 * @returns 返回Promise<emitValue>
 * @public
 */
export function sleep<V = void>(time: number, emitValue?: V, isError = false): Promise<V> {
  return Constant$.CREATE_PROMISE<V>((resolve, reject) => {
    Constant$.delay$$(isError ? reject : resolve, time, emitValue);
  });
}
