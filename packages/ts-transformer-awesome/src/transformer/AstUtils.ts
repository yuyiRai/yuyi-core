import * as ts from 'typescript'
import trim from 'lodash/trim'
import { tmpdir } from 'os';

export namespace AstUtils {
  /**
   * 创建简单变量行
   * @param name 名称
   * @param value 表达式
   */
  export function createVariableStatement(name: string, value: ts.Expression) {
    return ts.createVariableStatement([
      ts.createToken(ts.SyntaxKind.ConstKeyword)
    ], [
      ts.createVariableDeclaration(name, undefined, value)
    ]);
  }

  /**
   * 创建是否为null的判断语句
   * @param sub
   */
  export function createIsNotNull(sub: ts.Expression, strict: boolean = true) {
    return createIsNot(sub, ts.createNull(), strict);
  }

  /**
   * 创建是否为XXX的判断语句
   * @param sub
   * @param target 
   */
  export function createIsNot(sub: ts.Expression, target: ts.Expression = ts.createIdentifier('undefined'), strict: boolean = true) {
    const { ExclamationEqualsToken, ExclamationEqualsEqualsToken } = ts.SyntaxKind
    return ts.createBinary(
      sub,
      strict ? ExclamationEqualsEqualsToken : ExclamationEqualsToken,
      target
    );
  }

  /**
   * 创建简单的匿名函数闭包调用
   * @param line - 闭包行
   * @param isCall - 是否立即调用
   */
  export function createArrowCall(line: ts.Statement[], isCall = true) {
    const func = ts.createParen(ts.createArrowFunction([], [], [], ts.createLiteralTypeNode(ts.createLiteral('any')), ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createBlock(line, true)));
    return isCall ? ts.createCall(func, [], []) : func;
  }

  /**
   * 创建三元运算符节点
   * @param express - 判断语句
   * @param whenTrue - 当为真
   * @param whenFalse - 当为false(默认值为undefined)
   */
  export function createConditional(express: ts.Expression, whenTrue: ts.Expression, whenFalse?: ts.Expression) {
    // tslint:disable-next-line: deprecation
    return ts.createConditional(express, whenTrue, whenFalse || ts.createIdentifier('undefined'));
  }

  /**
   * 根据字符串创建ast语法树
   * @param input 
   * @param node 节点信息获取
   */
  export function createAstFromString(input: string, node: ts.Node) {
    return ts.createSourceFile('temp.ts', input, node.getSourceFile().languageVersion).statements
  }


  /**
   * 创建连续的三元判断运算
   * @param source 元素表达式集合
   * @param when 条件表达式
   */
  export function createConditionalChainsFromExpression(
    source: ts.Expression[],
    when: ((tmpDeclare: ts.Identifier) => ts.Expression) = createIsNotNull,
    finalValue?: ts.Expression
  ) {
    let sub = finalValue || source.pop() as ts.Expression
    while (source.length > 0) {
      const a = source.pop() as ts.Identifier || ts.createIdentifier('undefined')
      // console.log(ts.isLiteralExpression(a), a.getFullText())
      const prev: ts.Identifier = ts.createParen(a) as any
      sub = createConditional(when(prev), prev, ts.createParen(sub))
      // console.log(sub.getFullText());
    }
    return sub
  }

  export function createIfReturn(
    expression: ts.Expression,
    when: ((tmpDeclare: ts.Expression) => ts.Expression) = createIsNotNull,
    whenTrue: ((e: ts.Expression) => ts.Statement) = ts.createReturn
  ) {
    return ts.createIf(
      when(expression),
      whenTrue(expression)
    )
  }

  const simpleRegexExpression = /^((?!([+-/\\()]^%))\S)+$/
  /**
   * 
   * @param expressList 
   * @param when 
   * @param whenTrue 加入解析式为true
   * @param leftReturn 
   */
  export function createWhenToDoForEach(
    expressList: ts.NodeArray<ts.Expression>,
    when: ((tmpDeclare: ts.Expression) => ts.Expression) = createIsNotNull,
    whenTrue: ((e: ts.Expression) => ts.Statement) = ((e) => ts.createReturn(e))
  ) {
    const block: ts.Statement[] = [];
    const tmpValName = '_$tmp'
    const tmpDeclare = ts.createIdentifier(tmpValName);
    let constExpression: ts.Expression[] = []
    for (let index = 0; index < expressList.length; index++) {
      let sub = expressList[index]
      const list = expressList;
      const text = trim(sub.getFullText())
      /** 已经进入了函数化模式 */
      let isBlockDeclare = block.length > 0
      const isLast = index === list.length - 1
      // console.log(text);
      // 如果是简单字面量or变量
      const isSimpleDeclare = simpleRegexExpression.test(text)
      if (isSimpleDeclare) {
        constExpression.push(sub)
        if (constExpression.length > 1 && constExpression.length === list.length) // 全都是简单定义的话直接返回一个三元链
          return createConditionalChainsFromExpression(constExpression, when)
        else if (!isLast) { // 直到第一次进入块模式前跳过下面的步骤
          continue
        }
      } else if (constExpression.length > 0) {
        sub = createConditionalChainsFromExpression(constExpression, when, sub)
        if (isLast) {
          constExpression.push(tmpDeclare)
        }
      }
      if (!isBlockDeclare) {
        // 初始化临时变量
        block.push(createVariableStatement(tmpValName, sub));
      } else if (!isSimpleDeclare) {
        // 再度赋值
        block.push(
          ts.createExpressionStatement(ts.createBinary(tmpDeclare, ts.SyntaxKind.EqualsToken, sub))
        );
      }

      if (isLast) {
        // 最后一项时直接用三元判断
        block.push(
          ts.createReturn(
            createConditionalChainsFromExpression(
              constExpression, when, ts.createIdentifier('undefined')
            )
          )
        );
      } else {
        block.push(
          createIfReturn(tmpDeclare, when, whenTrue)
        );
      }
    }
    return createArrowCall(block)
  }
}
