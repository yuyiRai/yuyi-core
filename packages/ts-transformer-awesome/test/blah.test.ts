import { writeFileSync } from 'fs';
import path from 'path';
import contextRequire from "require-context";
import { compile } from '../src';

// import '@types/webpack'
for (const p of contextRequire(path.join(__dirname, './src'), true, /\.(ts|tsx)$/).keys()) {
  // test('work: ' + p, () => {
    // expect(
      run(path.join(__dirname, './src', p))
      // ).toMatchSnapshot(p)
  // });
}

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
      importLibs: [
        '@material-ui/core',
        "@material-ui/icons",
        "lodash"
      ],
    // importLibs: ['lodash'],
    logger: true,
    useEnumerate: false,
    useTsxControlStatments: false,
    useMacros: false
  })
  return r
}