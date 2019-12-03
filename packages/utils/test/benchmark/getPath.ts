import * as Utils from "../..";
// tslint:disable-next-line: no-duplicate-imports
import { getValuePathIterator, getValuePathIteratorRunner } from "../..";

export var testObject = {
  a: {
    a: 2,
    b: {
      a: 1
    },
    c: {
      a: 2,
      d: 4
    }
  },
  b: {
    c: {
      d: 1
    }
  }
};


const runner = () => Utils.BenchmarkUtils.paramDiff({
  'getValuePathIterator(栈循环)': (obj) => {
    for (const o of getValuePathIterator(obj)) {

    }
  },
  'getValuePathIterator(递归)': (obj) => {
    for (const o of getValuePathIteratorRunner(obj)) {

    }
  },
  'getValuePathIterator(栈循环2)': (obj) => {
    for (const o of getValuePathIterator(obj)) {

    }
  },
  'getValuePathIterator(递归2)': (obj) => {
    for (const o of getValuePathIteratorRunner(obj)) {

    }
  },
}, [testObject], { delay: 5000 })

const iterator = getValuePathIterator(testObject)
for (const tmp of iterator) {
  console.log(tmp)
};
runner().then(r => {
  console.log('Fastest is ' + JSON.stringify(r));
})
