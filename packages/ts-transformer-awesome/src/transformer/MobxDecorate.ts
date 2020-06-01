import { groupBy } from 'lodash';
import ts, { createEmptyStatement } from 'typescript';
import '../../env';
import { AstUtils$$ } from './AstUtils';
import { isMethodDeclaration } from 'ts-is-kind'
import { catchArrayTodo, createVisitNodeAndChildren, TransformHooks, TransformStore, updateBlock, insertArrayAfter } from './visitNodeAndChildren';
import { DecorateType } from '../tslib-extra';

const decorate = ts.createIdentifier('__decorate_all')


export const config: TransformStore = {
  needImport: false,
  needClear: [] as any[],
  needImports: new Set(),
  repeatTimes: 0,
  blockRollup(params, children) {
    const decorateMap = groupBy<[string, string, string, boolean]>(params, p => p[0]);
    return Object.entries(decorateMap).reduce((result, [key, data]) => {
      if (__DEV__) {
        console.log('use decorate', key, JSON.stringify(data))
      }
      return catchArrayTodo(result, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.getText() === key) {
          // console.log('use decorate', key, JSON.stringify(data));
          const keyDatas = groupBy<[string, string, string, boolean]>(data, meta => meta[1])
          return [
            ts.updateClassDeclaration(node, [ts.createDecorator(
              ts.createCall(decorate, undefined, [
                AstUtils$$.createObjectWithEntries(
                  Object.entries(keyDatas).map(
                    ([key, meta]) => [
                      key,
                      ts.createArrayLiteral([
                        // 装饰器名称
                        ts.createArrayLiteral(
                          meta.map(
                            data => ts.createIdentifier(data[2])
                          )
                        ),
                        // 传入的description
                        meta.some(data => data[3]) ? undefined : ts.createIdentifier(DecorateType.nil + '')
                      ].filter(d => d) as ts.Expression[])
                      // AstUtils$$.createObjectWithEntries([
                      //   ['decorators', ],
                      //   ['desc', ]
                      // ])
                    ]
                  )
                )
              ])
            ), ...(node.decorators || [])], node.modifiers, node.name, node.typeParameters, node.heritageClauses, node.members),
            // ts.createExpressionStatement(ts.createCall(decorate, undefined, [
            //   ts.createIdentifier(key),
            //   AstUtils$$.createObjectWithEntries(data.map(i => [i[1], AstUtils$$.createObjectWithEntries([
            //     ['decorators', i[2]]
            //   ])]))
            // ]))
          ]
        }
        return false
      })
    }, children)
    // // console.error('use decorate Map', JSON.stringify(decorateMap))
    // return Object.entries(decorateMap).reduce((result, [key, data]) => {
    //   if (__DEV__) {
    //     console.log('use decorate', key, JSON.stringify(data))
    //   }
    //   return catchArrayTodo(result, node => {
    //     if (ts.isClassDeclaration(node) && node.name && node.name.getText() === key) {
    //       // console.log('use decorate', key, JSON.stringify(data));
    //       return AstUtils$$.extractClassCallExpression(
    //         node,
    //         decorate,
    //         [AstUtils$$.createObjectWithEntries(
    //           data.map(i => [i[1], i[2]])
    //         )]
    //       );
    //     }
    //     return false
    //   })
    // }, children)
  }
}



