import * as ts from 'typescript'

export namespace AstUtils {
  /**
   * 创建简单变量行
   * @param name 名称
   * @param value 表达式
   */
  export function createVariableStatement(name: string, value: ts.Expression) {
    return ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ConstKeyword)], [ts.createVariableDeclaration(name, undefined, value)]);
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
   * 
   * @param expressList 
   * @param i 
   */
  export function createWhenToDoForEach(
    expressList: ts.NodeArray<ts.Expression>,
    when: ((tmpDeclare: ts.Identifier) => ts.Expression) = createIsNotNull,
    whenTrue: ((e: ts.Expression) => ts.Statement) = ((e) => ts.createReturn(e)),
    leftReturn: boolean = true
  ) {
    const block: ts.Statement[] = [];
    const tmpDeclare = ts.createIdentifier('tmp');
    expressList.forEach((sub, index, list) => {
      if (block.length === 0) {
        // 初始化临时变量
        block.push(createVariableStatement('tmp', sub));
      } else {
        // 再度赋值
        block.push(
          ts.createExpressionStatement(ts.createBinary(tmpDeclare, ts.SyntaxKind.EqualsToken, sub))
        );
      }

      // 创建条件判断
      const condition = when(tmpDeclare)
      if (index === list.length - 1) {
        // 最后一项时直接用三元判断
        block.push(
          whenTrue(createConditional(condition, tmpDeclare))
        );
      }
      else {
        block.push(
          ts.createIf(condition, ts.createBlock([
            leftReturn ? ts.createReturn(tmpDeclare) : whenTrue(tmpDeclare)
          ]))
        );
      }
    });
    return createArrowCall(block);
  }
}
