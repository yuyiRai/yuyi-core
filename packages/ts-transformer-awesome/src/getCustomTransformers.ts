// const tsImportPluginFactory = require('ts-import-plugin');
import hoistObjectsInProps from '@avensia-oss/ts-transform-hoist-objects-in-props';
import memoize from 'lodash/memoize';
import tsImportPluginFactory from 'ts-import-plugin';
import { Options as ImportOptions2 } from 'ts-import-plugin/lib/index';
import paths from 'typescript-transform-paths';
import nameofTransformer from 'ts-nameof';
import ocTransformer from 'ts-optchain/transform';
import mmlpxTransformer from 'ts-plugin-mmlpx';
import { transform as reactConstantElements } from 'ts-transform-react-constant-elements/dist/transform';
import tsEnumerate from 'ts-transformer-enumerate/transformer';
import transformerKeys from 'ts-transformer-keys/transformer';
// import tsmacros from 'typescript-transform-macros'
import tsMinifyPrivates from 'ts-transformer-minify-privates';
import tsxControlStatments from 'tsx-control-statements/transformer';
import ts, { CustomTransformers, Program, SourceFile, TransformerFactory } from 'typescript';
import tsIsTransformer from 'typescript-is/lib/transform-inline/transformer';
import typesmithTransformer from 'typesmith/transformer';
import { DEV, Macros, MobxDecorateTransformer, TypeFilterTransformer } from './transformer';
import { MobxDecorateTransformerOptions } from './transformer/MobxDecorate';
import { resolveMsg } from './resolveMsg';
import { options } from './options';

console.log = () => { }

const presetOptions = {
  'tsx-control-statements': tsxControlStatments,
  'ts-transformer-keys': transformerKeys,
  'ts-optchain': ocTransformer,
  'ts-nameof': nameofTransformer as TransformerFactory<SourceFile>,
  '@avensia-oss/ts-transform-hoist-objects-in-props': hoistObjectsInProps,
  'ts-import-plugins': tsImportPluginFactory,
  'ts-transform-react-constant-elements': reactConstantElements,
  'ts-plugin-mmlpx': mmlpxTransformer,
  'ts-transformer-enumerate': tsEnumerate,
  'typescript-transform-macros': Macros,
  'ts-transformer-minify-privates': tsMinifyPrivates,
  "DEV-Replacer": DEV,
  'typescript-is': tsIsTransformer,
  'typesmith': typesmithTransformer,
  '@yuyi919/TypeFilterTransformer': TypeFilterTransformer,
  '@yuyi919/MobxDecorateTransformer': MobxDecorateTransformer,
  'typescript-transform-paths': paths
}
export type PresetKeys = keyof typeof presetOptions;

export interface ImportOptions extends ImportOptions2 {
  afterDeclarations?: boolean;
}
export interface AwesomeTsTransformerOptions {
  program: Program;
  importLibs?: (string | ImportOptions | [string, Partial<ImportOptions>])[];
  preset?: (string | [string, any?])[]
  useNameof?: boolean;
  useKeysOf?: boolean;
  useTsxControlStatments?: boolean;
  useOptchain?: boolean;
  useHoistObjectInProps?: boolean;
  useReactConstantElements?: boolean;
  useMiniftyPrivate?: boolean;
  useTypeFilter?: boolean;
  useMacros?: boolean;
  useEnumerate?: boolean;
  useMobxMMLPX?: boolean;
  useTypescriptIs?: boolean;
  useTypesmith?: boolean;
  useMobxDecorate?: boolean | MobxDecorateTransformerOptions;
  logger?: boolean;
  /**
   * @default process.env.NODE_ENV === 'development'
   */
  isDev?: boolean;
}
function findKey(factory: any) {
  for (const [key, f] of Object.entries(presetOptions)) {
    if (f === factory){
      return key
    }
  }
  return factory && factory.name
}
memoize.Cache = WeakMap
function use<T extends Function>(factory: T, ...msg: any): any {
  resolveMsg('use transformer:', findKey(factory), ...msg)
  return factory 
  // ((...args: any) => {
  //   return factory(...args)
  // }) as any
}
// const use = memoize(useTransformFactory, factory => factory) as typeof useTransformFactory

export function getCustomTransformers({
  program,
  importLibs = [],
  isDev = process.env.NODE_ENV === 'development',
  useHoistObjectInProps = true,
  useReactConstantElements = true,
  useKeysOf = true,
  useNameof = true,
  useOptchain = true,
  useTypeFilter = false,
  useTsxControlStatments = true,
  useMiniftyPrivate = true,
  useMacros = true,
  useMobxDecorate = false,
  useEnumerate = true,
  useMobxMMLPX = false,
  useTypescriptIs = false,
  useTypesmith = false,
  logger = false
}: AwesomeTsTransformerOptions = {} as any) {
  options.logger = logger


  resolveMsg("Typescript version: ", ts.version);
  if (program.getCompilerOptions().module) {
    resolveMsg("module: ", ts.ModuleKind[program.getCompilerOptions().module as ts.ModuleKind]);
  }
  if (program.getCompilerOptions().target) {
    resolveMsg("target: ", ts.ScriptTarget[program.getCompilerOptions().target as ts.ScriptTarget]);
  }

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
    use(DEV)(program, isDev),
    useTypescriptIs && use(tsIsTransformer)(program, {}),
    useTypesmith && use(typesmithTransformer)(program),
    useTsxControlStatments && use(tsxControlStatments)(program),
    useReactConstantElements && use(reactConstantElements)(),
    useMobxMMLPX && use(mmlpxTransformer)(),
    useKeysOf && use(transformerKeys)(program),
    useEnumerate && use(tsEnumerate)(program),
    useOptchain && use(ocTransformer)(program),
    useHoistObjectInProps && use(hoistObjectsInProps)(program, {
      propRegex: /.*/,
    }),
    use(paths)(program),
    useTypeFilter && use(TypeFilterTransformer)(program),
    useNameof && use(nameofTransformer) as TransformerFactory<SourceFile>,
    useMiniftyPrivate && use(tsMinifyPrivates)(program, { prefix: '_$$' }),
    useMobxDecorate && use(MobxDecorateTransformer)(program, useMobxDecorate),
    importConfig && importConfig.length > 0 && use(tsImportPluginFactory, `[${
      importConfig.map(c => c.libraryName).join(']/[')
      }]`)(importConfig),
    useMacros && use(Macros)(program)
  ];
  // const presetOptionsKeys = Object.keys(presetOptions)
  // for (const c of preset) {
  //   const [key, options = {}] = typeof c === 'string' ? [c] : c
  //   if (presetOptionsKeys.some(k => key.indexOf(k) > -1)) {
      
  //   }
  // }
  const before = allowList.filter(i => i) || []
  return ({
    before,
    after: filterToImport(importConfig, 'after'),
    afterDeclarations: filterToImport(importConfig, 'afterDeclarations')
  }) as CustomTransformers;
}

function filterToImport(confit: any[], has: string) {
  const hased = confit && confit.length > 0 && confit.filter(i => i[has]) || []
  return [
    hased.length > 0 && use(tsImportPluginFactory, `(${has})[${
      hased.map(c => c.libraryName).join(']/[')
      }]`)(hased)
  ].filter(i => i)
}
