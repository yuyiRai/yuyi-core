import ts from 'typescript';
import { getCustomTransformers, AwesomeTsTransformerOptions } from './getCustomTransformers'

export default function (program: ts.Program, config?: Pick<AwesomeTsTransformerOptions, Exclude<keyof AwesomeTsTransformerOptions, 'program'>>): ts.TransformerFactory<ts.Node> {
  const { before = [], after = [], afterDeclarations = [] } = getCustomTransformers({
    program,
    ...(config && config || {}),
    logger: true
  })


  return context => node => {
    before.forEach(fn => {
      var r: ts.Transformer<ts.SourceFile> | ts.CustomTransformer = fn(context) as any
      var { transformSourceFile } = r instanceof Function ? { transformSourceFile: r } : (r as ts.CustomTransformer)
      node = transformSourceFile(node as ts.SourceFile)
    })
    return node
  }
}
