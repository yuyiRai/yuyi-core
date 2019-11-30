import Benchmark from 'benchmark'

export namespace BenchmarkUtils {
  export function paramDiff(group: { [k: string]: (...args: any[]) => any }, params: any[]) {
    let suite = new Benchmark.Suite;
    for (const key of Object.keys(group)) {
      suite.add(key, () => group[key](...params))
    }
    return new Promise(resolve => {
      suite.on('cycle', (event) => {
        console.log(String(event.target));
      }).on('complete', function () {
        resolve(this.filter('fastest').map('name'))
      }).run({})
    });
  }
}
