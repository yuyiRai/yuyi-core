/**
 * @jest-environment node
 */
import * as Utils from '../src'
const { isNumber, BenchmarkUtils } = Utils
// @ts-ignore
import { A, B } from './LodashExtra/isNumbr.test'
import { Constant$ } from '../src/Constransts'
const { FOR_EACH$$, FOR_EACH } = Constant$

test('forEach', async () => {
  await Utils.sleep(2000)
  const r = await BenchmarkUtils.paramDiff({
    'Function.call forEach': (A, B) => {
      FOR_EACH(A, (r, v) => {
        isNumber(r);
        isNumber(r, true);
      })
      FOR_EACH(B, (r, v) => {
        isNumber(r);
        isNumber(r, true);
      })
    },
    '尾递归forEach': (A, B) => {
      FOR_EACH$$(A, (r, v) => {
        isNumber(r);
        isNumber(r, true);
      })
      FOR_EACH$$(B, (r, v) => {
        isNumber(r);
        isNumber(r, true);
      })
    },
  }, [A, B])
  expect(r).toBeInstanceOf(Array)
  console.log('Fastest is ' + JSON.stringify(r));
})


