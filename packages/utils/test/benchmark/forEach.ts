/**
 * @jest-environment node
 */
import * as Utils from '../../src'
// @ts-ignore
import { Constant$ } from '../../src/Constransts'
// import { BenchmarkUtils } from '@yuyi919/utils'
const { isNumber } = Utils
const { MAP$$, FOR_EACH$$, FOR_EACH, MAP } = Constant$

const runner = () => Utils.BenchmarkUtils.paramDiff({
  'Function.call forEach': (A) => {
    FOR_EACH(Utils.cloneDeep(A), (r) => {
      isNumber(r);
      isNumber(r, true);
    })
  },
  '尾递归forEach': (A) => {
    FOR_EACH$$(Utils.cloneDeep(A), (r) => {
      isNumber(r);
      isNumber(r, true);
    })
  },
}, [new Array(1000).fill(10)], { delay: 2000 })

// tslint:disable-next-line: no-floating-promises
runner().then((r) => {
  console.log('Fastest is ' + JSON.stringify(r), Utils.reduceMap([1, 2, 3], i => ({ [i]: i })));
});
