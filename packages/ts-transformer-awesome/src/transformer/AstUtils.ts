import ts, { Expression, Identifier } from 'typescript';
import { castArray } from 'lodash'
export namespace AstUtils$$ {

  /**
   * 创建简单变量行
   * @param name 名称
   * @param value 表达式
   */
  export function createVariableStatement$$(name: string | ts.Identifier | ts.ObjectBindingPattern | ts.ArrayBindingPattern, value?: ts.Expression, isLet = false, preModifier: ts.Modifier[] | ts.ModifiersArray = []) {
    return ts.createVariableStatement([
      ...preModifier,
      ts.createToken((!isLet ? ts.SyntaxKind.ConstKeyword : ts.SyntaxKind.LetKeyword) as any)
    ], [
      ts.createVariableDeclaration(name, undefined, value)
    ]);
  }

  /**
   * 创建是否为null的判断语句
   * @param sub
   */
  export function createIsNotNil$$(sub: ts.Expression, strict: boolean = false) {
    return createIsNot$$(sub, ts.createNull(), strict);
  }

  /**
   * 创建是否为XXX的判断语句
   * @param sub
   * @param target 
   */
  export function createSetVar$$(sub: ts.Identifier, target: ts.Expression = ts.createIdentifier('undefined')) {
    const { EqualsToken } = ts.SyntaxKind;
    return ts.createExpressionStatement(ts.createBinary(
      sub,
      EqualsToken,
      target
    ));
  }
  /**
   * 创建是否为XXX的判断语句
   * @param sub
   * @param target 
   */
  export function createIsNot$$(sub: ts.Expression, target: ts.Expression = ts.createIdentifier('undefined'), strict: boolean = true) {
    const { ExclamationEqualsToken, ExclamationEqualsEqualsToken } = ts.SyntaxKind;
    return ts.createBinary(
      sub,
      strict ? ExclamationEqualsEqualsToken : ExclamationEqualsToken,
      target
    );
  }

  export const visitEachChild: typeof ts.visitEachChild = (node, visitor, context) => {
    return ts.isEmptyStatement(node) ? node : ts.visitEachChild(node, visitor, context)
  }

  export function createIs$$(sub: ts.Expression, target: ts.Expression, strict: boolean = true) {
    return ts.createBinary(
      sub,
      strict ? ts.SyntaxKind.EqualsEqualsEqualsToken : ts.SyntaxKind.EqualsEqualsToken,
      target
    )
  }

