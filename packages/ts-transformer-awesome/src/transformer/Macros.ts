import * as ts from "typescript";
import map from './MacrosMap';
import { AstUtils$$ } from './AstUtils';
import fs from 'fs-extra';
import path from 'path';
import { TSOCAny } from 'ts-optchain';
class Transformer {
  rootMacros: Map<string, ts.FunctionExpression> = map as any;
  typeChecker: ts.TypeChecker | undefined;
  constructor(public context: ts.TransformationContext, public program: ts.Program) {
    this.typeChecker = program.getTypeChecker();
  }
  transform(node: ts.Node): ts.Node {
    return ts.visitNode(
      ts.visitNode(node, this.extractMacros),
      this.resolveMacros
    );
  }
  extractMacros = (node: ts.Node): ts.Node | undefined => {
    if (ts.isVariableStatement(node)) {
      const matched = node.declarationList.declarations.find((target: ts.VariableDeclaration) => {
        return target.initializer &&
          ts.isCallExpression(target.initializer) &&
          ts.isIdentifier(target.initializer.expression) &&
          target.initializer.expression.text === "MACRO";
      });
      if (
        matched &&
        matched.initializer &&
        ts.isCallExpression(matched.initializer) &&
        ts.isIdentifier(matched.initializer.expression) &&
        matched.initializer.expression.text === "MACRO"
      ) {
        const name = matched.name;
        if (!ts.isIdentifier(name)) {
          throw new Error(
            "Expected name to be Identifier for macro declaration"
          );
        }
        const value = matched.initializer.arguments[0];
        this.rootMacros.set(name.text, value as ts.FunctionExpression);
        // console.log('read macros', name.text);
        return undefined;
      }
    }
    return ts.visitEachChild(node, this.extractMacros, this.context);
  };
  resolveMacros = (node: ts.Node): ts.Node | undefined => {
    if (ts.isBlock(node) || ts.isSourceFile(node)) {
      const newBlock = this.replaceMacros(node.statements, this.rootMacros);
      if (ts.isBlock(node)) {
        return ts.visitEachChild(
          ts.updateBlock(node, newBlock),
          this.resolveMacros,
          this.context
        );
      } else {
        return ts.visitEachChild(
          ts.updateSourceFileNode(node, newBlock),
          this.resolveMacros,
          this.context
        );
      }
    }
    return ts.visitEachChild(node, this.resolveMacros, this.context);
  };

