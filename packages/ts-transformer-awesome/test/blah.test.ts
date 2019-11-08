import { compile } from '..';
import * as assert from 'assert';
import * as prettier from 'prettier';
import path from 'path'

describe('blah', () => {
  it('works', () => {
    run('')
// runTest(`keys();`, `[];`, {
//   commonPrefix: `
//     import { keys } from 'ts-transformer-keys';
//   `
// });
  });
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

export function run(text: string) {
  compile([path.join(__dirname, './file.ts')], (fileName, fileText) => {
    console.log(fileName, fileText)
  }, {
    importLibs: ['lodash']
  })
  return text
}