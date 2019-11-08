// const tsImportPluginFactory = require('ts-import-plugin');
import tsImportPluginFactory from 'ts-import-plugin'
import { Options as ImportOptions } from 'ts-import-plugin/lib/index'
import { CustomTransformers, Program, TransformerFactory, SourceFile, createProgram, ScriptTarget, WriteFileCallback } from 'typescript'
import tsxControlStatments from 'tsx-control-statements/transformer'
import transformerKeys from 'ts-transformer-keys/transformer'
import ocTransformer from 'ts-optchain/transform'
import nameofTransformer from 'ts-nameof'
import memoize from 'lodash/memoize'
import color from 'colors'
import hoistObjectsInProps from '@avensia-oss/ts-transform-hoist-objects-in-props'
// import { PluginCreator } from './PluginCreater'

const presetOptions = {
  'tsx-control-statements': tsxControlStatments,
  'ts-transformer-keys': transformerKeys,
  'ts-optchain': ocTransformer,
  'ts-nameof': nameofTransformer as TransformerFactory<SourceFile>,
  '@avensia-oss/ts-transform-hoist-objects-in-props': hoistObjectsInProps,
  'ts-import-plugins': tsImportPluginFactory
}
export type PresetKeys = keyof typeof presetOptions;

export interface AwesomeTsTransformerOptions {
  program: Program;
  importLibs?: (string | ImportOptions | [string, Partial<ImportOptions>])[];
  preset?: (string | [string, any?])[]
  useNameof?: boolean;
  useKeysOf?: boolean;
  useTsxControlStatments?: boolean;
  useOptchain?: boolean;
  useHoistObjectInProps?: boolean;
  logger?: boolean;
}
function resolveMsg(msg: string, append: string, ...msg2: any[]) {
  console.log(color.cyan(msg), color.green(append), ...(msg2 || []).map(i => color.yellow(i)))
  return true
}
function findKey(factory: any) {
  for (const [key, f] of Object.entries(presetOptions)) {
    if (f === factory){
      return key
    }
  }
  return factory && factory.name
}
let options = {
  logger: false
}
memoize.Cache = WeakMap
function useTransformFactory<T extends Function>(factory: T, ...msg: any): any {
  options.logger && resolveMsg('use transformer:', findKey(factory), ...msg)
  return factory 
  // ((...args: any) => {
  //   return factory(...args)
  // }) as any
}
const use = memoize(useTransformFactory, factory => factory) as typeof useTransformFactory

export function getCustomTransformers({
  program,
  importLibs = [],
  useHoistObjectInProps = true,
  useKeysOf = true,
  useNameof = true,
  useOptchain = true,
  useTsxControlStatments = true,
  logger = false
}: AwesomeTsTransformerOptions = {} as any) {
  options.logger = logger
  const importConfig: ImportOptions[] = (importLibs || []).map(i => {
    if (typeof i === 'string') {
      return {
        "style": false,
        "libraryName": i,
        "libraryDirectory": "",
        "camel2DashComponentName": false
      } as ImportOptions
    } else if(i instanceof Array && typeof i[0] === 'string') {
      const [name, options = {}] = i
      return {
        ...options,
        libraryName: options.libraryName || name
      } as ImportOptions
    } else if (i instanceof Object) {
      return i as ImportOptions
    }
    return null
  }).filter(option => option) as ImportOptions[]
  const allowList = [
    useTsxControlStatments && use(tsxControlStatments)(program),
    useKeysOf && use(transformerKeys)(program),
    useOptchain && use(ocTransformer)(program),
    useHoistObjectInProps && use(hoistObjectsInProps)(program, {
      propRegex: /.*/,
    }),
    useNameof && use(nameofTransformer) as TransformerFactory<SourceFile>,
    importConfig && importConfig.length > 0 && use(tsImportPluginFactory, `[${
      importConfig.map(c => c.libraryName).join(']/[')
    }]`)(importConfig)
  ];
  // const presetOptionsKeys = Object.keys(presetOptions)
  // for (const c of preset) {
  //   const [key, options = {}] = typeof c === 'string' ? [c] : c
  //   if (presetOptionsKeys.some(k => key.indexOf(k) > -1)) {
      
  //   }
  // }
  return ({
    before: allowList.filter(i => i) || []
  }) as CustomTransformers;
}
export default getCustomTransformers



export function compile(filePaths: string[], writeFileCallback?: WriteFileCallback, options?: Partial<AwesomeTsTransformerOptions> & {throwError?: boolean}) {
  const program = createProgram(filePaths, {
    strict: true,
    noEmitOnError: false,
    suppressImplicitAnyIndexErrors: true,
    target: ScriptTarget.ES5,
    esModuleInterop: true
  });
  const transformers: CustomTransformers = getCustomTransformers({
    ...options,
    program,
    logger: (options && 'logger' in options )? options.logger :true
  })
  const r = program.emit(undefined, writeFileCallback, undefined, false, transformers);

  if ((!options || options.throwError) && r.emitSkipped) {
    const { diagnostics } = r
    throw new Error(diagnostics.map(diagnostic => diagnostic.messageText).join('\n'));
  }
  return r
}
