import '../../../env'
import { GeneratorForEach, ForEachMacro } from './GeneratorForEach.tsmacro';

function* testGenerator() {
  for (var i = 0; i < 10; i++) {
    yield i;
  }
};

function test() {
  const result1 = GeneratorForEach(testGenerator(), (v, done) => {
    console.log(v, done);
  })

  const result2 = ForEachMacro([1, 2, 3, 4, 5], (value) => {
    console.log(3)
  })

  return {
    result1,
    result2
  }
}
