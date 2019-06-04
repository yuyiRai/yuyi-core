import { concat, join, keys, values } from 'lodash';
export function createObjectKey(obj: any): string {
  return join(concat(keys(obj), values(obj)));
}
