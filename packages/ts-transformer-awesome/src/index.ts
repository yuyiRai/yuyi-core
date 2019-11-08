// const tsImportPluginFactory = require('ts-import-plugin');
import tsImportPluginFactory from 'ts-import-plugin'
import { Options as ImportOptions } from 'ts-import-plugin/lib/index'
import { Program, TransformerFactory, SourceFile } from 'typescript'
import tsxControlStatments from 'tsx-control-statements/transformer'
import transformerKeys from 'ts-transformer-keys/transformer'
import ocTransformer from 'ts-optchain/transform'
import nameofTransformer from 'ts-nameof'
import hoistObjectsInProps from '@avensia-oss/ts-transform-hoist-objects-in-props'
// import { PluginCreator } from './PluginCreater'

const presetOptions = {
  'tsx-control-statements': tsxControlStatments,
  'ts-transformer-keys': transformerKeys,
  'ts-optchain': ocTransformer,
  'ts-nameof': nameofTransformer as TransformerFactory<SourceFile>,
  '@avensia-oss/ts-transform-hoist-objects-in-props': hoistObjectsInProps
}
export type PresetKeys = keyof typeof presetOptions;

export interface AwesomeTsTransformerOptions {
  program: Program;
  importLibs?: (string | ImportOptions | [string, Partial<ImportOptions>])[];
  preset?: (string | [string, any?])[]
  useNameof?: boolean;
  useKeysOf?: boolean;
  useTsxControlStatments?: boolean;
  useOc?: boolean;
  useHoistObjectInProps?: boolean
}

export function getCustomTransformers({
  program,
  importLibs = [],
  preset = [],
  ...opt
}: AwesomeTsTransformerOptions = {} as any) {
  const importConfig: ImportOptions[] = importLibs.map(i => {
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
    opt.useTsxControlStatments && tsxControlStatments(program),
    opt.useKeysOf && transformerKeys(program),
    opt.useOc && ocTransformer(program),
    opt.useHoistObjectInProps && hoistObjectsInProps(program, {
      propRegex: /.*/,
    }),
    opt.useNameof && nameofTransformer as TransformerFactory<SourceFile>,
    importConfig.length > 0 && tsImportPluginFactory(importConfig)
  ];
  // const presetOptionsKeys = Object.keys(presetOptions)
  // for (const c of preset) {
  //   const [key, options = {}] = typeof c === 'string' ? [c] : c
  //   if (presetOptionsKeys.some(k => key.indexOf(k) > -1)) {
      
  //   }
  // }
  return ({
    before: allowList.concat([
      importConfig.length > 0 && tsImportPluginFactory(importConfig)
    ]).filter(i => i)
  });
}
export default getCustomTransformers