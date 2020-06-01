import {createProgram, CustomTransformers, ModuleKind, ScriptTarget, WriteFileCallback, CompilerOptions, Program } from 'typescript';
import fs from 'fs-extra';
import { getCustomTransformers, AwesomeTsTransformerOptions } from './getCustomTransformers';

export type CustomCompilerOptions = Partial<AwesomeTsTransformerOptions> & {
  throwError?: boolean;
  compilerOptions?: Partial<CompilerOptions>,
  tsConfig?: string;
  ts?: string
}


export function compile(filePaths: string[], writeFileCallback?: WriteFileCallback, { ts = 'typescript', compilerOptions = {}, tsConfig: configPath = '', ...options }: CustomCompilerOptions = {}) {
  if (fs.existsSync(configPath)) {
    try {
      const json = fs.readJSONSync(configPath);
      compilerOptions = Object.assign({}, json.compilerOptions || {}, compilerOptions);
    }
    catch (error) {
    }
  }
  const program = (require(ts).createProgram as typeof createProgram)(filePaths, {
    strict: true,
    noEmitOnError: false,
    suppressImplicitAnyIndexErrors: true,
    target: ScriptTarget.ES5,
    esModuleInterop: true,
    module: ModuleKind.CommonJS,
    "noEmitHelpers": false,
    "noUnusedLocals": false,
    importHelpers: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    ...compilerOptions
  });
  const transformers: CustomTransformers = getCustomTransformers({
    ...options,
    program,
    logger: (options && 'logger' in options) ? options.logger : true
  });
  const r = program.emit(undefined, writeFileCallback, undefined, false, transformers);
  if ((!options || options.throwError) && r.emitSkipped) {
    const { diagnostics } = r;
    throw new Error(diagnostics.map(diagnostic => diagnostic.messageText).join('\n'));
  }
  return r;
}
