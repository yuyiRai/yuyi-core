import ts from 'typescript';
import { AstUtils$$ } from './AstUtils';
import { castArray } from 'lodash'

export type TransformStore = {
  needImport?: boolean;
  blockRollup?: (params: any[], replacedBlockStatments: ts.Statement[], sourceBlockStatments: ts.Statement[]) => ts.Statement[]
  [key: string]: any;
}
export type TransformHooks = TransformStore & {
  next: ts.Node;
  preLine?: ts.Statement[] | undefined;
  afterLine?: ts.Statement[] | undefined;
  parentHooks?: AstUtils$$.UpdateHook[] | undefined;
  rollupParams?: any
};
export function createVisitNodeAndChildren(
  visitNode: (node: ts.Node, program: ts.Program, context: ts.TransformationContext) => TransformHooks,
  config: TransformStore = {}
) {
  return function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): TransformHooks {
    const { next, needImport, preLine = [], afterLine = [], parentHooks = [], rollupParams = [] } = visitNode(node, program, context);
    if (needImport && !config.needImport) {
      config.needImport = true;
    }
    let childrenPreLines: typeof preLine = [];
    let childrenAfterLines: typeof preLine = [];
    let childrenParentHooks: typeof parentHooks = [];
    let childrenRollupParams: any[] = [];
    let nextNodeAndChildren: ts.Node = ts.visitEachChild(next, (childNode) => {
      const {
        next,
        preLine: childrenPreLine,
        afterLine: childrenAfterLine,
        rollupParams: childrenRollupParam,
        parentHooks: childrenParentHook
      } = visitNodeAndChildren(childNode, program, context);
      if (childrenRollupParam) {
        childrenRollupParams.push(...childrenRollupParam)
      }
      if (childrenPreLine) {
        childrenPreLines.push(...childrenPreLine);
      }
      if (childrenAfterLine) {
        childrenAfterLines.push(...childrenAfterLine);
      }
      if (childrenParentHook) {
        childrenParentHooks.push(...childrenParentHook);
      }
      return next;
    }, context) as ts.SourceFile;
    const updated = updateBlock(node, (sourceStatements, replacedStatements) => {
      const childrenHooksResult = ([
        ...childrenPreLines,
        ...sourceStatements.reduce((r, statement, index) => {
          let result: ts.Node[] | null = [replacedStatements[index]];
          childrenParentHooks = childrenParentHooks.filter(hook => {
            if (hook instanceof Function) {
              const replaced = hook(statement, replacedStatements[index] as any, childrenRollupParams);
              if (replaced) {
                result = replaced;
                return false;
              }
              return true;
            }
            return false;
          });
          return result ? r.concat(result) : r;
        }, [] as ts.Node[]),
        ...childrenAfterLines
      ]) as ts.Statement[];
      return childrenRollupParams.length > 0 && config.blockRollup ? config.blockRollup(childrenRollupParams, childrenHooksResult, sourceStatements) : childrenHooksResult
    }, nextNodeAndChildren);
    if (!updated) {
      preLine.push(...childrenPreLines);
      afterLine.push(...childrenAfterLines);
      rollupParams.push(...childrenRollupParams)
    }
    parentHooks.push(...childrenParentHooks);
    return {
      next: updated || nextNodeAndChildren,
      preLine,
      afterLine,
      parentHooks,
      rollupParams
    };
  }
}

export function insertArrayBefore<T extends ts.Node>(statements: T[] | ts.NodeArray<T>, expect: (node: T) => boolean, insert: T[] | ts.NodeArray<T>) {
  const before = [], after = [];
  for (const statement of statements) {
    after.length > 0 || expect(statement) ? after.push(statement) : before.push(statement);
  }
  return before.concat(insert).concat(after);
}

export function insertArrayAfter<T extends ts.Node>(statements: T[] | ts.NodeArray<T>, expect: (node: T) => boolean, insert: T[] | ts.NodeArray<T>) {
  var before = [], after = [], catched = false
  for (const statement of statements) {
    after.length > 0 || catched ? after.push(statement) : before.push(statement);
    expect(statement) && (catched = true);
  }
  return before.concat(insert).concat(after);
}

function castNodeArray(t: any): any[] | ts.NodeArray<ts.Node> {
  return t.length && t.reduce ? t : [t]
}

export function catchArrayTodo<T extends ts.Node>(statements: T[] | ts.NodeArray<T>, expect: (node: T, index: number) => T | T[] | false) {
  var tmp: any;
  // @ts-ignore
  return statements.reduce((r: T[], node, i) => [
    ...r,
    // @ts-ignore
    ...castNodeArray((tmp = expect(node, i)) ? tmp : node)
  ], [] as T[]) as T[];
}


export function insertBeforeReturnStatement(statements: ts.Statement[] | ts.NodeArray<ts.Statement>, insert: ts.Statement[] | ts.NodeArray<ts.Statement>) {
  return insertArrayBefore(statements, ts.isReturnStatement, insert)
}

export function updateBlock(node: ts.Node, hook: (statements: ts.Statement[], statements2: ts.Statement[]) => ts.Statement[], replaced = node, beforeReturn = true) {
  if (ts.isBlock(node) && ts.isBlock(replaced)) {
    return ts.updateBlock(node, hook(
      [...node.statements], [...replaced.statements]
    ));
  } else if (ts.isSourceFile(node) && ts.isSourceFile(replaced)) {
    return ts.updateSourceFileNode(node,
      hook([...node.statements], [...replaced.statements])
    );
  }
  return false;
}
export function mapChildren(children: ts.NodeArray<any> | ts.Node[], times = 1) {
  const r = [] as any[];
  if (times !== 0) {
    for (const c of children) {
      r.push(mapChildren(c.getChildren(), times - 1));
    }
  }
  else {
    for (const c of children) {
      r.push(c.getText());
    }
  }
  return r;
}
