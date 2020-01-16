/**
 * @jest-environment node
 */
var __DEV__ = true;
import * as Utils from '../..';
// @ts-ignore
import { Constant$ } from '../../dist/Constransts';
import { BenchmarkUtils } from '../../dist/TestUtils';
// import { BenchmarkUtils } from '@yuyi919/utils'
const { isNumber } = Utils;
const { MAP$$, FOR_EACH$$, FOR_EACH, MAP } = Constant$;
const callbackfn = (r) => {
  isNumber(r);
  isNumber(r, true);
};
const runner = () => BenchmarkUtils.paramDiff({
  '尾递归forEach': (A) => {
    FOR_EACH$$((A), callbackfn);
  },
  'Function. forEach': (A) => {
    (A).forEach(callbackfn);
  },
  'Function.call forEach': (A) => {
    FOR_EACH((A), callbackfn);
  },
  '尾递归forEach2': (A) => {
    FOR_EACH$$((A), callbackfn);
  },
  'Function.call forEach2': (A) => {
    FOR_EACH((A), callbackfn);
  },
  'Function. forEach2': (A) => {
    (A).forEach(callbackfn);
  },
}, [new Array(1000).fill(10)], { delay: 5000 });

// tslint:disable-next-line: no-floating-promises
runner().then((r) => {
  console.log('Fastest is ' + JSON.stringify(r), Utils.reduceMap([1, 2, 3], i => ({ [i]: i })));
});
