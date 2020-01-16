/**
 * @module CustomUtils
 */
import { values } from '../LodashExtra';
import { Constant$ } from '../Constransts';
export function createObjectKey(obj: any): string {
  const { ARR_CONCAT, OBJ_KEYS } = Constant$
  return ARR_CONCAT(OBJ_KEYS(obj), values(obj)).join();
}
