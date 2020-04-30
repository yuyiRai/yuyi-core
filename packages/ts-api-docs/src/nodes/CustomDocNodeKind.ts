import { TSDocConfiguration } from '@microsoft/tsdoc';
import { DocEmphasisSpan } from './DocEmphasisSpan';
import { DocHeading } from './DocHeading';
import { DocNoteBox } from './DocNoteBox';
import { DocIncludeSnippet } from './DocInclude';
import { DocTable } from './DocTable';
import { DocTableCell } from './DocTableCell';
import { DocTableRow } from './DocTableRow';

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

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * Identifies custom subclasses of {@link DocNode}.
 */
export const enum CustomDocNodeKind {
  EmphasisSpan                  = 'EmphasisSpan',
  Heading                       = 'Heading',
  NoteBox                       = 'NoteBox',
  Table                         = 'Table',
  TableCell                     = 'TableCell',
  TableRow                      = 'TableRow',
  IncludeSnippet                = 'IncludeSnippet'
}

export class CustomDocNodes {
  private static _configuration: TSDocConfiguration | undefined;

  public static get configuration(): TSDocConfiguration {
    if (CustomDocNodes._configuration === undefined) {
      const configuration: TSDocConfiguration = new TSDocConfiguration();

      configuration.docNodeManager.registerDocNodes('@micrososft/api-documenter', [
        { docNodeKind: CustomDocNodeKind.EmphasisSpan, constructor: DocEmphasisSpan },
        { docNodeKind: CustomDocNodeKind.Heading, constructor: DocHeading },
        { docNodeKind: CustomDocNodeKind.IncludeSnippet, constructor: DocIncludeSnippet },
        { docNodeKind: CustomDocNodeKind.NoteBox, constructor: DocNoteBox },
        { docNodeKind: CustomDocNodeKind.Table, constructor: DocTable },
        { docNodeKind: CustomDocNodeKind.TableCell, constructor: DocTableCell },
        { docNodeKind: CustomDocNodeKind.TableRow, constructor: DocTableRow }
      ]);

      configuration.docNodeManager.registerAllowableChildren(CustomDocNodeKind.EmphasisSpan, [
        CustomDocNodeKind.IncludeSnippet,
        DocNodeKind.PlainText,
        DocNodeKind.SoftBreak
      ]);

      configuration.docNodeManager.registerAllowableChildren(DocNodeKind.Section, [
        CustomDocNodeKind.IncludeSnippet,
        CustomDocNodeKind.Heading,
        CustomDocNodeKind.NoteBox,
        CustomDocNodeKind.Table
      ]);

      configuration.docNodeManager.registerAllowableChildren(DocNodeKind.Paragraph, [
        CustomDocNodeKind.EmphasisSpan
      ]);
      const taf = {
        tagName: '@includeSnippet',
        tagNameWithUpperCase: '@INCLUDESNIPPET',
        syntaxKind: 0,
        standardization: 'Core' as any,
        allowMultiple: false
      }
      configuration.addTagDefinitions([taf], true)
      CustomDocNodes._configuration = configuration;
      configuration.setSupportForTag(taf, true)
      console.log(configuration.tagDefinitions)
    }
    return CustomDocNodes._configuration;
  }
}
