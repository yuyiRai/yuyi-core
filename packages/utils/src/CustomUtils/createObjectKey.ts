/**
 * @module CustomUtils
 */
import { concat, join, keys, values } from '../LodashExtra';
export function createObjectKey(obj: any): string {
  return join(concat(keys(obj), values(obj)));
}