  /**
   * 创建typeof xx === target的判断语句
   * @param sub
   * @param target 
   */
  export function createTypeof$$(sub: ts.Expression, target: ts.StringLiteral = ts.createStringLiteral('object')) {
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
  export function createArrowCall$$(line: ts.Statement[], isCall = true) {
    const func = ts.createParen(ts.createArrowFunction([], [], [], ts.createLiteralTypeNode(ts.createLiteral('any')), ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createBlock(line, true)));
    return isCall ? ts.createCall(func, [], []) : func;
  }

  /**
   * 创建三元运算符节点
   * @param express - 判断语句
   * @param whenTrue - 当为真
   * @param whenFalse - 当为false(默认值为undefined)
   */
  export function createConditional$$(express: ts.Expression, whenTrue: ts.Expression, whenFalse?: ts.Expression) {
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
  export function createAstFromString$$(input: string) {
    // console.log(ts.createSourceFile('temp.ts', input, ts.ScriptTarget.ES5).getFullText())
    return ts.createSourceFile('', input, ts.ScriptTarget.ES5, true, ts.ScriptKind.TS).statements
  }
  /**
   * 根据字符串创建ast语法树
   * @param input 
   * @param node 节点信息获取
   */
  export function createAstExpressionFromString$$(input: string) {
    // console.log(ts.createSourceFile('temp.ts', input, ts.ScriptTarget.ES5).getFullText())
    return (ts.createSourceFile('', input, ts.ScriptTarget.ES5, true, ts.ScriptKind.TS).statements[0] as ts.ExpressionStatement).expression;
  }


  export function isSimpleDeclareOrLiteral$$(target: ts.Node) {
    return ts.isLiteralExpression(target) || ts.isIdentifier(target) || ts.isToken(target)
  }

  /**
   * 创建连续的三元判断运算
   * @param source 元素表达式集合
   * @param when 条件表达式
   */
  export function createConditionalChainsFromExpression$$(
    source: ts.Expression[],
    when: ((tmpDeclare: ts.Identifier) => ts.Expression) = createIsNotNil$$,
    latestValue?: ts.Expression,
    resultTransformer: (expr: ts.Expression) => ts.Expression = expr => expr,
    conditionalFunction = createConditional$$
  ) {
    let sub = latestValue || source.pop() as ts.Expression
    while (source.length > 0) {
      const a = source.pop() as ts.Identifier;
      // console.log(ts.isLiteralExpression(a) || ts.isIdentifier(a), a.getFullText());
      const prev: ts.Identifier = a && isSimpleDeclareOrLiteral$$(a) ? a : ts.createParen(a) as any
      sub = conditionalFunction(when(prev), resultTransformer(prev), ts.createParen(sub))
      // console.log(sub.getFullText());
    }
    return sub
  }
  /**
   * 创建while判断运算
   * @param source 元素表达式集合
   * @param when 条件表达式
   */
  export function createWhileFromExpressions$$(
    source: ts.Expression[],
    when: ((tmpDeclare: ts.Identifier | ts.Expression) => ts.Expression) = createIsNotNil$$,
    latestValue: ts.Expression = source.pop() as ts.Expression,
    resultTransformer: (
      expr: ts.Expression
    ) => ts.Statement = ts.createExpressionStatement,
    createIdentifier = ts.createIdentifier,
    hasSpread = source.some(i => ts.isSpreadElement(i))
  ) {
    const tmpArrDeclare = createIdentifier('tempArr')
    const tmpResultDeclare = createIdentifier('tempResult')
    const tmpLengthDeclare = createIdentifier('tempLength')
    const tmpIndexDeclare = createIdentifier('tempIndex')
    const tmpResult = createVariableStatement$$(tmpResultDeclare)
    const tmpArr = createVariableStatement$$(tmpArrDeclare, ts.createArrayLiteral(source))
    const tmpLength = createVariableStatement$$(tmpLengthDeclare,
      hasSpread 
      ? ts.createPropertyAccess(tmpArrDeclare, 'length')
      : ts.createNumericLiteral(
        source.length + ''
      )
    )
    const tmpIndex = createVariableStatement$$(tmpIndexDeclare, ts.createNumericLiteral('0'))
    const todo: ts.Statement[] = [
      ts.createIf(
        when(ts.createParen(ts.createBinary(
          tmpResultDeclare,
          ts.SyntaxKind.EqualsToken,
          ts.createElementAccess(tmpArrDeclare, ts.createPostfixIncrement(tmpIndexDeclare))
        ))),
        ts.createBreak()
      )
    ]
    return [
      tmpArr,
      tmpLength,
      tmpIndex,
      tmpResult,
      ts.createWhile(
        ts.createBinary(tmpIndexDeclare, ts.SyntaxKind.LessThanToken, tmpLengthDeclare),
        ts.createBlock(todo)
      ),
      resultTransformer(createConditional$$(when(tmpResultDeclare), tmpResultDeclare, latestValue))
    ]
  }
  /**
   * 创建连续的if else判断运算
   * @param source 元素表达式集合
   * @param when 条件表达式
   */
  export function createIfElseChainsFromExpression$$(
    source: ts.Expression[],
    when: ((tmpDeclare: ts.Identifier) => ts.Expression) = createIsNotNil$$,
    latestValue: ts.Expression = source.pop() as ts.Expression,
    resultTransformer: (expr: ts.Expression) => ts.Statement = ts.createExpressionStatement,
    ifelseFunction = ts.createIf
  ) {
    let sub: ts.Statement = ts.createExpressionStatement(latestValue)
    const result: ts.Statement[] = []
    while (source.length > 0) {
      const a = source.pop() as ts.Identifier;
      // console.log(ts.isLiteralExpression(a) || ts.isIdentifier(a), a.getFullText());
      const prev: ts.Identifier = a && isSimpleDeclareOrLiteral$$(a) ? a : ts.createParen(a) as any
      sub = ifelseFunction(
        when(prev),
        resultTransformer(prev),
        sub
      )
      // console.log(sub.getFullText());
    }
    result.unshift(sub)
    return result
  }

  export function createIfReturn$$(
    expression: ts.Expression,
    when: ((tmpDeclare: ts.Expression) => ts.Expression) = createIsNotNil$$,
    whenTrue: ((e: ts.Expression) => ts.Statement) = ts.createReturn
  ) {
    return ts.createIf(
      when(expression),
      whenTrue(expression)
    )
  }

  // const simpleRegexExpression = /^((?!([+-/\\()]^%))\S)+$/

  export function getUpperBlock$$(node: ts.Node) {
    let p = node.parent;
    while (p) {
      if (ts.isBlock(p) || ts.isModuleBlock(p)) {
        break
      }
      p = p.parent
    }
    return p as ts.Block
  }

  export function getUpperObjectDeclare$$(node: ts.Node) {
    let p = node.parent;
    while (p) {
      if (ts.isObjectLiteralExpression(p)) {
        break
      }
      p = p.parent
    }
    return p as ts.ObjectLiteralExpression
  }

  let flag = 0
  const expectMap = new Map<ts.Node, any>()


  export function updateObjectPropertyAssignment$$(
    node: ts.VariableStatement,
    expect: (node: ts.PropertyAssignment) => ts.Expression | false
  ) {
    return ts.updateVariableStatement(
      node, undefined, ts.updateVariableDeclarationList(
        node.declarationList,
        node.declarationList.declarations.map(de => {
          return ts.updateVariableDeclaration(de, de.name, de.type,
            de.initializer && ts.isObjectLiteralExpression(de.initializer)
              ? ts.updateObjectLiteral(de.initializer, de.initializer.properties.map(property => {
                if (ts.isPropertyAssignment(property)) {
                  const replacer = expect(property)
                  return replacer
                    ? ts.updatePropertyAssignment(property, property!.name!, replacer)
                    : property
                }
                return property
              }))
              : de.initializer
          )
        })
      )
    )
  }

  /**
   * 记录源文件的行节点，返回一个捕获是否为已记录的行节点的函数
   * @param source 搜寻的起始源节点
   * @param value 
   * @param expect 判断是否为需要的节点，不满足条件则向上搜寻
   */
  export function expectParentStatement$$(source: ts.Node, value: any = ++flag, expect: (node: ts.Node) => node is ts.Statement = ts.isExpressionStatement) {
    let node = source.parent;
    while (node) {
      if (expect(node)) {
        // const text = node.flags
        // if (text) {
        // console.log('expect', text, value)
        expectMap.set(node, value)
        // }
        break
      }
      node = node.parent
    }
    return (node: ts.Node) => {
      return expectMap.has(node) && expectMap.get(node) === value
    }
  }

  /**
   * 创建变量赋值行
   * @param identifier 
   * @param expression 
   */
  export function createSetVariableStatement$$(identifier: ts.Identifier, expression?: ts.Expression | ts.Identifier) {
    return ts.createExpressionStatement(ts.createBinary(identifier, ts.SyntaxKind.EqualsToken, expression || ts.createIdentifier('undefined')))
  }
  /**
   * 
   * @param expressList 
   * @param when 
   * @param whenTrue 加入解析式为true
   * @param leftReturn 
   */
  export function createWhenToDoForEach$$(
    expressList: ts.NodeArray<ts.Expression>,
    when: ((tmpDeclare: ts.Expression) => ts.Expression) = createIsNotNil$$,
    whenTrue: ((e: ts.Expression) => ts.Statement) = ((e) => ts.createReturn(e))
  ): UpdateNodeResults {
    const block: ts.Statement[] = [];
    const tmpDeclare = ts.getGeneratedNameForNode(expressList[0] && expressList[0].parent || expressList[0]);
    
    const simpleExpression: ts.Expression[] = []
    const multipleExpressions: ts.Expression[] = []
    const tmpFlag = ++flag
    return [
      tmpDeclare,
      [
        createVariableStatement$$(tmpDeclare, ts.createIdentifier('undefined')),
        ...createWhileFromExpressions$$(
          [...expressList],
          when,
          ts.createIdentifier('undefined'),
          (expr) => createSetVariableStatement$$(tmpDeclare, expr),
          name => ts.createIdentifier(`_${name}_${tmpFlag}`)
        )
      ]
    ]
    
    for (let index = 0; index < expressList.length; index++) {
      let sub = expressList[index]
      const list = expressList;
      // const text = trim(sub.getFullText())
      /** 已经进入了函数化模式 */
      let isBlockDeclare = block.length > 0
      const isLast = index === list.length - 1
      // console.log(text);
      // 如果是简单字面量or变量
      const isSimpleDeclare = isSimpleDeclareOrLiteral$$(sub)
      if (isSimpleDeclare) {
        simpleExpression.push(sub)
        if (simpleExpression.length > 0 && simpleExpression.length === list.length) // 全都是简单定义的话直接返回一个三元链
          return [
            createConditionalChainsFromExpression$$(simpleExpression, when, ts.createIdentifier('undefined'))
          ]
        else if (!isLast) { // 直到第一次进入块模式前跳过下面的步骤
          continue
        }
      }
       else if (simpleExpression.length > 0) {
        sub = createConditionalChainsFromExpression$$(simpleExpression, when, sub)
        if (isLast) {
          simpleExpression.push(tmpDeclare)
        }
      } 
      else {
        multipleExpressions.push(sub)
        if (multipleExpressions.length > 0 && multipleExpressions.length === list.length) // 全都是简单定义的话直接返回一个三元链
          return [
            tmpDeclare,
            createIfElseChainsFromExpression$$(multipleExpressions, when, ts.createIdentifier('undefined'))
          ]
        else if (!isLast) { // 直到第一次进入块模式前跳过下面的步骤
          continue
        }
      }

      if (!isBlockDeclare) {
        // 初始化临时变量
        block.push(createVariableStatement$$(tmpDeclare, sub));
      } else if (!isSimpleDeclare) {
        // 再度赋值
        block.push(
          createSetVariableStatement$$(tmpDeclare, sub)
        );
      }

      if (isLast) {
        // 最后一项时直接用三元判断
        block.push(
          createSetVariableStatement$$(
            tmpDeclare,
            createConditionalChainsFromExpression$$(
              simpleExpression, when, ts.createIdentifier('undefined')
            )
          )
        );
      } else {
        block.push(
          createIfReturn$$(tmpDeclare, when, whenTrue)
        );
      }
    }
    return [tmpDeclare, block]
  }

  export function useName(name: string | ts.Identifier): ts.Identifier;
  export function useName(name?: string | ts.Identifier): ts.Identifier | undefined;
  export function useName(name: string | ts.Identifier | undefined): ts.Identifier | undefined {
    return typeof name === 'string' ? ts.createIdentifier(name) : name
  }
  export function useNameOrExpression(name: string | ts.Identifier | ts.CallExpression): ts.Identifier | ts.CallExpression;
  export function useNameOrExpression(name: string | ts.Identifier | ts.CallExpression | undefined): ts.Identifier | ts.CallExpression | undefined;
  export function useNameOrExpression(name: string | ts.Identifier | ts.CallExpression | undefined): ts.Identifier | ts.CallExpression | undefined {
    return typeof name === 'string' ? ts.createIdentifier(name) : name;
  }

  export function createNamedImports(moduleName: string, importNames: (string | ts.Identifier | [ts.Identifier, ts.Identifier])[]) {
    return ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined /** ？？ **/,
        ts.createNamedImports(
          importNames.map(names => {
            const [name, asName = undefined] = castArray(names);
            const nameIdent = useName(name)
            return ts.createImportSpecifier(useName(asName) /** 别名**/, nameIdent)
          })
        )
      ),
      ts.createStringLiteral(moduleName)
    )
  }

