/**
 * @jest-environment node
 */
import * as Utils from '../..'

const { getPropByPath, getPropByPath2, BenchmarkUtils } = Utils

const runner = async () => {
  const r = await BenchmarkUtils.paramDiff({
    'getPropByPath(for)': (data, path) => getPropByPath(data, path),
    'getPropByPath(while)': (data, path) => getPropByPath2(data, path),
    'getPropByPath(while)2': (data, path) => getPropByPath2(data, path),
    'getPropByPath(for)2': (data, path) => getPropByPath(data, path),
  }, [{ a: [2] }, 'a[0]'])
  
}


runner().then(r => {
  console.log('Fastest is ' + JSON.stringify(r));
})

