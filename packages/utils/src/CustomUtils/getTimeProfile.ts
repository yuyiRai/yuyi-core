import { isNaN } from 'lodash'
export function timeProfile(): void {
  (timeProfile as any).last = new Date().getTime()
}
export function getTimeProfile(): number {
  // tslint:disable-next-line: no-unexpected-multiline
  const a: number = (timeProfile as any).last;
  const r = (typeof a === 'number' && !isNaN(a)) ? new Date().getTime() - a : NaN;
  (timeProfile as any).last = NaN;
  return r
}
export function cleanTimeProfile(): void {
  // tslint:disable-next-line: no-unexpected-multiline
  (timeProfile as any).last = NaN;
}