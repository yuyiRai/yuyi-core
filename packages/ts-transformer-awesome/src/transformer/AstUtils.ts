import * as ts from 'typescript'
import trim from 'lodash/trim'
import { tmpdir } from 'os';

export namespace AstUtils {
  /**
   * 创建简单变量行
   * @param name 名称
   * @param value 表达式
   */
  export function createVariableStatement(name: string, value?: ts.Expression) {
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
  export function createIsNotNil(sub: ts.Expression, strict: boolean = false) {
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
   * 创建typeof xx === target的判断语句
   * @param sub
   * @param target 
   */
  export function createTypeof(sub: ts.Expression, target: ts.StringLiteral = ts.createStringLiteral('object')) {
    const { EqualsEqualsEqualsToken } = ts.SyntaxKind
    return ts.createBinary(
      ts.createTypeOf(sub),
      EqualsEqualsEqualsToken,
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
    return ts.createConditional(
      express,
      ts.createToken(ts.SyntaxKind.QuestionToken),
      whenTrue,
      ts.createToken(ts.SyntaxKind.ColonToken),
      whenFalse || ts.createIdentifier('undefined')
    )
  }

  /**
   * 根据字符串创建ast语法树
   * @param input 
   * @param node 节点信息获取
   */
  export function createAstFromString(input: string) {
    // console.log(ts.createSourceFile('temp.ts', input, ts.ScriptTarget.ES5).getFullText())
    return ts.createSourceFile('', input, ts.ScriptTarget.ES5, true, ts.ScriptKind.TS).statements
  }
  /**
   * 根据字符串创建ast语法树
   * @param input 
   * @param node 节点信息获取
   */
  export function createAstExpressionFromString(input: string) {
    // console.log(ts.createSourceFile('temp.ts', input, ts.ScriptTarget.ES5).getFullText())
    return (ts.createSourceFile('', input, ts.ScriptTarget.ES5, true, ts.ScriptKind.TS).statements[0] as ts.ExpressionStatement).expression;
  }


  export function isSimpleDeclareOrLiteral(target: ts.Node) {
    return ts.isLiteralExpression(target) || ts.isIdentifier(target)
  }
  /**
   * 创建连续的三元判断运算
   * @param source 元素表达式集合
   * @param when 条件表达式
   */
  export function createConditionalChainsFromExpression(
    source: ts.Expression[],
    when: ((tmpDeclare: ts.Identifier) => ts.Expression) = createIsNotNil,
    undefinedValue?: ts.Expression,
    whenTrue: (expr: ts.Expression) => ts.Expression = expr => expr
  ) {
    let sub = undefinedValue || source.pop() as ts.Expression
    while (source.length > 0) {
      const a = source.pop() as ts.Identifier || ts.createIdentifier('undefined');

      // console.log(ts.isLiteralExpression(a) || ts.isIdentifier(a), a.getFullText());

      const prev: ts.Identifier = isSimpleDeclareOrLiteral(a) && a || ts.createParen(a) as any

      sub = createConditional(when(prev), whenTrue(prev), ts.createParen(sub))
      // console.log(sub.getFullText());
    }
    return sub
  }

  export function createIfReturn(
    expression: ts.Expression,
    when: ((tmpDeclare: ts.Expression) => ts.Expression) = createIsNotNil,
    whenTrue: ((e: ts.Expression) => ts.Statement) = ts.createReturn
  ) {
    return ts.createIf(
      when(expression),
      whenTrue(expression)
    )
  }

  // const simpleRegexExpression = /^((?!([+-/\\()]^%))\S)+$/
  /**
   * 
   * @param expressList 
   * @param when 
   * @param whenTrue 加入解析式为true
   * @param leftReturn 
   */
  export function createWhenToDoForEach(
    expressList: ts.NodeArray<ts.Expression>,
    when: ((tmpDeclare: ts.Expression) => ts.Expression) = createIsNotNil,
    whenTrue: ((e: ts.Expression) => ts.Statement) = ((e) => ts.createReturn(e))
  ) {
    // const block: ts.Statement[] = [];
    // const tmpValName = '_$tmp'
    // const tmpDeclare = ts.createIdentifier(tmpValName);
    // let constExpression: ts.Expression[] = []
    // for (let index = 0; index < expressList.length; index++) {
    //   let sub = expressList[index]
    //   const list = expressList;
    //   // const text = trim(sub.getFullText())
    //   /** 已经进入了函数化模式 */
    //   let isBlockDeclare = block.length > 0
    //   const isLast = index === list.length - 1
    //   // console.log(text);
    //   // 如果是简单字面量or变量
    //   const isSimpleDeclare = isSimpleDeclareOrLiteral(sub)
    //   if (isSimpleDeclare) {
    //     constExpression.push(sub)
    //     if (constExpression.length > 1 && constExpression.length === list.length) // 全都是简单定义的话直接返回一个三元链
    //       return createConditionalChainsFromExpression(constExpression, when)
    //     else if (!isLast) { // 直到第一次进入块模式前跳过下面的步骤
    //       continue
    //     }
    //   } else if (constExpression.length > 0) {
    //     sub = createConditionalChainsFromExpression(constExpression, when, sub)
    //     if (isLast) {
    //       constExpression.push(tmpDeclare)
    //     }
    //   }
    //   if (!isBlockDeclare) {
    //     // 初始化临时变量
    //     block.push(createVariableStatement(tmpValName, sub));
    //   } else if (!isSimpleDeclare) {
    //     // 再度赋值
    //     block.push(
    //       ts.createExpressionStatement(ts.createBinary(tmpDeclare, ts.SyntaxKind.EqualsToken, sub))
    //     );
    //   }

    //   if (isLast) {
    //     // 最后一项时直接用三元判断
    //     block.push(
    //       ts.createReturn(
    //         createConditionalChainsFromExpression(
    //           constExpression, when, ts.createIdentifier('undefined')
    //         )
    //       )
    //     );
    //   } else {
    //     block.push(
    //       createIfReturn(tmpDeclare, when, whenTrue)
    //     );
    //   }
    // }
    let isSimple = true
    const tmpValName = '_$tmp'
    const tmpDeclare = ts.createIdentifier(tmpValName);
    const last = ts.createIdentifier('undefined')
    const batchList = expressList.map(expr => {
      if (isSimpleDeclareOrLiteral(expr)) {
        return expr
      }
      isSimple = false
      /**
       * ((_$tmp = (a && 1 || 0 + 2)) || 1) && _$tmp) != null
       * 类似这样的语法结构可以在行内进行缓存计算值&判断是否符合要求&返回计算值
       */
      return ts.createBinary(
        ts.createBinary(
          // $a = x
          ts.createBinary(tmpDeclare, ts.SyntaxKind.EqualsToken, ts.createParen(expr)),
          ts.SyntaxKind.BarBarToken,
          ts.createLiteral(1)
        ), // ($a = x || 1) 防止x为false
        ts.SyntaxKind.AmpersandAmpersandToken, // &&标识符
        tmpDeclare
      )
    })
    if (isSimple) {
      return createConditionalChainsFromExpression(batchList, when, last)
    } else {
      const block: ts.Statement[] = [];
      block.push(
        createVariableStatement(tmpValName),
        whenTrue(
          createConditionalChainsFromExpression(
            batchList,
            when,
            last,
            expr => isSimpleDeclareOrLiteral(expr) ? expr : tmpDeclare
          )
        )
        // ts.createExpressionStatement(
        //   createAstExpressionFromString(`&&`)
        // )
      )
      return createArrowCall(block)
    }
  }
}
