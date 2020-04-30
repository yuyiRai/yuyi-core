// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { BaseAction } from './BaseAction';
import { ApiModel } from '@microsoft/api-extractor-model';
import { YamlDocumenter } from '../documenters/YamlDocumenter';

export class YamlAction extends BaseAction {

  protected onDefineParameters(): void { // override
    super.onDefineParameters();

  }

  public onExecute(): Promise<void> { // override
    console.error(this.inputFolder, this.outputFolder);
    const apiModel: ApiModel = this.buildApiModel();

    const markdownDocumenter: YamlDocumenter = new YamlDocumenter(apiModel, undefined);
    markdownDocumenter.generateFiles(this.outputFolder);
    return Promise.resolve();
  }
}
