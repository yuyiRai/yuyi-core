/**
 * @jest-environment node
 */
import { isNumber, isNumberAuto, BenchmarkUtils } from '../../src'
// @ts-ignore
import { A, B } from './isNumbr.test'

test('one', async () => {
  const r = await BenchmarkUtils.paramDiff({
    'isNumber(static) Auto Test': isNumber,
    'isNumber Auto Test': isNumberAuto,
  }, [NaN, true])
  expect(r).toBeInstanceOf(Array)
  console.log('Fastest is ' + JSON.stringify(r));
})

// test('group', async () => {
//   const r = await BenchmarkUtils.paramDiff({
//     'isNumber(static) Auto Test': (A, B) => {
//       A.forEach((r, v) => {
//         isNumber(v);
//         isNumber(v, true);
//       })
//       B.forEach((r, v) => {
//         isNumber(v);
//         isNumber(v, true);
//       })
//     },
//     'isNumber Auto Test': (A, B) => {
//       A.forEach((r, v) => {
//         isNumberAuto(v);
//         isNumberAuto(v, true);
//       })
//       B.forEach((r, v) => {
//         isNumberAuto(v);
//         isNumberAuto(v, true);
//       })
//     },
//   }, [A, B])
//   expect(r).toBeInstanceOf(Array)
//   console.log('Fastest is ' + JSON.stringify(r));
// })


