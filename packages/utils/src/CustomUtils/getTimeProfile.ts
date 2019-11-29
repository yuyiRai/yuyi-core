import { isNaN } from 'lodash'

export function timeProfile(): void {
  (timeProfile as any)._last = getTime()
}
export function getTimeProfile(): number {
  // tslint:disable-next-line: no-unexpected-multiline
  const a: number = (timeProfile as any)._last;
  const r = (typeof a === 'number' && !isNaN(a)) ? getTime() - a : NaN;
  (timeProfile as any)._last = NaN;
  return r
}
export function cleanTimeProfile(): void {
  // tslint:disable-next-line: no-unexpected-multiline
  (timeProfile as any)._last = NaN;
}

export function getTime() {
  return new Date().getTime()
}
