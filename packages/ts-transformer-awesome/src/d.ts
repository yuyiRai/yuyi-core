declare module 'ts-optchain/transform' {
  import ts from "typescript";
  export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile>
}
declare module 'require-context' {
  export default function require(dir: string, s: boolean, reg: RegExp): { keys(): string[] }
}

