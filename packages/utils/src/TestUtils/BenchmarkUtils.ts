import { sleep } from '../CustomUtils';
import { cloneDeep } from '../LodashExtra';

export namespace BenchmarkUtils {
  export async function paramDiff(group: { [k: string]: (...args: any[]) => any }, params: any[], options = {
    delay: 1000
  }) {
    const Benchmark = await import('benchmark')
    let suite = new Benchmark.Suite;
    for (const key of Object.keys(group)) {
      suite.add(key, () => group[key](...cloneDeep(params)))
    }
    if (options.delay) {
      console.log('test is will be start after ' + options.delay + 'ms')
      await sleep(options.delay)
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