  /**
   * 
   * @param node 遍历的节点
   * @param outerName 外部引入的变量名
   */
  cleanMacro = <T extends ts.Node>(node: T, outerName: Set<string>): [ts.Expression | undefined, T] => {
    const visit = (node: ts.Node): ts.Node | undefined => {
      if (ts.isReturnStatement(node)) {
        if (!node.expression) throw new Error("Expected macro to return value");
        result = ts.visitNode(node.expression, visit);
        return undefined;
      }
      if (ts.isPropertyAccessExpression(node)) {
        return ts.createPropertyAccess(
          ts.visitNode(node.expression, visit),
          node.name
        );
      }
      if (node.getSourceFile() && ts.isNumericLiteral(node)) {
        return ts.createNumericLiteral(node.getText());
      }
      if (node.getSourceFile() && ts.isStringLiteral(node)) {
        return ts.createStringLiteral(node.getText().replace(/('|")/g, ''));
      }
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
        // console.error(node.name.text, ts.isTypeReferenceNode(node.name))
        variableMap.set(
          node.name.text,
          outerName.has(node.name.text) ? node.name : ts.createUniqueName(node.name.text) as any
        );
      } 
      if (ts.isIdentifier(node) && variableMap.has(node.text)) {
        return variableMap.get(node.text)!;
      }
      return ts.visitEachChild(node, visit, this.context);
    };
    const variableMap = new Map<string, ts.Identifier>();
    let result: ts.Expression | undefined = undefined;
    const resultNode = ts.visitNode(node, visit);
    return [result, resultNode];
  };

  /**
   * 是否为Macros函数节点
   */
  checkNode = (node: ts.Node) => {
    var r: ts.Type | undefined;
    if (ts.isCallExpression(node)) {
      r = this.typeChecker?.getTypeAtLocation(node.expression);
      // console.log(this.program.getRootFileNames())
    } else if (ts.isImportSpecifier(node)) {
      if (!this.rootMacros.has(node.name.escapedText as string)) {
        try {
          const moduleRef = node?.parent?.parent?.parent?.moduleSpecifier?.getText();
          if (moduleRef && /.macro/.test(moduleRef)) {  
            const filePath = path.join(path.dirname(node.getSourceFile()?.fileName), moduleRef?.replace(/('|")/g, ''));
            // console.log(this.program.getSourceFileByPath(node.getSourceFile()?.fileName as any), filePath);
            // this.program.emit(undefined, this.context.add
            // const sourceFile = node.getSourceFile();
            // ts.updateSourceFileNode(sourceFile, ) 
            const append = ts.createSourceFile(
              filePath,
              fs.readFileSync(filePath + '.ts').toString(),
              this.program.getCompilerOptions().target,
              true,
              ts.ScriptKind.TS
            );
            if (append) {
              // console.log(append?.getText());
              this.extractMacros(append);
              return this.rootMacros.has(node.name.escapedText as string);
            }
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        return true;
      }
    }
    return AstUtils$$.isValidType(
      this.typeChecker?.typeToTypeNode(this.typeChecker?.getTypeAtLocation(node)),
      'MacroFunction'
    );
  };
  replaceMacros = (
    statements: ts.NodeArray<ts.Statement>,
    macros: Map<string, ts.Expression>,
    appendStatments?: Set<ts.VariableStatement>
  ): ts.Statement[] => {
    const visit = (node: ts.Node): ts.Node => {
      if (
        [
          ts.SyntaxKind.InterfaceDeclaration,
          ts.SyntaxKind.PropertySignature
        ].includes(node.kind)
      ) {
        return node;
      }

      const importReplacer = AstUtils$$.checkAndfilterNamedImports(node, importNode => {
        return !this.checkNode(importNode);
      });
      if (importReplacer !== false) {
        return importReplacer;
      }
      if (ts.isBlock(node)) {
        return ts.createBlock(this.replaceMacros(node.statements, macros, appendStatments));
      }
      if (ts.isIdentifier(node) && macros.has(node.text)) {
        return macros.get(node.text)!;
      }

      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        macros.has(node.expression.name.text)
      ) {
        // if (this.checkNode(node)) {
        //   console.log('isValidType');
        // }
        return ts.visitNode(
          ts.updateCall(node, node.expression.name, node.typeArguments, [
            node.expression.expression,
            ...node.arguments
          ]),
          visit
        );
      }
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        macros.has(node.expression.text)
      ) {
        const value = macros.get(node.expression.text)!;
        if (!ts.isArrowFunction(value) && !ts.isFunctionExpression(value)) {
          throw new Error("Expected function expression for macro value");
        }
        appendStatments = new Set(appendStatments ? Array.from(appendStatments) : []);
        // 外部引用的变量名称集
        const outerArgNameReferenceSet = new Set<string>()
        // const ArgMap
        const newMacros = new Map([
          ...macros.entries(),
          ...getNameValueMap(node.arguments, value.parameters, appendStatments, outerArgNameReferenceSet).entries()
        ]);
        const [resultName, resultBlock] = this.cleanMacro(
          ts.visitNode(
            ts.createBlock(this.replaceMacros(getStatements(value), newMacros)),
            visit
          ),
          outerArgNameReferenceSet
        );
        result = result.concat(Array.from(appendStatments)).concat(resultBlock.statements);
        appendStatments.clear();
        if (!resultName) return ts.createIdentifier("");
        return resultName;
      }
      return ts.visitEachChild(node, visit, this.context);
    };
    let result: ts.Statement[] = [];
    for (const statement of statements) {
      const newStatement = ts.visitNode(statement, visit);
      result.push(newStatement);
    }
    return result;
  };
}

const transformer = (
  _program?: ts.Program
): ts.TransformerFactory<any> => context => {
  return node => {
    return new Transformer(context, _program!).transform(node);
  };
};

function getStatements(
  node: ts.FunctionExpression | ts.ArrowFunction
): ts.NodeArray<ts.Statement> {
  if (ts.isBlock(node.body)) {
    return node.body.statements;
  }
  return ts.createNodeArray([ts.createReturn(node.body)]);
}

/**
 * 
 * @param values 传值定义序列
 * @param args 参数定义序列
 * @param appendStatments 要在顶部追加的行
 * @param referenceName 外部引入名称
 */
function getNameValueMap(
  values: ts.NodeArray<ts.Expression>,
  args: ts.NodeArray<ts.ParameterDeclaration>,
  appendStatments: Set<ts.VariableStatement>,
  referenceName: Set<string>
) {
  const map = new Map<string, ts.Expression>();
  const definedArgs: [ts.Identifier, ts.Expression][] = [];
  for (let i = 0; i < args.length && i < args.length; i++) {
    const argName = args[i].name;
    const valuedArg = values[i];
    if (!ts.isIdentifier(argName)) {
      throw new Error("Expected identifier in macro function definition");
    }
    const argValue = valuedArg || ts.createIdentifier('');
    if (
      valuedArg
      //@ts-ignore
        && !(ts.isIdentifier(valuedArg))
        && (
          ts.isCallExpression(valuedArg)
          || ts.isCallLikeExpression(valuedArg)
          || ts.isObjectLiteralExpression(valuedArg)
          || ts.isArrayLiteralExpression(valuedArg)
          || ts.isCallOrNewExpression(valuedArg)
          || ts.isCallChain(valuedArg)
          || ts.isPropertyAccessExpression(valuedArg)
        )
    ) {
      const tmp = ts.createUniqueName(argName.text)
      definedArgs.push([tmp, argValue]);
      //@ts-ignore
      map.set(argName.text, tmp);
    } else {
      if (valuedArg && ts.isIdentifier(valuedArg)) {
        referenceName.add(valuedArg.text)
      }
      //@ts-ignore
      map.set(argName.text, argValue);
    }
  }
  if (definedArgs.length > 0) {
    appendStatments.add(
      AstUtils$$.createMultipleVariableStatement$$(definedArgs)
    );
  }
  return map;
}

export default transformer;
