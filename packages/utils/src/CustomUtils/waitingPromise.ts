import { Constant$ } from "../Constransts";

/**
 * {@inheritDoc sleep}
 * @deprecated 该方法迟早被弃用，使用 {@link sleep | sleep()} 代替
 */
export const waitingPromise = sleep

const { CREATE_PROMISE, delay$$ } = Constant$
/**
 * 异步等候
 * @param time - 等候时间
 * @param emitValue - 默认不需要
 * @param isError - 是否以reject
 * @returns 返回Promise<emitValue>
 * @public
 */
export function sleep<V = void>(time: number, emitValue?: V, isError = false): Promise<V> {
  return isError ? CREATE_PROMISE<V>(function (_, reject) {
    delay$$(reject, time, emitValue);
  }) : CREATE_PROMISE(function (resolve) {
    delay$$(resolve, time, emitValue);
  });
}

/* istanbul ignore next */
/**
 * 等待下一帧cpu时序
 * @param emitValue - 默认不需要
 */
export function nextTick(): Promise<void> {
  return CREATE_PROMISE(function (resolve) {
    delay$$(resolve, 0);
  });
}