export type MobxDecorateTransformerOptions = {
  importName?: string;
  includeDecorate?: string[];
  excludeDecorate?: string[];
}
var replacerMeta = true
var includeMap: Record<string, boolean> = {}
export default function (program: ts.Program, { importName = 'mobx', includeDecorate = [], excludeDecorate = [] }: MobxDecorateTransformerOptions): ts.TransformerFactory<ts.Node> {
  includeDecorate.forEach(key => {
    includeMap[key] = true
  });
  excludeDecorate.forEach(key => {
    includeMap[key] = false;
  })
  
  return (context) => (file) => {
    if (!file || !file.getFullText) {
      return file
    }
    const fulltext = file.getFullText()
    if (fulltext && (fulltext.indexOf('@') === -1 || fulltext.indexOf(importName) === -1)) {
      return file
    }
    // return file
    config.needImport = false
    config.needClear = []

    let { next } = createVisitNodeAndChildren(visitNode, config)(file, program, context)
    if (config.needImports.size > 0) {
      if (__DEV__)
        console.log(config.needImports)
    }
    return updateBlock(next, stat => {
      const importD = AstUtils$$.createNamedImports('@yuyi919/ts-transformer-awesome/tslib-extra', [decorate])
      // console.log(importD.getText())
      return [
        importD,
        ...stat
      ]
    }) || next;
  };
}
function filterDecorates(decorators?: ts.Decorator[] | ts.NodeArray<ts.Decorator>, collection?: (decorator: ts.Decorator) => any): ts.NodeArray<ts.Decorator> | undefined {
  const list = decorators && decorators.filter(i => {
    return includeMap[i.expression.getText()] === false ? true : (collection && collection(i), false);
  })
  return list && list.length > 0 ? ts.createNodeArray(list) : undefined
}

export function getEscapedName(node: ts.Node): string | undefined {
  // @ts-ignore
  const check: ts.Declaration | ts.Expression = node;
  return check && ts.getNameOfDeclaration(check) && (ts.getNameOfDeclaration(check) as ts.Identifier).escapedText as string || undefined
}

export function getSourceText(node: ts.Node): string | undefined {
  return ts.getParseTreeNode(node).getText()
}
export function getParentTreeNode(node: ts.Node) {
  const sourceNode = ts.getParseTreeNode(node) as ts.Identifier | ts.Expression
  return sourceNode && sourceNode.parent || undefined
}

export function isClassProperty(node: ts.Node) {
  return ts.isGetAccessor(node) || isMethodDeclaration(node) || ts.isPropertyDeclaration(node) || ts.isElementAccessExpression(node) || ts.isBindingElement(node)
}
export function getPropertySourceClassName(node: ts.Node): (string | undefined) {
  if (isClassProperty(node)) {
    const classDeclare: ts.ClassDeclaration = getParentTreeNode(node) as any;
    return classDeclare && ts.isClassDeclaration(classDeclare) && classDeclare.name && classDeclare.name.escapedText as string || undefined
  }
  return undefined
}

export function visitNode(node: ts.Node, program: ts.Program, context: ts.TransformationContext): TransformHooks {
  const className = getPropertySourceClassName(node)
  if (replacerMeta && className && node.decorators) {
    // console.log(node.getSourceFile() && node.getText())//, classId && classId.getSourceFile() && classId.getText());

    // console.log(node.getText());
    const base = [
      className,
      getEscapedName(node)
    ];

    const rollupParams: any[] = [];
    node.decorators = filterDecorates(node.decorators, (dec: ts.Decorator) => {
      if (__DEV__) {
        console.log(
          getSourceText(node),
          '--- includes',
          dec.expression.getText(),
          base
        );
      }
      return rollupParams.push(base.concat([dec.expression.getText(), ts.isPropertyDeclaration(node)] as any));
    });
    return {
      rollupParams,
      next: node
    }
  }
  // else if (node && node.parent && node.parent.parent && ts.isClassDeclaration(node.parent.parent) && ts.isDecorator(node)) {
  //   const classId: ts.ClassDeclaration = node.parent && node.parent.parent as any
  //   const name = node.expression && node.expression.getText()
  //   if (name && includeMap[name] !== false) {
  //     const rollupParams = [
  //       [
  //         classId.name && classId.name.text,
  //         node.parent && node.parent.name && node.parent.name.getText(),
  //         name,
  //       ]
  //     ];
  //     if (__DEV__) {
  //       console.log(
  //         '--- includes',
  //         getEscapedName(node.parent),
  //         rollupParams
  //       );
  //     }
  //     return {
  //       next: createEmptyStatement(),
  //       rollupParams
  //     };
  //   } else {
  //     console.log(
  //       '--- excludes',
  //       node.getText()
  //     );
  //   }
  // }
  return { next: node };
}
