import ts from 'typescript';

export default new Map<string, {
  [key: string]: ts.FunctionExpression;
}>()
