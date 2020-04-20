/**
 * @jest-environment node
 */
import * as Utils from '../../src'
const { isNumber, isNum } = Utils
// @ts-ignore
import { A, B } from '../LodashExtra/isNumbr.test'
import { BenchmarkUtils } from '../../dist/TestUtils';

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
function forEach<T>(arr: T[], render: Function, i: number = 0, length = arr.length) {
  render(arr[i], i, arr)
  return i < length ? forEach(arr, render, i + 1, length) : true
}
const forEach2 = Function.call.bind(Array.prototype.forEach)
test('group', async () => {
  const r = await BenchmarkUtils.paramDiff({
    'isNumber(Multiple) Test': (A, B) => {
      // tslint:disable-next-line: one-variable-per-declaration
      // var length = A.length, i = -1;
      // while (i < length) {
      //   const v = A[++i]
      //   isNum(v);
      //   isNum(v, true);
      // }
      // // tslint:disable-next-line: one-variable-per-declaration
      // length = B.length, i = -1;
      // while (i < length) {
      //   const v = B[++i]
      //   isNum(v);
      //   isNum(v, true);
      // }

      forEach(A, (r, v) => {
        isNum(r);
        isNum(r, true);
      })
      forEach(B, (r, v) => {
        isNum(r);
        isNum(r, true);
      })
    },
    'isNumber Test': (A, B) => {
      forEach2(A, (r, v) => {
        isNumber(r);
        isNumber(r, true);
      })
      forEach2(B, (r, v) => {
        isNumber(r);
        isNumber(r, true);
      })
    },
  }, [A, B])
  expect(r).toBeInstanceOf(Array)
  console.log('Fastest is ' + JSON.stringify(r));
})


