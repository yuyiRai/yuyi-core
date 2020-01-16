import { Constant$ } from '../Constransts';

export function filterMap<S = string, T = string>(arr: any[], formatter: (k: S) => T, igronValue: any = false) {
  return filterMapWith(arr, formatter, Constant$.CREATE_OBJECT_IS(igronValue));
}
export function filterMapWith<S = string, T = string>(arr: any[], formatter: (k: S) => T, igronFilter: (value: any) => boolean) {
  const r: T[] = [];
  let i = -1, cr = null, j = -1;
  while (++j < arr.length) {
    if (!igronFilter((cr = formatter(arr[j]))))
      r[++i] = cr;
  }
  return r;
}
export function filterKeys(target: Record<string, any>, filter?: (code: string) => boolean): string[] {
  var r: string[] = [],
    length = -1,
    keys = Object.keys(target),
    keysLength = keys.length,
    i = -1,
    code = null;
  while ((++i < keysLength && (code = keys[i])))
    filter(code) && (r[++length] = code)
  return r
}