  //@ts-ignore
  export function isValidType(node: ts.TypeNode | undefined, typeName: string): node is ts.CallExpression {
    if (!node) {
      return false;
    }

    // 交叉/联合类型时进行递归检查
    if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
      return node.types.some((n) => isValidType(n, typeName));
    }

    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
      if (node.typeName.escapedText === typeName) {
        return true;
      }
    }

    return false;
  }

  /**
   * 检查并过滤特定的命名导入
   * @param node 
   * @param check 
   * @returns
   * 如果不为导入语句则不处理，返回false
   * 如果被过滤后的命名导入内容为空集，且没有默认导入语句，将直接返回一个空Statement
   * 否则返回经过过滤后的导入Statement
   */
  export function checkAndfilterNamedImports(node: ts.Node, check: (named: ts.ImportSpecifier, index?: number, names?: readonly ts.ImportSpecifier[]) => boolean): ts.ImportDeclaration | ts.EmptyStatement | false {
    if (ts.isImportDeclaration(node) && node.importClause && node.importClause.namedBindings) {
      var binds: ts.NamedImportBindings | undefined = node.importClause.namedBindings;
      if (ts.isNamedImports(binds)) {
        const nextElements = binds.elements.filter(check);
        if (nextElements.length === 0) {
          if (!node.importClause.name) {
            return ts.createEmptyStatement();
          } else {
            binds = undefined;
          }
        } else {
          binds = ts.updateNamedImports(binds, nextElements);
        }
      }
      return ts.updateImportDeclaration(
        node,
        node.decorators,
        node.modifiers,
        ts.updateImportClause(
          node.importClause,
          node.importClause.name,
          binds
        ),
        node.moduleSpecifier
      );
    }
    return false;
  }
  /**
   * 
   * @param expressList 
   * @param when 
   * @param whenTrue 加入解析式为true
   * @param leftReturn 
   */
  export function createWhenToReturnConditional$$(
    expressList: ts.NodeArray<ts.Expression>,
    when: ((tmpDeclare: ts.Expression) => ts.Expression) = createIsNotNil$$
  ) {
    let isSimple = true
    // const name = '_$tmp_' + flag++
    const tmpDeclare = ts.getGeneratedNameForNode(expressList[0] && expressList[0].parent || expressList[0]);
    const last = ts.createIdentifier('undefined')
    const batchList = expressList.map(expr => {
      if (isSimpleDeclareOrLiteral$$(expr)) {
        return expr
      }
      isSimple = false
      /**
       * ((_$tmp = (a && 1 || 0 + 2)) || 1) && _$tmp) != null
       * 类似这样的语法结构可以在行内进行缓存计算值&判断是否符合要求&返回计算值
       */
      return ts.createParen(ts.createBinary(tmpDeclare, ts.SyntaxKind.EqualsToken, ts.createParen(expr)))
      // /**
      //  * ((_$tmp = (a && 1 || 0 + 2)) || 1) && _$tmp) != null
      //  * 类似这样的语法结构可以在行内进行缓存计算值&判断是否符合要求&返回计算值
      //  */
      // return ts.createBinary(
      //   ts.createBinary(
      //     // $a = x
      //     ts.createBinary(tmpDeclare, ts.SyntaxKind.EqualsToken, ts.createParen(expr)),
      //     ts.SyntaxKind.BarBarToken,
      //     ts.createLiteral(1)
      //   ), // ($a = x || 1) 防止x为false
      //   ts.SyntaxKind.AmpersandAmpersandToken, // &&标识符
      //   tmpDeclare
      // )
    })
    if (isSimple) {
      return [createConditionalChainsFromExpression$$(batchList, when, last)] as UpdateNodeResults
    } else {
      const block: ts.Statement[] = [];
      const r = createConditionalChainsFromExpression$$(
        batchList,
        when,
        last,
        expr => isSimpleDeclareOrLiteral$$(expr) ? expr : tmpDeclare as ts.Identifier
      )
      if (tmpDeclare) {
        block.push(
          createVariableStatement$$(tmpDeclare)
          // ts.createExpressionStatement(
          //   createAstExpressionFromString(`&&`)
          // )
        )
      }
      return [r, block] as UpdateNodeResults
    }
  }

  export function createObjectWithDeclare(obj: Record<string, string | Expression | Identifier>) {
    return createObjectWithEntries(Object.entries(obj))
  }
  export function createObjectWithEntries(entries: [string, string | Expression | Identifier][], stringKey = false) {
    return ts.createObjectLiteral(entries.map(([key, value]: [string, string | Expression | Identifier]) => {
      return ts.createPropertyAssignment(stringKey ? ts.createStringLiteral(key) : key, typeof value === 'string' ? ts.createIdentifier(value) : value);
    }));
  }

  export type UpdateNodeResults = [ts.Expression, ts.Statement[]?, ts.Statement[]?]
  export type UpdateHook = (sourceNode: ts.Node, replaceNode: ts.Node, rollupParams?: any[]) => ts.Node[] | false


  /**
   * 抽取类装饰器
   * @param node 类定义节点
   * @param decortor 装饰器（名称或者表达式）
   * @param appendParams 装饰器方法首个参数必定为类自身，通过此追加参数
   * @param placeholderName 如果是无名类，提供默认名称
   */
  export function extractClassCallExpression(
    node: ts.ClassDeclaration,
    decortor: string | ts.Identifier | ts.CallExpression,
    appendParams: any[],
    placeholderName?: string | ts.Identifier
  ) {
    const modifiers = node.modifiers;
    const classT = ts.createClassExpression(undefined, node.name, node.typeParameters, node.heritageClauses, node.members);
    return createVariableStatement$$(
      node.name || useName(placeholderName) || ts.createIdentifier('tmp'),
      ts.createCall(useNameOrExpression(decortor), undefined, [
        classT,
        ...appendParams
      ]),
      false,
      modifiers
    );
  }
}
