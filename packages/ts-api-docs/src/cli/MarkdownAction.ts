// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { BaseAction } from './BaseAction';
import { MarkdownDocumenter } from '../documenters/MarkdownDocumenter';
import { ApiModel } from '@microsoft/api-extractor-model';

export class MarkdownAction extends BaseAction {
  constructor(public inputFolder: string, public outputFolder: string) {
    super(inputFolder, outputFolder)
  }
  public onExecute(projectFolder?: string): Promise<void> { // override
    console.error(this.inputFolder, this.outputFolder)
    const apiModel: ApiModel = this.buildApiModel();

    const markdownDocumenter: MarkdownDocumenter = new MarkdownDocumenter(apiModel, projectFolder, undefined);
    markdownDocumenter.generateFiles(this.outputFolder);
    return Promise.resolve();
  }
}
