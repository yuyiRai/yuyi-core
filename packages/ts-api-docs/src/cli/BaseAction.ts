// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'path';
import * as tsdoc from '@microsoft/tsdoc';
import * as colors from 'colors';

import { FileSystem } from '@rushstack/node-core-library';
import {
  ApiModel,
  ApiItem,
  ApiItemContainerMixin,
  ApiDocumentedItem,
  IResolveDeclarationReferenceResult
} from '@microsoft/api-extractor-model';

export abstract class BaseAction {
  public constructor(protected inputFolder: string, protected outputFolder: string) {

  }

  protected onDefineParameters(): void { // override
  }

  public buildApiModel(): ApiModel {
    const apiModel: ApiModel = new ApiModel();
    if (!FileSystem.exists(this.inputFolder)) {
      throw new Error('The input folder does not exist: ' + this.inputFolder);
    }
    FileSystem.ensureFolder(this.outputFolder);

    for (const filename of FileSystem.readFolder(this.inputFolder)) {
      if (filename.match(/\.api\.json$/i)) {
        console.log(`Reading ${filename}`);
        const filenamePath: string = path.join(this.inputFolder, filename);
        apiModel.loadPackage(filenamePath);
      }
    }

    this._applyInheritDoc(apiModel, apiModel);

    return apiModel;
  }

  // TODO: This is a temporary workaround.  The long term plan is for API Extractor's DocCommentEnhancer
  // to apply all @inheritDoc tags before the .api.json file is written.
  // See DocCommentEnhancer._applyInheritDoc() for more info.
  private _applyInheritDoc(apiItem: ApiItem, apiModel: ApiModel): void {

    if (apiItem instanceof ApiDocumentedItem) {
      if (apiItem.tsdocComment) {
        const inheritDocTag: tsdoc.DocInheritDocTag | undefined = apiItem.tsdocComment.inheritDocTag;

        if (inheritDocTag && inheritDocTag.declarationReference) {
          // Attempt to resolve the declaration reference
          const result: IResolveDeclarationReferenceResult
            = apiModel.resolveDeclarationReference(inheritDocTag.declarationReference, apiItem);

          if (result.errorMessage) {
            console.log(colors.yellow(`Warning: Unresolved @inheritDoc tag for ${apiItem.displayName}: `
              + result.errorMessage));
          } else {
            if (result.resolvedApiItem instanceof ApiDocumentedItem
              && result.resolvedApiItem.tsdocComment
              && result.resolvedApiItem !== apiItem) {
              this._copyInheritedDocs(apiItem.tsdocComment, result.resolvedApiItem.tsdocComment);
            }
          }
        }

      }
    }

    // Recurse members
    if (ApiItemContainerMixin.isBaseClassOf(apiItem)) {
      for (const member of apiItem.members) {
        this._applyInheritDoc(member, apiModel);
      }
    }
  }

  /**
   * Copy the content from `sourceDocComment` to `targetDocComment`.
   * This code is borrowed from DocCommentEnhancer as a temporary workaround.
   */
  private _copyInheritedDocs(targetDocComment: tsdoc.DocComment, sourceDocComment: tsdoc.DocComment): void {
    targetDocComment.summarySection = sourceDocComment.summarySection;
    targetDocComment.remarksBlock = sourceDocComment.remarksBlock;

    targetDocComment.params.clear();
    for (const param of sourceDocComment.params) {
      targetDocComment.params.add(param);
    }
    for (const typeParam of sourceDocComment.typeParams) {
      targetDocComment.typeParams.add(typeParam);
    }
    targetDocComment.returnsBlock = sourceDocComment.returnsBlock;

    targetDocComment.inheritDocTag = undefined;
  }

}
