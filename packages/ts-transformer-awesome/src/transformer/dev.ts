import ts from 'typescript'
import { AstUtils$$ } from './AstUtils';
class Transformer {
  typeChecker: ts.TypeChecker;
  constructor(public context: ts.TransformationContext, public program: ts.Program, public isDev: boolean) {
    this.typeChecker = program.getTypeChecker();
  }
  transform = (node: ts.Node): ts.Node => {
    if (ts.isIdentifier(node) && node.getText() === '__DEV__') {
      node = AstUtils$$.createIs$$(
        ts.createIdentifier('process.env.NODE_ENV'),
        ts.createStringLiteral("development")
      )
      return node;
    }
    return ts.visitEachChild(node, this.transform, this.context);
  }
}

export const transformer = (
  _program?: ts.Program,
  isDev?: boolean
): ts.TransformerFactory<any> => context => {
  return node => {
    return ts.visitNode(node, new Transformer(context, _program!, isDev).transform);
  };
};
