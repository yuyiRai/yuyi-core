import '../../../env'
import { GeneratorForEach, ForEachMacro } from './GeneratorForEach';

function* app() {
  for (var i = 0; i < 10; i++) {
    yield i;
  }
};

export function app2() {
  GeneratorForEach(app(), (v, done) => {
    console.log(v, done);
  })

  const arr = [1,2,3,4,5]
  ForEachMacro(arr, (value) => {
    console.log(value)
  })
}
