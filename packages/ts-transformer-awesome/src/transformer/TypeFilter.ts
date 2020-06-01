/**
 * Copyright (C) 2019-present, Rimeto, LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import * as kind from 'ts-is-kind';
import '../../env'
import ts from 'typescript';
import { AstUtils$$ } from './AstUtils';
import { createVisitNodeAndChildren } from './visitNodeAndChildren';

const FUNCTION_SYMBOL = 'FilterFunction';

const config = {
  needImport: false,
  needClear: [] as any[],
  needImports: new Set(),
  repeatTimes: 0
}

function getImportName(node: ts.Node) {
  if (ts.isIdentifier(node)) {
    config.needImports.add(node.escapedText)
  } else if (ts.isCallExpression(node)) {
    ts.isIdentifier(node.expression) && config.needImports.add(node.expression.escapedText)
  }
  return node
}

function isNeedClear(node: ts.Node) {
  return node.getSourceFile() && config.needClear.includes(node.getText())
}

export default function (program: ts.Program): ts.TransformerFactory<ts.Node> {
  return (context) => (file) => {
    config.needImport = false
    config.needClear = []

    let { next } = createVisitNodeAndChildren(visitNode, config)(file, program, context)
    if (config.needImports.size > 0) {
      if (__DEV__)
        console.log(config.needImports)
      AstUtils$$.createVariableStatement$$('')
    }
    return next;
  };
}

// export function visitImportNode(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.NamedImports | ts.Node {
//   return ts.visitEachChild(node, (node) => {
//     if (kind.isImportClause(node)) {
//       // console.log('isImportClause', node.getText());
//       return visitImportNode(node, program, context)
//     } else if (kind.isNamedImports(node)) {
//       // console.log('isNamedImports', node.getText());
//       return ts.updateNamedImports(node, node.elements.filter(i => !isNeedClear(i)))
//     }
//     return node
//   }, context)
// }

function visitNode(node: ts.Node, program: ts.Program, context: ts.TransformationContext): {
  next: ts.Node,
  needImport?: boolean,
  preLine?: ts.Statement[],
  afterLine?: ts.Statement[],
  parentHooks?: AstUtils$$.UpdateHook[]
} {

  const typeChecker = program.getTypeChecker();
  if (ts.isCallExpression(node)) {
    // Check if function call expression is an filter, e.g.,
    // 判断是否为合法的Filter调用节点
    if (_isValidType(typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node.expression)))) {
      const [typed] = ts.isCallExpression(node) && node.typeArguments || []
      const escapedText = node.getText()
      // getImportName(node)
      if (__DEV__)
        console.log('escapedText', escapedText, typed && typed.getFullText(), typed && ts.isFunctionOrConstructorTypeNode(typed));

      const isExpected = AstUtils$$.expectParentStatement$$(node, undefined, function (node): node is ts.Statement {
        return ts.isExpressionStatement(node) || ts.isReturnStatement(node) || ts.isVariableStatement(node)
      });
      const [returnNode, preLine = [], afterLine = []] = expandExpression(node.arguments, typed && typed.getFullText() as keyof typeof typedUtils || undefined)
      // 添加单行注释
      return { next: returnNode, needImport: true, parentHooks: [
        (sourceNode: ts.Node, replaceNode = node) => {
          if (isExpected(sourceNode)) { // 相同的源
            if (__DEV__)
              console.log('checked', node.getText())
            return [
              ...preLine, 
              ts.addSyntheticTrailingComment(// 添加注释
                replaceNode, 
                ts.SyntaxKind.SingleLineCommentTrivia, " " + node.getText() + "\n"
              ),
              ...afterLine
            ]
          }
          return false
        }
      ] };
    } else if (node.arguments.length) {
      // Check for a naked oc(x) call
      const callTypeNode = typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node));
      if (_isValidType(callTypeNode)) {
        // Unwrap oc(x) -> x
        return { next: node.arguments[0] };
      }
    }
  }
  // else if (
  //     ts.isIdentifier(node) && node.parent
  //       && (
  //         ts.isBinaryExpression(node.parent) && node.parent.right === node
  //         || ts.isReturnStatement(node.parent) && node.parent.expression === node
  //       )
  //   ) {
  //   const expressionTypeNode = typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node));
  //   if (_isValidType(expressionTypeNode)) {
  //     getImportName(node)
  //   }
  // }
  // else if (ts.isPropertyAssignment(node)) {
  //   const expressionTypeNode = typeChecker.typeToTypeNode(typeChecker.getTypeAtLocation(node));
  //   if (_isValidType(expressionTypeNode)) {
  //     console.log('isPropertyAssignment', node.getText())
  //     return {
  //       next: ts.updatePropertyAssignment(node, node.name, AstUtils.createArrowCall([], false)),
  //       needImport: false
  //     }
  //   }
  // } 
  return { next: node };
}

function _isValidType(node: any): node is ts.CallExpression {
  return AstUtils$$.isValidType(node, FUNCTION_SYMBOL)
}

const typedUtils = {
  nil: undefined,
  number(node: ts.Expression) {
    return AstUtils$$.createTypeof$$(node, ts.createStringLiteral('number'))
  },
  string(node: ts.Expression) {
    return AstUtils$$.createTypeof$$(node, ts.createStringLiteral('string'))
  },
  function(node: ts.Expression) {
    return AstUtils$$.createTypeof$$(node, ts.createStringLiteral('function'))
  }
}
/**
 * 展开函数参数为闭包立即调用
 * @param argList 参数节点数组
 */
function expandExpression(
  argList: ts.NodeArray<ts.Expression>,
  type: keyof typeof typedUtils = 'nil'
): AstUtils$$.UpdateNodeResults {
  if (argList.length === 0) {
    return [ts.createIdentifier('undefined')]
  }
  return AstUtils$$.createWhenToDoForEach$$(argList, typedUtils[type])
}
