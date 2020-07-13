import fs from 'fs-extra';
import path from 'path';
import * as ts from "typescript";
import { resolveMsgFactroy } from '../resolveMsg';
import { AstUtils$$ } from './AstUtils';
import colors from 'colors';
import map from './MacrosMap';

function isMacroFile(fileName: string) {
  return /(\.tsmacro)/.test(fileName);
}
class Transformer {
  rootMacros: Map<string, ts.Expression> = map as any;
  typeChecker: ts.TypeChecker | undefined;
  sourceFile: ts.SourceFile;

  contextMacros: Map<string, ts.Expression> = new Map();

  constructor(public context: ts.TransformationContext, public program: ts.Program) {
    this.typeChecker = program.getTypeChecker();

  }
  transform(node: ts.Node): ts.Node {
    this.sourceFile = node.getSourceFile();
    return ts.visitNode(
      // isMacroFile(this.sourceFile.fileName) ?
      ts.visitNode(node, this.extractMacros)
      // : node,
      , this.resolveMacros
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
        this.putRootMacroMap(this.rootMacros, name.text, value);
        // console.log('read macros', name.text);
        return undefined;
      }
    }
    return ts.visitEachChild(node, this.extractMacros, this.context);
  };

  /**
   * 记录macros等缓存
   * @param macros 
   * @param key 
   * @param value 
   */
  putRootMacroMap(macros: Transformer['rootMacros'], key: string, value: ts.Expression) {
    AstUtils$$.setSourceFile(value, this.sourceFile);
    this.contextMacros.set(key, value);
    // const source = (macros.get(key) || {})
    // if (!source[this.sourceFile.fileName]) {
    //   resolveMsgFactroy(() => [
    //     `tsMacro [${key}]:`,
    //     `extract from`,
    //     `"${path.relative(process.cwd(), this.sourceFile.fileName)}"`
    //   ]);
    // }
    return macros.set(key, value)
    // return macros.set(key, {
    //   ...source,
    //   [this.sourceFile.fileName]: value as ts.FunctionExpression
    // });
  }
  /**
   * 记录macros等缓存
   * @param macros 
   * @param key 
   * @param value 
   */
  putMacroMap(macros: Map<string, ts.Expression>, key: string, value: ts.Expression) {
    AstUtils$$.setSourceFile(value, this.sourceFile);
    return macros.set(key, value);
  }

  resolveMacros = (node: ts.Node): ts.Node | undefined => {
    if (ts.isBlock(node) || ts.isSourceFile(node)) {
      const newBlock = this.replaceMacros(node.statements, this.contextMacros);
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
   * 遍历清理多余的return语句
   * @param node 遍历的节点
   * @param outerName 外部引入的变量名
   */
  cleanMacro = <T extends ts.Node>(node: T, outerName: Set<string>): [ts.Expression | undefined, T] => {
    const visit = (node: ts.Node): ts.Node | undefined => {
      // 保留内部的临时function的完整定义
      if ((ts.isArrowFunction(node) || ts.isFunctionExpression(node))) {
        return node;
      }
      //@ts-ignore
      if (ts.isReturnStatement(node)) {
        if (node.expression) (result = ts.visitNode(node.expression, visit));
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

  appendContext(nodeName: string, filePath: string) {
    if (!this.contextMacros.has(nodeName)) {
      // const macroFunc = (this.rootMacros.get(nodeName) || {})[filePath];
      const macroFunc = this.rootMacros.get(nodeName);
      macroFunc && this.contextMacros.set(nodeName, macroFunc);
      // if (macroFunc)
      //   resolveMsgFactroy(() => [
      //     `tsMacro [${nodeName}]:`,
      //     `resolve ${colors.yellow(`"${path.relative(process.cwd(), this.sourceFile.fileName)}"`)}, source from`,
      //     `${colors.yellow(`"${path.relative(process.cwd(), filePath)}"`)}`
      //   ], false);
      // console.error(nodeName, filePath, Object.keys((this.rootMacros.get(nodeName) || {})));
    }
  }

  /**
   * 是否为Macros函数节点
   */
  checkNode = (node: ts.Node) => {
    var r: ts.Type | undefined;
    if (ts.isCallExpression(node)) {
      r = this.typeChecker?.getTypeAtLocation(node.expression);
      // console.log(this.program.getRootFileNames())
    } else if (ts.isImportSpecifier(node)) {
      const moduleRef = node?.parent?.parent?.parent?.moduleSpecifier?.getText();
      const filePath = moduleRef && (
        path.join(
          path.dirname(node.getSourceFile()?.fileName),
          "/",
          moduleRef.replace(/('|")/g, '')
        )
      ).replace(new RegExp(`\\${path.sep}`, 'g'), "/") + '.ts';

      const nodeName = node.name.escapedText as string;
      if (filePath && isMacroFile(filePath)) {
        // console.error(nodeName)
        if (!this.rootMacros.has(nodeName)) {
          try {
            const append = ts.createSourceFile(
              filePath,
              fs.readFileSync(filePath).toString(),
              this.program.getCompilerOptions().target,
              true,
              ts.ScriptKind.TS
            );
            if (append) {
              // console.log(append?.getText());
              this.extractMacros(append);
              this.appendContext(nodeName, filePath);
              return this.rootMacros.has(nodeName);
            }
          } catch (error) {
            console.error(error);
          }
          return false
        }
        this.appendContext(nodeName, filePath);
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
    appendStatments?: Set<ts.VariableStatement>,
    sourceMacros?: ts.FunctionExpression | ts.ArrowFunction
  ): ts.Statement[] => {
    const visit = (node: ts.Node): ts.Node => {
      // 检查导入节点，收集上下文的Macro函数
      const importReplacer = AstUtils$$.checkAndfilterNamedImports(node, importNode => {
        return !this.checkNode(importNode);
      });
      if (importReplacer !== false) {
        return node;
      }
      if (
        [
          ts.SyntaxKind.InterfaceDeclaration,
          ts.SyntaxKind.PropertySignature
        ].includes(node.kind)
      ) {
        return node;
      }

      if (ts.isBlock(node)) {
        return ts.createBlock(this.replaceMacros(node.statements, macros, appendStatments, sourceMacros));
      }
      if (ts.isIdentifier(node) && macros.has(node.text)) {
        const target = macros.get(node.text)!;
        return target;
      }

      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        macros.has(node.expression.name.text)
      ) {
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
        // console.error([...this.contextMacros.keys()], node.expression.text);
        const value = macros.get(node.expression.text)!;
        if (!ts.isArrowFunction(value) && !ts.isFunctionExpression(value)) {
          throw new Error("Expected function expression for macro value");
        }
        const childrenAppendStatments = new Set([]);

        // 外部引用的变量名称集
        const outerArgNameReferenceSet = new Set<string>();
        // const ArgMap
        const newMacros = new Map([
          ...macros.entries(),
          ...this.getNameValueMap(node.arguments, value.parameters, childrenAppendStatments, outerArgNameReferenceSet).entries()
        ]);
        const [resultName, resultBlock] = this.cleanMacro(
          ts.visitNode(
            ts.createBlock(this.replaceMacros(getStatements(value), newMacros, appendStatments, value)),
            visit
          ),
          outerArgNameReferenceSet
        );
        result = result.concat(Array.from(childrenAppendStatments)).concat(resultBlock.statements);
        childrenAppendStatments.clear();
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


  /**
   * 
   * @param values 传值定义序列
   * @param args 参数定义序列
   * @param appendStatments 要在顶部追加的行
   * @param referenceName 外部引入名称
   */
  getNameValueMap(
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
        const tmp = ts.createUniqueName(argName.text);
        definedArgs.push([tmp, argValue]);
        //@ts-ignore
        this.putMacroMap(map, argName.text, tmp);
      } else {
        if (valuedArg && ts.isIdentifier(valuedArg)) {
          referenceName.add(valuedArg.text);
        }
        //@ts-ignore
        this.putMacroMap(map, argName.text, argValue);
      }
    }
    if (definedArgs.length > 0) {
      appendStatments.add(
        AstUtils$$.createMultipleVariableStatement$$(definedArgs)
      );
    }
    return map;
  }
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
    // console.error(node.body.getFullText(node.getSourceFile()))
    return ts.createNodeArray(
      node.body.statements.map(child => AstUtils$$.setSourceFile(child, node.getSourceFile()))
    );
  }
  return ts.createNodeArray([ts.createReturn(node.body)]);
}


export default transformer;
