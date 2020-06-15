import ts from 'typescript'
class Transformer {
  typeChecker: ts.TypeChecker;
  constructor(public context: ts.TransformationContext, public program: ts.Program) {
    this.typeChecker = program.getTypeChecker();
  }
  transform(node: ts.Node): ts.Node {
    if (ts.isIdentifier(node) && node.escapedText === '__DEV__') {
      node = ts.createFalse()
    }
    return ts.visitEachChild(node, this.transform, this.context);
  }
}

export const transformer = (
  _program?: ts.Program
): ts.TransformerFactory<any> => context => {
  return node => {
    return new Transformer(context, _program!).transform(node);
  };
};
