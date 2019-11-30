/**
 * @jest-environment node
 */
import * as Utils from '../../src'
const { isNumber, isNumberAuto, BenchmarkUtils } = Utils
// @ts-ignore
import { A, B } from './isNumbr.test'

// test('one', async () => {
//   const r = await BenchmarkUtils.paramDiff({
//     'isNumber(static) Auto Test': isNumber,
//     'isNumber Auto Test': isNumberAuto,
//   }, [NaN, false])
//   expect(r).toBeInstanceOf(Array)
//   const r2 = await BenchmarkUtils.paramDiff({
//     'isNumber(static) Auto Test': isNumber,
//     'isNumber Auto Test': isNumberAuto,
//   }, [12, false])
//   expect(r2).toBeInstanceOf(Array)
//   console.log('Fastest is ' + JSON.stringify(r));
//   console.log('Fastest is ' + JSON.stringify(r2));
// })

test('group', async () => {
  const r = await BenchmarkUtils.paramDiff({
    'isNumber(static) Auto Test': (A, B) => {
      A.forEach((r, v) => {
        isNumber(v);
        isNumber(v, true);
      })
      B.forEach((r, v) => {
        isNumber(v);
        isNumber(v, true);
      })
    },
    'isNumber Auto Test': (A, B) => {
      A.forEach((r, v) => {
        isNumberAuto(v);
        isNumberAuto(v, true);
      })
      B.forEach((r, v) => {
        isNumberAuto(v);
        isNumberAuto(v, true);
      })
    },
  }, [A, B])
  expect(r).toBeInstanceOf(Array)
  console.log('Fastest is ' + JSON.stringify(r));
})


