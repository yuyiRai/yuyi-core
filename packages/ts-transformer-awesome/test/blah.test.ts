import { writeFileSync } from 'fs';
import path from 'path';
import contextRequire from "require-context";
import { compile } from '../src';
// import '@types/webpack'
describe('blah', () => {
  for (const p of contextRequire(path.join(__dirname, './src'), true, /\.(ts|tsx)$/).keys()) {
    it('work: ' + p, () => {
      run(path.join(__dirname, './src', p))
    });
  }
  // runTest(`keys();`, `[];`, {
  //   commonPrefix: `
  //     import { keys } from 'ts-transformer-keys';
  //   `
  // });
});

// function runTest(
//   text: string,
//   expected: string,
//   options: { commonPrefix?: string } = {}
// ) {
//   if (options.commonPrefix != null) text = options.commonPrefix + text;

//   const result = run(text);
//   if (!expected.endsWith('\n')) expected += '\n';
//   const formatter = prettier.format(result, { parser: 'typescript' })
//   console.log(formatter)
//   assert.equal(formatter, expected);
// }

export function run(path: string) {
  let r;
  compile([path], (fileName, fileText) => {
    console.log(fileName, fileText)
    writeFileSync(fileName, fileText)
    r = fileText
  }, {
    importLibs: ['lodash'],
    logger: true,
    useEnumerate: false,
    useTsxControlStatments: false,
    useMacros: false
  })
  return r
}