import { getCustomTransformers } from '..';
import * as ts from 'typescript';

describe('blah', () => {
  const compilerOptions: ts.CompilerOptions = {
    strictNullChecks: true,
    target: ts.ScriptTarget.ES2017,
    strict: false,
    skipDefaultLibCheck: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    skipLibCheck: true,
  };
  it('works', () => {
    expect(
      getCustomTransformers({
        program: ts.createProgram(['./index.ts'], compilerOptions),
        importLibs: ['lodash', '@matrial-ui/core'],
      })
    ).toMatchInlineSnapshot(`
      Object {
        "before": Array [
          [Function],
          [Function],
          [Function],
          [Function],
          [Function],
          [Function],
          [Function],
        ],
      }
    `);
  });
});
