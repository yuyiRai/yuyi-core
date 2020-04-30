import { ApiItemKind as ApiItemKindImport, ExcerptTokenKind as ExcerptTokenKindImport } from '@microsoft/api-extractor-model'

import { NewlineKind as NewlineKindImport } from '@rushstack/node-core-library';
enum ApiItemKindHack {
  CallSignature = "CallSignature",
  Class = "Class",
  Constructor = "Constructor",
  ConstructSignature = "ConstructSignature",
  EntryPoint = "EntryPoint",
  Enum = "Enum",
  EnumMember = "EnumMember",
  Function = "Function",
  IndexSignature = "IndexSignature",
  Interface = "Interface",
  Method = "Method",
  MethodSignature = "MethodSignature",
  Model = "Model",
  Namespace = "Namespace",
  Package = "Package",
  Property = "Property",
  PropertySignature = "PropertySignature",
  TypeAlias = "TypeAlias",
  Variable = "Variable",
  None = "None"
}

enum ExcerptTokenKindHack {
  /**
   * Generic text without any special properties
   */
  Content = "Content",
  /**
   * A reference to an API declaration
   */
  Reference = "Reference"
}
export enum DocNodeKind {
  Block = "Block",
  BlockTag = "BlockTag",
  Excerpt = "Excerpt",
  FencedCode = "FencedCode",
  CodeSpan = "CodeSpan",
  Comment = "Comment",
  DeclarationReference = "DeclarationReference",
  ErrorText = "ErrorText",
  EscapedText = "EscapedText",
  HtmlAttribute = "HtmlAttribute",
  HtmlEndTag = "HtmlEndTag",
  HtmlStartTag = "HtmlStartTag",
  InheritDocTag = "InheritDocTag",
  InlineTag = "InlineTag",
  LinkTag = "LinkTag",
  MemberIdentifier = "MemberIdentifier",
  MemberReference = "MemberReference",
  MemberSelector = "MemberSelector",
  MemberSymbol = "MemberSymbol",
  Paragraph = "Paragraph",
  ParamBlock = "ParamBlock",
  ParamCollection = "ParamCollection",
  PlainText = "PlainText",
  Section = "Section",
  SoftBreak = "SoftBreak"
}
enum NewlineKindHack {
  /**
   * Windows-style newlines
   */
  CrLf = "\r\n",
  /**
   * POSIX-style newlines
   *
   * @remarks
   * POSIX is a registered trademark of the Institute of Electrical and Electronic Engineers, Inc.
   */
  Lf = "\n",
  /**
   * Default newline type for this operating system (`os.EOL`).
   */
  OsDefault = "os"
}

export const NewlineKind: typeof NewlineKindImport = NewlineKindHack as any;
export const ApiItemKind: typeof ApiItemKindImport = ApiItemKindHack as any;
export const ExcerptTokenKind: typeof ExcerptTokenKindImport = ExcerptTokenKindHack as any;
