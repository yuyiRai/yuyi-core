/**
 * Copyright (C) 2019-present, Rimeto, LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as ts from 'typescript';
import * as kind from 'ts-is-kind'
import { AstUtils } from './AstUtils';

const FUNCTION_SYMBOL = 'FilterFunction';

const config = {
  isNeedRepeat: false,
  needClear: [] as any[],
  repeatTimes: 0
}

function isNeedClear(node: ts.Node) {
  return node.getSourceFile() && config.needClear.includes(node.getText())
}

export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return (context) => (file) => {
    config.isNeedRepeat = false
    config.needClear = []
    let { node } = visitNodeAndChildren(file, program, context)
    if (config.isNeedRepeat) {
      config.repeatTimes++
      console.log('isNeedRepeat', node.fileName);
      node = visitNodeAndChildren(node, program, context).node
    }
    return node;
  };
}


export const createAstFromString = (input: string, node: ts.Node, name = `~temp~${new Date().getTime()}.ts`) =>
  (ts.createSourceFile(name, input, node.getSourceFile().languageVersion, true)
    .statements[0] as ts.ExpressionStatement).expression;

export const createAstStatmentFromString = (input: string, node: ts.Node, name = `~temp~${new Date().getTime()}.ts`) =>
  ts.createSourceFile(name, input, node.getSourceFile().languageVersion, true)


function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): {
  node: ts.SourceFile
} {
  const { next, isNeedRepeat } = visitNode(node, program, context)
  if (isNeedRepeat && !config.isNeedRepeat) {
    config.isNeedRepeat = true
  }
  return {
    node: ts.visitEachChild(
      next,
      (childNode) => visitNodeAndChildren(childNode, program, context).node,
      context,
    ) as ts.SourceFile
  };
}

export function mapChildren(children: ts.NodeArray<any> | ts.Node[], times = 1) {
  const r = [] as any[]
  if (times !== 0) {
    for(const c of children) {
      r.push(mapChildren(c.getChildren(), times - 1))
    }
  } else {
    for (const c of children) {
      r.push(c.getText())
    }
  }
  return r
}

export function visitImportNode(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.NamedImports | ts.Node {
  return ts.visitEachChild(node, (node) => {
    if (kind.isImportClause(node)) {
      // console.log('isImportClause', node.getText());
      return visitImportNode(node, program, context)
    } else if (kind.isNamedImports(node)) {
      // console.log('isNamedImports', node.getText());
      return ts.updateNamedImports(node, node.elements.filter(i => !isNeedClear(i)))
    }
    return node
  }, context)
}

function visitNode(node: ts.Node, program: ts.Program, context: ts.TransformationContext): {
  next: ts.Node,
  isNeedRepeat: boolean
} {

  if (config.repeatTimes > 0) {
    if (kind.isImportDeclaration(node)) {
      // console.log('isImportDeclaration', node.getText());
      node = visitImportNode(node, program, context)
    } else if (ts.isVariableStatement(node) && isNeedClear(node)) {
      return { next: ts.createNode(ts.SyntaxKind.UndefinedKeyword), isNeedRepeat: false }
    }
    return { next: node, isNeedRepeat: false }
  }

  const typeChecker = program.getTypeChecker();
  // const mnode = node
  // if (ts.isVariableStatement(node)) {
  //   console.log(node.getText());
  //   node = node.declarationList.declarations[0]
  // }
  if (ts.isCallExpression(node)) {
    // Check if function call expression is an oc chain, e.g.,
    // 检查函数表达式是否是Oc链
    //   oc(x).y.z()
    if (_isValidType(typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node.expression)))) {
      console.log('escapedText', node.getText());
      const returnNode = expandExpression(node.arguments)
      ts.addSyntheticTrailingComment(returnNode, ts.SyntaxKind.SingleLineCommentTrivia, " " + node.getText()+"\n")
      return { next: returnNode, isNeedRepeat: true };
    } else if (node.arguments.length) {
      // Check for a naked oc(x) call
      const callTypeNode = typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node));
      if (_isValidType(callTypeNode)) {
        // Unwrap oc(x) -> x
        return { next: node.arguments[0], isNeedRepeat: false };
      }
    }
  } else if (ts.isPropertyAccessExpression(node)) {
    const expressionTypeNode = typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node));
    if (_isValidType(expressionTypeNode)) {
      // We found an OCType property access expression w/o closing de-reference, e.g.,
      //   oc(x).y.z        
      console.log('isPropertyAccessExpression', node.getText())
      if (node.parent && node.parent.parent && node.parent.parent.parent) {
        const parent = node.parent.parent.parent
        console.log('parent', parent.getSourceFile().fileName, parent.getText(), ts.isVariableStatement(parent));
        config.needClear.push(parent.getText(), ...node.getText().split('.'))
      }

      return { next: node, isNeedRepeat: true }
    }
  }

  return { next: node, isNeedRepeat: false };
}

function _isValidType(node: ts.TypeNode | undefined): boolean {
  if (!node) {
    return false;
  }

  // 交叉/联合类型时进行递归检查
  if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
    return node.types.some((n) => _isValidType(n));
  }

  if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
    if (node.typeName.escapedText === FUNCTION_SYMBOL) {
      console.log('escapedText', node.typeName.escapedText)
      return true;
    }
  }

  return false;
}

/**
 * 展开函数参数为闭包立即调用
 * @param argList 参数节点数组
 */
function expandExpression(argList: ts.NodeArray<ts.Expression>): ts.Expression {
  if (argList.length === 0) {
    return ts.createIdentifier('undefined')
  }
  // function createIf333(subList: ts.NodeArray<ts.Expression>, i: number = 0, sub: ts.Expression = subList[i]) {
  //   let tmp: ts.Statement
  //   const tmpI = ts.createIdentifier('tmp')

  //   if (ts.isIdentifier(sub) || ts.isToken(sub)) {
  //     console.log('根是标识符或标记（例如，this）', sub.getText(), subList.length, i);
  //   } else {
  //     if (ts.isCallExpression(sub)) {
  //       console.log('根是函数调用', sub.getText());
  //     }
  //     if (ts.isLiteralTypeNode(sub)) {
  //       console.log('isArrayLiteralExpression', sub.getText());
  //     }
  //     if (ts.isLiteralExpression(sub)) {
  //       console.log('isLiteralExpression', sub.getText());
  //     }
  //     tmp = createVariableStatement('tmp', sub)
  //   }

  //   const key = tmp ? tmpI : sub
  //   const condition = ts.createBinary(
  //     key,
  //     ts.SyntaxKind.ExclamationEqualsToken,
  //     ts.createNull()
  //   );
  //   const r = ts.createParen(ts.createConditional(
  //     condition,
  //     key,
  //     i === subList.length - 1
  //       ? ts.createIdentifier('undefined')
  //       : createIf333(subList, i + 1)))

  //   return tmp ? createTmpCall(
  //     ([tmp]).concat([
  //       ts.createReturn(r)
  //     ] as any)
  //   ) : r
  // }
  return AstUtils.createWhenToDoForEach(argList)
}
