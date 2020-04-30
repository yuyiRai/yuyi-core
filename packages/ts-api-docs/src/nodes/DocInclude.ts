// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
  IDocNodeParameters,
  DocNode,
  DocSection
} from '@microsoft/tsdoc';
import { CustomDocNodeKind } from './CustomDocNodeKind';


/**
 * Represents a note box, which is typically displayed as a bordered box containing informational text.
 */
export class DocIncludeSnippet extends DocNode {
  public readonly content: DocSection;

  public constructor(parameters: IDocNodeParameters, sectionChildNodes?: ReadonlyArray<DocNode>) {
    super(parameters);
    this.content = new DocSection({ configuration: this.configuration }, sectionChildNodes);
  }

  /** @override */
  public get kind(): string {
    return CustomDocNodeKind.IncludeSnippet;
  }

  /** @override */
  protected onGetChildNodes(): ReadonlyArray<DocNode | undefined> {
    return [this.content];
  }
}
