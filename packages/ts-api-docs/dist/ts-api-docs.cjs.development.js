'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs-extra'));
var gulp = require('gulp');
var utils = require('@yuyi919/utils');
var gulpAwesome = require('@yuyi919/gulp-awesome');
var path = require('path');
var path__default = _interopDefault(path);
require('glob');
var last = _interopDefault(require('lodash/last'));
var set = _interopDefault(require('lodash/set'));
var get = _interopDefault(require('lodash/get'));
var escapeRegExp = _interopDefault(require('lodash/escapeRegExp'));
var merge = _interopDefault(require('lodash/merge'));
var replace = _interopDefault(require('gulp-replace'));
var jeditor = _interopDefault(require('gulp-json-editor'));
var JSON5 = _interopDefault(require('json5'));
var convert = _interopDefault(require('gulp-convert'));
var colors = require('colors');
var colors__default = _interopDefault(colors);
var nodeCoreLibrary = require('@rushstack/node-core-library');
var apiExtractorModel = require('@microsoft/api-extractor-model');
var tsdoc = require('@microsoft/tsdoc');
var resolve$1 = require('resolve');

/**
 * Provides access to the documenter that is generating the output.
 *
 * @privateRemarks
 * This class is wrapper that provides access to the underlying MarkdownDocumenter, while hiding the implementation
 * details to ensure that the plugin API contract is stable.
 *
 * @public
 */
var MarkdownDocumenterAccessor =
/*#__PURE__*/
function () {
  /** @internal */
  function MarkdownDocumenterAccessor(implementation) {
    this._$$_implementation = implementation;
  }
  /**
   * For a given `ApiItem`, return its markdown hyperlink.
   *
   * @returns The hyperlink, or `undefined` if the `ApiItem` object does not have a hyperlink.
   */


  var _proto = MarkdownDocumenterAccessor.prototype;

  _proto.getLinkForApiItem = function getLinkForApiItem(apiItem) {
    return this._$$_implementation.getLinkForApiItem(apiItem);
  };

  return MarkdownDocumenterAccessor;
}();

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * This is an internal part of the plugin infrastructure.
 *
 * @remarks
 * This object is the constructor parameter for API Documenter plugin features.
 *
 * @public
 */
var PluginFeatureInitialization =
/** @internal */
function PluginFeatureInitialization() {};
/**
 * Context object for {@link PluginFeature}.
 * Exposes various services that can be used by a plugin.
 *
 * @public
 */

var PluginFeatureContext = function PluginFeatureContext() {};
/**
 * The abstract base class for all API Documenter plugin features.
 * @public
 */

var PluginFeature =
/*#__PURE__*/
function () {
  /**
   * The subclass should pass the `initialization` through to the base class.
   * Do not put custom initialization code in the constructor.  Instead perform your initialization in the
   * `onInitialized()` event function.
   * @internal
   */
  function PluginFeature(initialization) {
    // reserved for future expansion
    this.context = initialization._context;
  }
  /**
   * This event function is called after the feature is initialized, but before any processing occurs.
   * @virtual
   */


  var _proto = PluginFeature.prototype;

  _proto.onInitialized = function onInitialized() {};

  return PluginFeature;
}();

/**
 * Context object for {@link MarkdownDocumenterFeature}.
 * Exposes various services that can be used by a plugin.
 *
 * @public
 */

var MarkdownDocumenterFeatureContext =
/** @internal */
function MarkdownDocumenterFeatureContext(options) {
  this.apiModel = options.apiModel;
  this.outputFolder = options.outputFolder;
  this.documenter = options.documenter;
};
/**
 * Inherit from this base class to implement an API Documenter plugin feature that customizes
 * the generation of markdown output.
 *
 * @public
 */

var MarkdownDocumenterFeature =
/*#__PURE__*/
function (_PluginFeature) {
  _inheritsLoose(MarkdownDocumenterFeature, _PluginFeature);

  function MarkdownDocumenterFeature() {
    return _PluginFeature.apply(this, arguments) || this;
  }

  var _proto = MarkdownDocumenterFeature.prototype;

  /**
   * This event occurs before each markdown file is written.  It provides an opportunity to customize the
   * content of the file.
   * @virtual
   */
  _proto.onBeforeWritePage = function onBeforeWritePage(eventArgs) {}
  /**
   * This event occurs after all output files have been written.
   * @virtual
   */
  ;

  _proto.onFinished = function onFinished(eventArgs) {};

  return MarkdownDocumenterFeature;
}(PluginFeature);

var _process$env = process.env,
    CWD = _process$env.CWD,
    projectName = _process$env.DOC_PROJECT_NAME,
    DOC_DEPENDS = _process$env.DOC_DEPENDS,
    DOC_MAIN_POINT = _process$env.DOC_MAIN_POINT;
function resolve(target, out) {
  if (out === void 0) {
    out = false;
  }

  for (var _len = arguments.length, paths = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    paths[_key - 2] = arguments[_key];
  }

  return out ? resolveTarget.apply(void 0, [target].concat(paths)) : resolveCli.apply(void 0, [target].concat(paths));
}

function resolveCli(target) {
  for (var _len2 = arguments.length, paths = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    paths[_key2 - 1] = arguments[_key2];
  }

  return path__default.join.apply(path__default, [__dirname, '..', target].concat(paths)).replace(/\\/g, '/');
}

function resolveTarget(target) {
  for (var _len3 = arguments.length, paths = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    paths[_key3 - 1] = arguments[_key3];
  }

  return path__default.join.apply(path__default, [process.env.CWD, target].concat(paths)).replace(/\\/g, '/');
}

function resolveTmpDir() {
  for (var _len4 = arguments.length, paths = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    paths[_key4] = arguments[_key4];
  }

  return resolve.apply(void 0, ["./.tmp/api/" + projectName, false].concat(paths));
}
function requireResolve(target, extname) {
  if (extname === void 0) {
    extname = '.d.ts';
  }

  return require.resolve(target, {
    paths: [CWD]
  }).replace('.js', extname).replace(/\\/g, '/');
}
var paths = {
  docFxTemplate:
  /*#__PURE__*/
  resolve('./config/template/memberpage.2.43.2/content'),
  mainTemplate:
  /*#__PURE__*/
  resolve('./config/api-extractor.main.template.json'),
  template:
  /*#__PURE__*/
  resolve('./config/api-extractor.template.json'),
  tmpProjectDir:
  /*#__PURE__*/
  resolveTmpDir(),
  tmpEtcDir:
  /*#__PURE__*/
  resolveTmpDir('./etc')
};

var _process$env$1 = process.env,
    CWD$1 = _process$env$1.CWD,
    DOC_MAIN_POINT$1 = _process$env$1.DOC_MAIN_POINT;
/** 模块目录收集 */

var folders =
/*#__PURE__*/
fs.readdirSync(resolve('./src', true)).filter(function (name) {
  return fs.pathExistsSync(resolve("./src/" + name + "/index.ts", true));
});
var mainTemplate =
/*#__PURE__*/
fs.readFileSync(paths.mainTemplate).toString('utf8');
var template =
/*#__PURE__*/
fs.readFileSync(paths.template).toString('utf8');

if (!fs.pathExistsSync(paths.tmpEtcDir)) {
  fs.ensureDirSync(paths.tmpEtcDir);
}

var requiredMainPoint =
/*#__PURE__*/
requireResolve(DOC_MAIN_POINT$1);
/**
 * 模板绑定
 * @param template index.d.ts模板
 * @param dir 输出目录
 */

function replacer(template, dir) {
  if (dir === void 0) {
    dir = '<projectFolder>';
  }

  // 项目根目录
  template = template.replace(/\$\{projectFolder\}/ig, CWD$1); // *.d.ts汇总入口文件

  template = template.replace(/\<projectFolder\>\/lib\/index.d.ts/ig, requiredMainPoint); // *.d.ts汇总输出目录

  template = template.replace(/\<projectFolder\>\/dist/ig, dir + "/dist"); // api-extractor输出目录

  template = template.replace(/\<projectFolder\>\/etc/ig, dir + "/etc");
  template = template.replace(/\<projectFolder\>/ig, dir);
  return template;
}

function createMainApiTask() {
  return function () {
    var filePath = resolveTmpDir("index.api.json");

    if (!fs.existsSync(filePath)) {
      fs.createFileSync(filePath);
    }

    fs.writeFileSync(filePath, replacer(mainTemplate, paths.tmpProjectDir));
    console.debug('project_name: ' + process.env.DOC_PROJECT_NAME);
    return gulp.src(filePath).pipe(gulpAwesome.logger.log('project_name: ' + process.env.DOC_PROJECT_NAME)).pipe(gulpAwesome.shell("api-extractor run -c " + filePath + " --local"));
  };
}
function createApiTask(folderName) {
  var filePath = resolveTmpDir(folderName + ".api.json");
  /**
   * 树模板绑定
   * @param template 树分支模板
   * @param dir 输出目录
   */

  function replacer(template, dir) {
    if (dir === void 0) {
      dir = '<projectFolder>';
    }

    // 项目根目录
    template = template.replace(/\$\{projectFolder\}/ig, CWD$1); // *.d.ts汇总入口文件

    template = template.replace(/\<projectFolder\>\/lib/ig, path__default.parse(requiredMainPoint).dir); // *.d.ts汇总输出目录

    template = template.replace(/\<projectFolder\>\/dist/ig, dir + "/dist"); // api-extractor输出目录

    template = template.replace(/\<projectFolder\>\/etc/ig, dir + "/etc");
    template = template.replace(/\<projectFolder\>/ig, dir); // 模块目录

    template = template.replace(/\$\{folderName\}/ig, folderName);
    return template;
  }

  return function () {
    if (!fs.existsSync(filePath)) {
      fs.createFileSync(filePath);
    }

    fs.writeFileSync(filePath, replacer(template, paths.tmpProjectDir));
    return gulp.src(filePath).pipe(gulpAwesome.logger.log('Project Tree Api: ' + folderName)).pipe(gulpAwesome.shell("api-extractor run -c " + filePath + " --local"));
  };
}
var getEmptyTask = function getEmptyTask(msg) {
  return gulpAwesome.task('empty', function () {
    try {
      return Promise.resolve(utils.sleep(100)).then(function () {
        return gulp.src('.', {
          read: false
        }).pipe(gulpAwesome.logger.log(msg));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  });
};
function createApiTask$1 () {
  if (folders.length === 0) {
    return createMainApiTask();
  }

  var list = folders.map(createApiTask); // console.log('folder', list);

  return gulp.parallel(list);
}

JSON.parse = JSON5.parse;
var ApiExtractorFix;

(function (ApiExtractorFix) {
  var suffix = '.api.json';

  function taskFactroy(name) {
    var src = resolveTmpDir("./etc/" + (name === projectName ? 'index' : name) + suffix);
    return function () {
      return gulp.src(src, {
        allowEmpty: true
      }).pipe(replace('@yuyi919/ts-api-docs', name)).pipe(jeditor(function (json) {
        console.error("modify " + src + " name to " + name);
        set(json, 'name', name);
        return json;
      })).pipe(gulp.dest(paths.tmpEtcDir));
    };
  }

  var files = [];

  function getFiles() {
    if (files.length === 0) {
      files = fs.readdirSync(paths.tmpEtcDir).filter(function (name) {
        return new RegExp("^(.*?)" + escapeRegExp(suffix) + "$").test(name);
      }).map(function (name) {
        return name.replace(suffix, '');
      });
    }

    return files;
  }

  function createApiTask() {
    return function (a) {
      var files = getFiles();

      if (files.length === 0) {
        return getEmptyTask('- 无模块目录 -')(a);
      }

      console.log(files);
      var list = files.map(function (name) {
        return taskFactroy(name === 'index' ? projectName : name);
      });
      console.error('createApiTask', files);
      return gulp.parallel(list)(a);
    };
  }

  ApiExtractorFix.createApiTask = createApiTask;

  function editYml(source, target, dothing) {
    return gulp.src(source).pipe(convert({
      // @ts-ignore
      from: 'yml',
      to: 'json'
    })).pipe(jeditor(dothing)).pipe(convert({
      // @ts-ignore
      from: 'json',
      to: 'yml'
    })).pipe(gulp.dest(target));
  }

  function mapTree(name, list) {
    var fileName = name + ".md";
    var md = fs.readFileSync(resolveTmpDir('./document/articles/' + fileName)).toString(); // 通过正则从源文件匹配准确大小写

    var lastName = last(name.split('.'));
    var NameMatcher = "\\[(" + lastName + ")\\]\\(\\.\\/" + fileName + "\\)";
    var moduleName = get(md.match(new RegExp(NameMatcher, 'i')), '[1]', lastName); // console.log();
    // 只匹配下一级

    var testStr = "^" + name + "\\.([a-z0-9])+.md$";
    var next = list.filter(function (filename) {
      return new RegExp(testStr, 'ig').test(filename);
    });
    return {
      name: moduleName,
      homepage: fileName,
      items: next.map(function (name) {
        return mapTree(name.replace(/\.md$/, ''), list);
      })
    };
  }

  function createApiFixedTask(jsonTmp) {
    if (jsonTmp === void 0) {
      jsonTmp = {};
    }

    var markdownList = [];
    var indexFile = "";
    return gulp.parallel(gulp.series(function templateInit() {
      markdownList = fs.readdirSync(resolveTmpDir('./document/articles/'));
      indexFile = fs.readFileSync(resolveTmpDir('./document/articles/index.md')).toString().replace('Package', 'Module');
      return gulp.src(resolve('./config/template/apiDoc/**/*')).pipe(gulp.dest(resolveTmpDir('./document')));
    }, function apiTocFixed() {
      var files = getFiles();
      indexFile = fs.readFileSync(resolveTmpDir('./document/articles/index.md')).toString() + "\n\n" + indexFile;
      fs.writeFileSync(resolveTmpDir('./document/articles/index.md'), indexFile);
      return editYml(resolveTmpDir('./document/articles/toc.yml'), resolveTmpDir('./document/articles'), function (json) {
        // console.error(json);
        var children = files.filter(function (name) {
          return name !== 'index';
        }).map(function (name) {
          return mapTree(name, markdownList);
        });
        return merge(json, {
          items: [get(json, 'items[0]')].concat({
            items: children,
            homepage: 'index.md'
          })
        });
      });
    }), function srcTocFixed() {
      return editYml(resolveTmpDir('./document/src/toc.yml'), resolveTmpDir('./document/src'), function (json) {
        // console.log(json, get(json, 'items[0].name'));
        jsonTmp = merge(json, jsonTmp);
        return jsonTmp;
      });
    });
  }

  ApiExtractorFix.createApiFixedTask = createApiFixedTask;
})(ApiExtractorFix || (ApiExtractorFix = {}));

var ApiExtractorFix$1 = ApiExtractorFix;

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
var BaseAction =
/*#__PURE__*/
function () {
  function BaseAction(inputFolder, outputFolder) {
    this.inputFolder = inputFolder;
    this.outputFolder = outputFolder;
  }

  var _proto = BaseAction.prototype;

  _proto.onDefineParameters = function onDefineParameters() {};

  _proto.buildApiModel = function buildApiModel() {
    var apiModel = new apiExtractorModel.ApiModel();

    if (!nodeCoreLibrary.FileSystem.exists(this.inputFolder)) {
      throw new Error('The input folder does not exist: ' + this.inputFolder);
    }

    nodeCoreLibrary.FileSystem.ensureFolder(this.outputFolder);

    for (var _iterator = nodeCoreLibrary.FileSystem.readFolder(this.inputFolder), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var filename = _ref;

      if (filename.match(/\.api\.json$/i)) {
        console.log("Reading " + filename);
        var filenamePath = path.join(this.inputFolder, filename);
        apiModel.loadPackage(filenamePath);
      }
    }

    this._$$_applyInheritDoc(apiModel, apiModel);

    return apiModel;
  } // TODO: This is a temporary workaround.  The long term plan is for API Extractor's DocCommentEnhancer
  // to apply all @inheritDoc tags before the .api.json file is written.
  // See DocCommentEnhancer._applyInheritDoc() for more info.
  ;

  _proto._$$_applyInheritDoc = function _$$_applyInheritDoc(apiItem, apiModel) {
    if (apiItem instanceof apiExtractorModel.ApiDocumentedItem) {
      if (apiItem.tsdocComment) {
        var inheritDocTag = apiItem.tsdocComment.inheritDocTag;

        if (inheritDocTag && inheritDocTag.declarationReference) {
          // Attempt to resolve the declaration reference
          var result = apiModel.resolveDeclarationReference(inheritDocTag.declarationReference, apiItem);

          if (result.errorMessage) {
            console.log(colors.yellow("Warning: Unresolved @inheritDoc tag for " + apiItem.displayName + ": " + result.errorMessage));
          } else {
            if (result.resolvedApiItem instanceof apiExtractorModel.ApiDocumentedItem && result.resolvedApiItem.tsdocComment && result.resolvedApiItem !== apiItem) {
              this._$$_copyInheritedDocs(apiItem.tsdocComment, result.resolvedApiItem.tsdocComment);
            }
          }
        }
      }
    } // Recurse members


    if (apiExtractorModel.ApiItemContainerMixin.isBaseClassOf(apiItem)) {
      for (var _iterator2 = apiItem.members, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var member = _ref2;

        this._$$_applyInheritDoc(member, apiModel);
      }
    }
  }
  /**
   * Copy the content from `sourceDocComment` to `targetDocComment`.
   * This code is borrowed from DocCommentEnhancer as a temporary workaround.
   */
  ;

  _proto._$$_copyInheritedDocs = function _$$_copyInheritedDocs(targetDocComment, sourceDocComment) {
    targetDocComment.summarySection = sourceDocComment.summarySection;
    targetDocComment.remarksBlock = sourceDocComment.remarksBlock;
    targetDocComment.params.clear();

    for (var _iterator3 = sourceDocComment.params, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var param = _ref3;
      targetDocComment.params.add(param);
    }

    for (var _iterator4 = sourceDocComment.typeParams, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref4 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref4 = _i4.value;
      }

      var typeParam = _ref4;
      targetDocComment.typeParams.add(typeParam);
    }

    targetDocComment.returnsBlock = sourceDocComment.returnsBlock;
    targetDocComment.inheritDocTag = undefined;
  };

  return BaseAction;
}();

/**
 * Represents a span of text that is styled with CommonMark emphasis (italics), strong emphasis (boldface),
 * or both.
 */

var DocEmphasisSpan =
/*#__PURE__*/
function (_DocNodeContainer) {
  _inheritsLoose(DocEmphasisSpan, _DocNodeContainer);

  function DocEmphasisSpan(parameters, children) {
    var _this;

    _this = _DocNodeContainer.call(this, parameters, children) || this;
    _this.bold = !!parameters.bold;
    _this.italic = !!parameters.italic;
    return _this;
  }
  /** @override */


  _createClass(DocEmphasisSpan, [{
    key: "kind",
    get: function get() {
      return "EmphasisSpan"
      /* EmphasisSpan */
      ;
    }
  }]);

  return DocEmphasisSpan;
}(tsdoc.DocNodeContainer);

/**
 * Represents a section header similar to an HTML `<h1>` or `<h2>` element.
 */

var DocHeading =
/*#__PURE__*/
function (_DocNode) {
  _inheritsLoose(DocHeading, _DocNode);

  /**
   * Don't call this directly.  Instead use {@link TSDocParser}
   * @internal
   */
  function DocHeading(parameters) {
    var _this;

    _this = _DocNode.call(this, parameters) || this;
    _this.title = parameters.title;
    _this.level = parameters.level !== undefined ? parameters.level : 1;

    if (_this.level < 1 || _this.level > 5) {
      throw new Error('IDocHeadingParameters.level must be a number between 1 and 5');
    }

    return _this;
  }
  /** @override */


  _createClass(DocHeading, [{
    key: "kind",
    get: function get() {
      return "Heading"
      /* Heading */
      ;
    }
  }]);

  return DocHeading;
}(tsdoc.DocNode);

/**
 * Represents a note box, which is typically displayed as a bordered box containing informational text.
 */

var DocNoteBox =
/*#__PURE__*/
function (_DocNode) {
  _inheritsLoose(DocNoteBox, _DocNode);

  function DocNoteBox(parameters, sectionChildNodes) {
    var _this;

    _this = _DocNode.call(this, parameters) || this;
    _this.content = new tsdoc.DocSection({
      configuration: _this.configuration
    }, sectionChildNodes);
    return _this;
  }
  /** @override */


  var _proto = DocNoteBox.prototype;

  /** @override */
  _proto.onGetChildNodes = function onGetChildNodes() {
    return [this.content];
  };

  _createClass(DocNoteBox, [{
    key: "kind",
    get: function get() {
      return "NoteBox"
      /* NoteBox */
      ;
    }
  }]);

  return DocNoteBox;
}(tsdoc.DocNode);

/**
 * Represents a note box, which is typically displayed as a bordered box containing informational text.
 */

var DocIncludeSnippet =
/*#__PURE__*/
function (_DocNode) {
  _inheritsLoose(DocIncludeSnippet, _DocNode);

  function DocIncludeSnippet(parameters, sectionChildNodes) {
    var _this;

    _this = _DocNode.call(this, parameters) || this;
    _this.content = new tsdoc.DocSection({
      configuration: _this.configuration
    }, sectionChildNodes);
    return _this;
  }
  /** @override */


  var _proto = DocIncludeSnippet.prototype;

  /** @override */
  _proto.onGetChildNodes = function onGetChildNodes() {
    return [this.content];
  };

  _createClass(DocIncludeSnippet, [{
    key: "kind",
    get: function get() {
      return "IncludeSnippet"
      /* IncludeSnippet */
      ;
    }
  }]);

  return DocIncludeSnippet;
}(tsdoc.DocNode);

/**
 * Represents table cell, similar to an HTML `<td>` element.
 */

var DocTableCell =
/*#__PURE__*/
function (_DocNode) {
  _inheritsLoose(DocTableCell, _DocNode);

  function DocTableCell(parameters, sectionChildNodes) {
    var _this;

    _this = _DocNode.call(this, parameters) || this;
    _this.content = new tsdoc.DocSection({
      configuration: _this.configuration
    }, sectionChildNodes);
    return _this;
  }
  /** @override */


  _createClass(DocTableCell, [{
    key: "kind",
    get: function get() {
      return "TableCell"
      /* TableCell */
      ;
    }
  }]);

  return DocTableCell;
}(tsdoc.DocNode);

/**
 * Represents table row, similar to an HTML `<tr>` element.
 */

var DocTableRow =
/*#__PURE__*/
function (_DocNode) {
  _inheritsLoose(DocTableRow, _DocNode);

  function DocTableRow(parameters, cells) {
    var _this;

    _this = _DocNode.call(this, parameters) || this;
    _this._$$_cells = [];

    if (cells) {
      for (var _iterator = cells, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var cell = _ref;

        _this.addCell(cell);
      }
    }

    return _this;
  }
  /** @override */


  var _proto = DocTableRow.prototype;

  _proto.addCell = function addCell(cell) {
    this._$$_cells.push(cell);
  };

  _proto.createAndAddCell = function createAndAddCell() {
    var newCell = new DocTableCell({
      configuration: this.configuration
    });
    this.addCell(newCell);
    return newCell;
  };

  _proto.addPlainTextCell = function addPlainTextCell(cellContent) {
    var cell = this.createAndAddCell();
    cell.content.appendNodeInParagraph(new tsdoc.DocPlainText({
      configuration: this.configuration,
      text: cellContent
    }));
    return cell;
  }
  /** @override */
  ;

  _proto.onGetChildNodes = function onGetChildNodes() {
    return this._$$_cells;
  };

  _createClass(DocTableRow, [{
    key: "kind",
    get: function get() {
      return "TableRow"
      /* TableRow */
      ;
    }
  }, {
    key: "cells",
    get: function get() {
      return this._$$_cells;
    }
  }]);

  return DocTableRow;
}(tsdoc.DocNode);

/**
 * Represents table, similar to an HTML `<table>` element.
 */

var DocTable =
/*#__PURE__*/
function (_DocNode) {
  _inheritsLoose(DocTable, _DocNode);

  function DocTable(parameters, rows) {
    var _this;

    _this = _DocNode.call(this, parameters) || this;
    _this.header = new DocTableRow({
      configuration: _this.configuration
    });
    _this._$$_rows = [];

    if (parameters) {
      if (parameters.headerTitles) {
        if (parameters.headerCells) {
          throw new Error('IDocTableParameters.headerCells and IDocTableParameters.headerTitles' + ' cannot both be specified');
        }

        for (var _iterator = parameters.headerTitles, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var cellText = _ref;

          _this.header.addPlainTextCell(cellText);
        }
      } else if (parameters.headerCells) {
        for (var _iterator2 = parameters.headerCells, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref2 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref2 = _i2.value;
          }

          var cell = _ref2;

          _this.header.addCell(cell);
        }
      }
    }

    if (rows) {
      for (var _iterator3 = rows, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref3 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref3 = _i3.value;
        }

        var row = _ref3;

        _this.addRow(row);
      }
    }

    return _this;
  }
  /** @override */


  var _proto = DocTable.prototype;

  _proto.addRow = function addRow(row) {
    this._$$_rows.push(row);
  };

  _proto.createAndAddRow = function createAndAddRow() {
    var row = new DocTableRow({
      configuration: this.configuration
    });
    this.addRow(row);
    return row;
  }
  /** @override */
  ;

  _proto.onGetChildNodes = function onGetChildNodes() {
    return [this.header].concat(this._$$_rows);
  };

  _createClass(DocTable, [{
    key: "kind",
    get: function get() {
      return "Table"
      /* Table */
      ;
    }
  }, {
    key: "rows",
    get: function get() {
      return this._$$_rows;
    }
  }]);

  return DocTable;
}(tsdoc.DocNode);

var DocNodeKind;

(function (DocNodeKind) {
  DocNodeKind["Block"] = "Block";
  DocNodeKind["BlockTag"] = "BlockTag";
  DocNodeKind["Excerpt"] = "Excerpt";
  DocNodeKind["FencedCode"] = "FencedCode";
  DocNodeKind["CodeSpan"] = "CodeSpan";
  DocNodeKind["Comment"] = "Comment";
  DocNodeKind["DeclarationReference"] = "DeclarationReference";
  DocNodeKind["ErrorText"] = "ErrorText";
  DocNodeKind["EscapedText"] = "EscapedText";
  DocNodeKind["HtmlAttribute"] = "HtmlAttribute";
  DocNodeKind["HtmlEndTag"] = "HtmlEndTag";
  DocNodeKind["HtmlStartTag"] = "HtmlStartTag";
  DocNodeKind["InheritDocTag"] = "InheritDocTag";
  DocNodeKind["InlineTag"] = "InlineTag";
  DocNodeKind["LinkTag"] = "LinkTag";
  DocNodeKind["MemberIdentifier"] = "MemberIdentifier";
  DocNodeKind["MemberReference"] = "MemberReference";
  DocNodeKind["MemberSelector"] = "MemberSelector";
  DocNodeKind["MemberSymbol"] = "MemberSymbol";
  DocNodeKind["Paragraph"] = "Paragraph";
  DocNodeKind["ParamBlock"] = "ParamBlock";
  DocNodeKind["ParamCollection"] = "ParamCollection";
  DocNodeKind["PlainText"] = "PlainText";
  DocNodeKind["Section"] = "Section";
  DocNodeKind["SoftBreak"] = "SoftBreak";
})(DocNodeKind || (DocNodeKind = {}));

var CustomDocNodes =
/*#__PURE__*/
function () {
  function CustomDocNodes() {}

  _createClass(CustomDocNodes, null, [{
    key: "configuration",
    get: function get() {
      if (CustomDocNodes._configuration === undefined) {
        var configuration = new tsdoc.TSDocConfiguration();
        configuration.docNodeManager.registerDocNodes('@micrososft/api-documenter', [{
          docNodeKind: "EmphasisSpan"
          /* EmphasisSpan */
          ,
          constructor: DocEmphasisSpan
        }, {
          docNodeKind: "Heading"
          /* Heading */
          ,
          constructor: DocHeading
        }, {
          docNodeKind: "IncludeSnippet"
          /* IncludeSnippet */
          ,
          constructor: DocIncludeSnippet
        }, {
          docNodeKind: "NoteBox"
          /* NoteBox */
          ,
          constructor: DocNoteBox
        }, {
          docNodeKind: "Table"
          /* Table */
          ,
          constructor: DocTable
        }, {
          docNodeKind: "TableCell"
          /* TableCell */
          ,
          constructor: DocTableCell
        }, {
          docNodeKind: "TableRow"
          /* TableRow */
          ,
          constructor: DocTableRow
        }]);
        configuration.docNodeManager.registerAllowableChildren("EmphasisSpan"
        /* EmphasisSpan */
        , ["IncludeSnippet"
        /* IncludeSnippet */
        , DocNodeKind.PlainText, DocNodeKind.SoftBreak]);
        configuration.docNodeManager.registerAllowableChildren(DocNodeKind.Section, ["IncludeSnippet"
        /* IncludeSnippet */
        , "Heading"
        /* Heading */
        , "NoteBox"
        /* NoteBox */
        , "Table"
        /* Table */
        ]);
        configuration.docNodeManager.registerAllowableChildren(DocNodeKind.Paragraph, ["EmphasisSpan"
        /* EmphasisSpan */
        ]);
        var taf = {
          tagName: '@includeSnippet',
          tagNameWithUpperCase: '@INCLUDESNIPPET',
          syntaxKind: 0,
          standardization: 'Core',
          allowMultiple: false
        };
        configuration.addTagDefinitions([taf], true);
        CustomDocNodes._configuration = configuration;
        configuration.setSupportForTag(taf, true);
        console.log(configuration.tagDefinitions);
      }

      return CustomDocNodes._configuration;
    }
  }]);

  return CustomDocNodes;
}();

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
var Utilities =
/*#__PURE__*/
function () {
  function Utilities() {}

  /**
   * Generates a concise signature for a function.  Example: "getArea(width, height)"
   */
  Utilities.getConciseSignature = function getConciseSignature(apiItem) {
    if (apiExtractorModel.ApiParameterListMixin.isBaseClassOf(apiItem)) {
      return apiItem.displayName + '(' + apiItem.parameters.map(function (x) {
        return x.name;
      }).join(', ') + ')';
    }

    return apiItem.displayName;
  }
  /**
   * Converts bad filename characters to underscores.
   */
  ;

  Utilities.getSafeFilenameForName = function getSafeFilenameForName(name) {
    // TODO: This can introduce naming collisions.
    // We will fix that as part of https://github.com/microsoft/rushstack/issues/1308
    return name.replace(Utilities._badFilenameCharsRegExp, '_').toLowerCase();
  };

  return Utilities;
}();
Utilities._badFilenameCharsRegExp = /[^a-z0-9_\-\.]/ig;

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
/**
  * A utility for writing indented text.
  *
  * @remarks
  *
  * Note that the indentation is inserted at the last possible opportunity.
  * For example, this code...
  *
  * ```ts
  *   writer.write('begin\n');
  *   writer.increaseIndent();
  *   writer.write('one\ntwo\n');
  *   writer.decreaseIndent();
  *   writer.increaseIndent();
  *   writer.decreaseIndent();
  *   writer.write('end');
  * ```
  *
  * ...would produce this output:
  *
  * ```
  *   begin
  *     one
  *     two
  *   end
  * ```
  */

var IndentedWriter =
/*#__PURE__*/
function () {
  function IndentedWriter(builder) {
    /**
     * The text characters used to create one level of indentation.
     * Two spaces by default.
     */
    this.defaultIndentPrefix = '  ';
    this._$$_builder = builder === undefined ? new nodeCoreLibrary.StringBuilder() : builder;
    this._$$_latestChunk = undefined;
    this._$$_previousChunk = undefined;
    this._$$_atStartOfLine = true;
    this._$$_indentStack = [];
    this._$$_indentText = '';
  }
  /**
   * Retrieves the output that was built so far.
   */


  var _proto = IndentedWriter.prototype;

  _proto.getText = function getText() {
    return this._$$_builder.toString();
  };

  _proto.toString = function toString() {
    return this.getText();
  }
  /**
   * Increases the indentation.  Normally the indentation is two spaces,
   * however an arbitrary prefix can optional be specified.  (For example,
   * the prefix could be "// " to indent and comment simultaneously.)
   * Each call to IndentedWriter.increaseIndent() must be followed by a
   * corresponding call to IndentedWriter.decreaseIndent().
   */
  ;

  _proto.increaseIndent = function increaseIndent(indentPrefix) {
    this._$$_indentStack.push(indentPrefix !== undefined ? indentPrefix : this.defaultIndentPrefix);

    this._$$_updateIndentText();
  }
  /**
   * Decreases the indentation, reverting the effect of the corresponding call
   * to IndentedWriter.increaseIndent().
   */
  ;

  _proto.decreaseIndent = function decreaseIndent() {
    this._$$_indentStack.pop();

    this._$$_updateIndentText();
  }
  /**
   * A shorthand for ensuring that increaseIndent()/decreaseIndent() occur
   * in pairs.
   */
  ;

  _proto.indentScope = function indentScope(scope, indentPrefix) {
    this.increaseIndent(indentPrefix);
    scope();
    this.decreaseIndent();
  }
  /**
   * Adds a newline if the file pointer is not already at the start of the line (or start of the stream).
   */
  ;

  _proto.ensureNewLine = function ensureNewLine() {
    var lastCharacter = this.peekLastCharacter();

    if (lastCharacter !== '\n' && lastCharacter !== '') {
      this._$$_writeNewLine();
    }
  }
  /**
   * Adds up to two newlines to ensure that there is a blank line above the current line.
   */
  ;

  _proto.ensureSkippedLine = function ensureSkippedLine() {
    if (this.peekLastCharacter() !== '\n') {
      this._$$_writeNewLine();
    }

    var secondLastCharacter = this.peekSecondLastCharacter();

    if (secondLastCharacter !== '\n' && secondLastCharacter !== '') {
      this._$$_writeNewLine();
    }
  }
  /**
   * Returns the last character that was written, or an empty string if no characters have been written yet.
   */
  ;

  _proto.peekLastCharacter = function peekLastCharacter() {
    if (this._$$_latestChunk !== undefined) {
      return this._$$_latestChunk.substr(-1, 1);
    }

    return '';
  }
  /**
   * Returns the second to last character that was written, or an empty string if less than one characters
   * have been written yet.
   */
  ;

  _proto.peekSecondLastCharacter = function peekSecondLastCharacter() {
    if (this._$$_latestChunk !== undefined) {
      if (this._$$_latestChunk.length > 1) {
        return this._$$_latestChunk.substr(-2, 1);
      }

      if (this._$$_previousChunk !== undefined) {
        return this._$$_previousChunk.substr(-1, 1);
      }
    }

    return '';
  }
  /**
   * Writes some text to the internal string buffer, applying indentation according
   * to the current indentation level.  If the string contains multiple newlines,
   * each line will be indented separately.
   */
  ;

  _proto.write = function write(message) {
    if (message.length === 0) {
      return;
    } // If there are no newline characters, then append the string verbatim


    if (!/[\r\n]/.test(message)) {
      this._$$_writeLinePart(message);

      return;
    } // Otherwise split the lines and write each one individually


    var first = true;

    for (var _iterator = message.split('\n'), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var linePart = _ref;

      if (!first) {
        this._$$_writeNewLine();
      } else {
        first = false;
      }

      if (linePart) {
        this._$$_writeLinePart(linePart.replace(/[\r]/g, ''));
      }
    }
  }
  /**
   * A shorthand for writing an optional message, followed by a newline.
   * Indentation is applied following the semantics of IndentedWriter.write().
   */
  ;

  _proto.writeLine = function writeLine(message) {
    if (message === void 0) {
      message = '';
    }

    if (message.length > 0) {
      this.write(message);
    }

    this._$$_writeNewLine();
  }
  /**
   * Writes a string that does not contain any newline characters.
   */
  ;

  _proto._$$_writeLinePart = function _$$_writeLinePart(message) {
    if (message.length > 0) {
      if (this._$$_atStartOfLine && this._$$_indentText.length > 0) {
        this._$$_write(this._$$_indentText);
      }

      this._$$_write(message);

      this._$$_atStartOfLine = false;
    }
  };

  _proto._$$_writeNewLine = function _$$_writeNewLine() {
    if (this._$$_atStartOfLine && this._$$_indentText.length > 0) {
      this._$$_write(this._$$_indentText);
    }

    this._$$_write('\n');

    this._$$_atStartOfLine = true;
  };

  _proto._$$_write = function _$$_write(s) {
    this._$$_previousChunk = this._$$_latestChunk;
    this._$$_latestChunk = s;

    this._$$_builder.append(s);
  };

  _proto._$$_updateIndentText = function _$$_updateIndentText() {
    this._$$_indentText = this._$$_indentStack.join('');
  };

  return IndentedWriter;
}();

var ApiItemKindHack;

(function (ApiItemKindHack) {
  ApiItemKindHack["CallSignature"] = "CallSignature";
  ApiItemKindHack["Class"] = "Class";
  ApiItemKindHack["Constructor"] = "Constructor";
  ApiItemKindHack["ConstructSignature"] = "ConstructSignature";
  ApiItemKindHack["EntryPoint"] = "EntryPoint";
  ApiItemKindHack["Enum"] = "Enum";
  ApiItemKindHack["EnumMember"] = "EnumMember";
  ApiItemKindHack["Function"] = "Function";
  ApiItemKindHack["IndexSignature"] = "IndexSignature";
  ApiItemKindHack["Interface"] = "Interface";
  ApiItemKindHack["Method"] = "Method";
  ApiItemKindHack["MethodSignature"] = "MethodSignature";
  ApiItemKindHack["Model"] = "Model";
  ApiItemKindHack["Namespace"] = "Namespace";
  ApiItemKindHack["Package"] = "Package";
  ApiItemKindHack["Property"] = "Property";
  ApiItemKindHack["PropertySignature"] = "PropertySignature";
  ApiItemKindHack["TypeAlias"] = "TypeAlias";
  ApiItemKindHack["Variable"] = "Variable";
  ApiItemKindHack["None"] = "None";
})(ApiItemKindHack || (ApiItemKindHack = {}));

var ExcerptTokenKindHack;

(function (ExcerptTokenKindHack) {
  /**
   * Generic text without any special properties
   */
  ExcerptTokenKindHack["Content"] = "Content";
  /**
   * A reference to an API declaration
   */

  ExcerptTokenKindHack["Reference"] = "Reference";
})(ExcerptTokenKindHack || (ExcerptTokenKindHack = {}));

var DocNodeKind$1;

(function (DocNodeKind) {
  DocNodeKind["Block"] = "Block";
  DocNodeKind["BlockTag"] = "BlockTag";
  DocNodeKind["Excerpt"] = "Excerpt";
  DocNodeKind["FencedCode"] = "FencedCode";
  DocNodeKind["CodeSpan"] = "CodeSpan";
  DocNodeKind["Comment"] = "Comment";
  DocNodeKind["DeclarationReference"] = "DeclarationReference";
  DocNodeKind["ErrorText"] = "ErrorText";
  DocNodeKind["EscapedText"] = "EscapedText";
  DocNodeKind["HtmlAttribute"] = "HtmlAttribute";
  DocNodeKind["HtmlEndTag"] = "HtmlEndTag";
  DocNodeKind["HtmlStartTag"] = "HtmlStartTag";
  DocNodeKind["InheritDocTag"] = "InheritDocTag";
  DocNodeKind["InlineTag"] = "InlineTag";
  DocNodeKind["LinkTag"] = "LinkTag";
  DocNodeKind["MemberIdentifier"] = "MemberIdentifier";
  DocNodeKind["MemberReference"] = "MemberReference";
  DocNodeKind["MemberSelector"] = "MemberSelector";
  DocNodeKind["MemberSymbol"] = "MemberSymbol";
  DocNodeKind["Paragraph"] = "Paragraph";
  DocNodeKind["ParamBlock"] = "ParamBlock";
  DocNodeKind["ParamCollection"] = "ParamCollection";
  DocNodeKind["PlainText"] = "PlainText";
  DocNodeKind["Section"] = "Section";
  DocNodeKind["SoftBreak"] = "SoftBreak";
})(DocNodeKind$1 || (DocNodeKind$1 = {}));

var NewlineKindHack;

(function (NewlineKindHack) {
  /**
   * Windows-style newlines
   */
  NewlineKindHack["CrLf"] = "\r\n";
  /**
   * POSIX-style newlines
   *
   * @remarks
   * POSIX is a registered trademark of the Institute of Electrical and Electronic Engineers, Inc.
   */

  NewlineKindHack["Lf"] = "\n";
  /**
   * Default newline type for this operating system (`os.EOL`).
   */

  NewlineKindHack["OsDefault"] = "os";
})(NewlineKindHack || (NewlineKindHack = {}));

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
/**
 * Renders MarkupElement content in the Markdown file format.
 * For more info:  https://en.wikipedia.org/wiki/Markdown
 */

var MarkdownEmitter =
/*#__PURE__*/
function () {
  function MarkdownEmitter() {}

  var _proto = MarkdownEmitter.prototype;

  _proto.emit = function emit(stringBuilder, docNode, options) {
    var writer = new IndentedWriter(stringBuilder);
    var context = {
      writer: writer,
      insideTable: false,
      boldRequested: false,
      italicRequested: false,
      writingBold: false,
      writingItalic: false,
      options: options
    };
    this.writeNode(docNode, context, false);
    writer.ensureNewLine(); // finish the last line

    return writer.toString();
  };

  _proto.getEscapedText = function getEscapedText(text) {
    var textWithBackslashes = text.replace(/\\/g, '\\\\') // first replace the escape character
    .replace(/[*#[\]_|`~]/g, function (x) {
      return '\\' + x;
    }) // then escape any special characters
    .replace(/---/g, '\\-\\-\\-') // hyphens only if it's 3 or more
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return textWithBackslashes;
  };

  _proto.getTableEscapedText = function getTableEscapedText(text) {
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '&#124;');
  }
  /**
   * @virtual
   */
  ;

  _proto.writeNode = function writeNode(docNode, context, docNodeSiblings) {
    var writer = context.writer;

    switch (docNode.kind) {
      case DocNodeKind$1.PlainText:
        {
          var docPlainText = docNode;
          this.writePlainText(docPlainText.text, context);
          break;
        }

      case DocNodeKind$1.HtmlStartTag:
      case DocNodeKind$1.HtmlEndTag:
        {
          var docHtmlTag = docNode; // write the HTML element verbatim into the output

          writer.write(docHtmlTag.emitAsHtml());
          break;
        }

      case DocNodeKind$1.CodeSpan:
        {
          var docCodeSpan = docNode;

          if (context.insideTable) {
            writer.write('<code>');
          } else {
            writer.write('`');
          }

          if (context.insideTable) {
            var code = this.getTableEscapedText(docCodeSpan.code);
            var parts = code.split(/\r?\n/g);
            writer.write(parts.join('</code><br/><code>'));
          } else {
            writer.write(docCodeSpan.code);
          }

          if (context.insideTable) {
            writer.write('</code>');
          } else {
            writer.write('`');
          }

          break;
        }

      case DocNodeKind$1.LinkTag:
        {
          var docLinkTag = docNode; // if (docLinkTag.urlDestination) {
          //   console.log(
          //     //docLinkTag.codeDestination,
          //     docLinkTag.urlDestination
          //   )
          // }

          if (docLinkTag.codeDestination) {
            this.writeLinkTagWithCodeDestination(docLinkTag, context);
          } else if (docLinkTag.urlDestination) {
            this.writeLinkTagWithUrlDestination(docLinkTag, context);
          } else if (docLinkTag.linkText) {
            this.writePlainText(docLinkTag.linkText, context);
          }

          break;
        }

      case DocNodeKind$1.Paragraph:
        {
          var docParagraph = docNode;
          var trimmedParagraph = tsdoc.DocNodeTransforms.trimSpacesInParagraph(docParagraph);

          if (context.insideTable) {
            if (docNodeSiblings) {
              writer.write('<p>');
              this.writeNodes(trimmedParagraph.nodes, context);
              writer.write('</p>');
            } else {
              // Special case:  If we are the only element inside this table cell, then we can omit the <p></p> container.
              this.writeNodes(trimmedParagraph.nodes, context);
            }
          } else {
            this.writeNodes(trimmedParagraph.nodes, context);
            writer.ensureNewLine();
            writer.writeLine();
          }

          break;
        }

      case DocNodeKind$1.FencedCode:
        {
          var docFencedCode = docNode;
          writer.ensureNewLine();
          writer.write('```');
          writer.write(docFencedCode.language);
          writer.writeLine();
          writer.write(docFencedCode.code);
          writer.writeLine();
          writer.writeLine('```');
          break;
        }

      case DocNodeKind$1.Section:
        {
          var docSection = docNode;
          this.writeNodes(docSection.nodes, context);
          break;
        }

      case DocNodeKind$1.SoftBreak:
        {
          if (!/^\s?$/.test(writer.peekLastCharacter())) {
            writer.write(' ');
          }

          break;
        }

      case DocNodeKind$1.EscapedText:
        {
          var docEscapedText = docNode;
          this.writePlainText(docEscapedText.decodedText, context);
          break;
        }

      case DocNodeKind$1.ErrorText:
        {
          var docErrorText = docNode;
          this.writePlainText(docErrorText.text, context);
          break;
        }

      case DocNodeKind$1.InlineTag:
        {
          break;
        }

      case DocNodeKind$1.BlockTag:
        {
          var tagNode = docNode;

          if (tagNode.tagName === '@includeSnippet') {
            console.warn('Hellow World: ' + tagNode.tagName);
            this.writePlainText(tagNode.tagName, context);
          } else console.warn('Unsupported block tag: ' + tagNode.tagName);

          break;
        }

      default:
        throw new nodeCoreLibrary.InternalError('Unsupported DocNodeKind kind: ' + docNode.kind);
    }
  }
  /** @virtual */
  ;

  _proto.writeLinkTagWithCodeDestination = function writeLinkTagWithCodeDestination(docLinkTag, context) {
    // The subclass needs to implement this to support code destinations
    throw new nodeCoreLibrary.InternalError('writeLinkTagWithCodeDestination()');
  }
  /** @virtual */
  ;

  _proto.writeLinkTagWithUrlDestination = function writeLinkTagWithUrlDestination(docLinkTag, context) {
    var linkText = docLinkTag.linkText !== undefined ? docLinkTag.linkText : docLinkTag.urlDestination;
    var encodedLinkText = this.getEscapedText(linkText.replace(/\s+/g, ' '));
    context.writer.write('[');
    context.writer.write(encodedLinkText);
    context.writer.write("](" + docLinkTag.urlDestination + ")");
  };

  _proto.writePlainText = function writePlainText(text, context) {
    var writer = context.writer; // split out the [ leading whitespace, content, trailing whitespace ]

    var parts = text.match(/^(\s*)(.*?)(\s*)$/) || [];
    writer.write(parts[1]); // write leading whitespace

    var middle = parts[2];

    if (middle !== '') {
      switch (writer.peekLastCharacter()) {
        case '':
        case '\n':
        case ' ':
        case '[':
        case '>':
          // okay to put a symbol
          break;

        default:
          // This is no problem:        "**one** *two* **three**"
          // But this is trouble:       "**one***two***three**"
          // The most general solution: "**one**<!-- -->*two*<!-- -->**three**"
          writer.write('<!-- -->');
          break;
      }

      if (context.boldRequested) {
        writer.write('<b>');
      }

      if (context.italicRequested) {
        writer.write('<i>');
      }

      writer.write(this.getEscapedText(middle));

      if (context.italicRequested) {
        writer.write('</i>');
      }

      if (context.boldRequested) {
        writer.write('</b>');
      }
    }

    writer.write(parts[3]); // write trailing whitespace
  };

  _proto.writeNodes = function writeNodes(docNodes, context) {
    for (var _iterator = docNodes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var docNode = _ref;
      this.writeNode(docNode, context, docNodes.length > 1);
    }
  };

  return MarkdownEmitter;
}();

var CustomMarkdownEmitter =
/*#__PURE__*/
function (_MarkdownEmitter) {
  _inheritsLoose(CustomMarkdownEmitter, _MarkdownEmitter);

  function CustomMarkdownEmitter(apiModel) {
    var _this;

    _this = _MarkdownEmitter.call(this) || this;
    _this._$$_apiModel = apiModel;
    return _this;
  }

  var _proto = CustomMarkdownEmitter.prototype;

  _proto.emit = function emit(stringBuilder, docNode, options) {
    return _MarkdownEmitter.prototype.emit.call(this, stringBuilder, docNode, options);
  }
  /** @override */
  ;

  _proto.writeNode = function writeNode(docNode, context, docNodeSiblings) {
    var writer = context.writer;

    switch (docNode.kind) {
      case "Heading"
      /* Heading */
      :
        {
          var docHeading = docNode;
          writer.ensureSkippedLine();
          var prefix;

          switch (docHeading.level) {
            case 1:
              prefix = '##';
              break;

            case 2:
              prefix = '###';
              break;

            case 3:
              prefix = '###';
              break;

            default:
              prefix = '####';
          }

          writer.writeLine(prefix + ' ' + this.getEscapedText(docHeading.title));
          writer.writeLine();
          break;
        }

      case "NoteBox"
      /* NoteBox */
      :
        {
          var docNoteBox = docNode;
          writer.ensureNewLine();
          writer.increaseIndent('> ');
          this.writeNode(docNoteBox.content, context, false);
          writer.ensureNewLine();
          writer.decreaseIndent();
          writer.writeLine();
          break;
        }

      case "Table"
      /* Table */
      :
        {
          var docTable = docNode; // GitHub's markdown renderer chokes on tables that don't have a blank line above them,
          // whereas VS Code's renderer is totally fine with it.

          writer.ensureSkippedLine();
          context.insideTable = true; // Markdown table rows can have inconsistent cell counts.  Size the table based on the longest row.

          var columnCount = 0;

          if (docTable.header) {
            columnCount = docTable.header.cells.length;
          }

          for (var _iterator = docTable.rows, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref = _i.value;
            }

            var row = _ref;

            if (row.cells.length > columnCount) {
              columnCount = row.cells.length;
            }
          } // write the table header (which is required by Markdown)


          writer.write('| ');

          for (var i = 0; i < columnCount; ++i) {
            writer.write(' ');

            if (docTable.header) {
              var cell = docTable.header.cells[i];

              if (cell) {
                this.writeNode(cell.content, context, false);
              }
            }

            writer.write(' |');
          }

          writer.writeLine(); // write the divider

          writer.write('| ');

          for (var _i2 = 0; _i2 < columnCount; ++_i2) {
            writer.write(' --- |');
          }

          writer.writeLine();

          for (var _iterator2 = docTable.rows, _isArray2 = Array.isArray(_iterator2), _i3 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
              if (_i3 >= _iterator2.length) break;
              _ref2 = _iterator2[_i3++];
            } else {
              _i3 = _iterator2.next();
              if (_i3.done) break;
              _ref2 = _i3.value;
            }

            var _row = _ref2;
            writer.write('| ');

            for (var _iterator3 = _row.cells, _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
              var _ref3;

              if (_isArray3) {
                if (_i4 >= _iterator3.length) break;
                _ref3 = _iterator3[_i4++];
              } else {
                _i4 = _iterator3.next();
                if (_i4.done) break;
                _ref3 = _i4.value;
              }

              var _cell = _ref3;
              writer.write(' ');
              this.writeNode(_cell.content, context, false);
              writer.write(' |');
            }

            writer.writeLine();
          }

          writer.writeLine();
          context.insideTable = false;
          break;
        }

      case "EmphasisSpan"
      /* EmphasisSpan */
      :
        {
          var docEmphasisSpan = docNode;
          var oldBold = context.boldRequested;
          var oldItalic = context.italicRequested;
          context.boldRequested = docEmphasisSpan.bold;
          context.italicRequested = docEmphasisSpan.italic;
          this.writeNodes(docEmphasisSpan.nodes, context);
          context.boldRequested = oldBold;
          context.italicRequested = oldItalic;
          break;
        }

      default:
        _MarkdownEmitter.prototype.writeNode.call(this, docNode, context, false);

    }
  }
  /** @override */
  ;

  _proto.writeLinkTagWithCodeDestination = function writeLinkTagWithCodeDestination(docLinkTag, context) {
    var options = context.options;

    var result = this._$$_apiModel.resolveDeclarationReference(docLinkTag.codeDestination, options.contextApiItem);

    if (result.resolvedApiItem) {
      var filename = options.onGetFilenameForApiItem(result.resolvedApiItem);

      if (filename) {
        var linkText = docLinkTag.linkText || '';

        if (linkText.length === 0) {
          // Generate a name such as Namespace1.Namespace2.MyClass.myMethod()
          linkText = result.resolvedApiItem.getScopedNameWithinPackage();
        }

        if (linkText.length > 0) {
          var encodedLinkText = this.getEscapedText(linkText.replace(/\s+/g, ' '));
          context.writer.write('[');
          context.writer.write(encodedLinkText);
          context.writer.write("](" + filename + ")");
        } else {
          console.log(colors__default.yellow('WARNING: Unable to determine link text'));
        }
      }
    } else if (result.errorMessage) {
      console.log(colors__default.yellow("WARNING: Unable to resolve reference \"" + docLinkTag.codeDestination.emitAsTsdoc() + "\": " + result.errorMessage));
    }
  };

  return CustomMarkdownEmitter;
}(MarkdownEmitter);

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
var PluginLoader =
/*#__PURE__*/
function () {
  function PluginLoader() {}

  var _proto = PluginLoader.prototype;

  _proto.load = function load(documenterConfig, createContext) {
    var configFileFolder = path.dirname(documenterConfig.configFilePath);

    for (var _iterator = documenterConfig.configFile.plugins || [], _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var configPlugin = _ref;

      try {
        // Look for the package name in the same place as the config file
        var resolvedEntryPointPath = resolve$1.sync(configPlugin.packageName, {
          basedir: configFileFolder
        }); // Load the package
        // eslint-disable-next-line @typescript-eslint/no-var-requires

        var entryPoint = require(resolvedEntryPointPath);

        if (!entryPoint) {
          throw new Error('Invalid entry point');
        }

        var manifest = entryPoint['apiDocumenterPluginManifest'];

        if (!manifest) {
          throw new Error("The package is not an API documenter plugin;" + " the \"apiDocumenterPluginManifest\" export was not found");
        }

        if (manifest.manifestVersion !== 1000) {
          throw new Error("The plugin is not compatible with this version of API Documenter;" + " unsupported manifestVersion");
        }

        var loadedPlugin = {
          packageName: configPlugin.packageName,
          manifest: manifest
        };
        var featureDefinitionsByName = new Map();

        for (var _iterator2 = manifest.features, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref2 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref2 = _i2.value;
          }

          var featureDefinition = _ref2;
          featureDefinitionsByName.set(featureDefinition.featureName, featureDefinition);
        }

        for (var _iterator3 = configPlugin.enabledFeatureNames, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref3;

          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            _ref3 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            _ref3 = _i3.value;
          }

          var featureName = _ref3;

          var _featureDefinition = featureDefinitionsByName.get(featureName);

          if (!_featureDefinition) {
            throw new Error("The plugin " + loadedPlugin.packageName + " does not have" + (" a feature with name \"" + featureName + "\""));
          }

          if (_featureDefinition.kind === 'MarkdownDocumenterFeature') {
            if (this.markdownDocumenterFeature) {
              throw new Error('A MarkdownDocumenterFeature is already loaded');
            }

            var initialization = new PluginFeatureInitialization();
            initialization._context = createContext();
            var markdownDocumenterFeature = undefined;

            try {
              markdownDocumenterFeature = new _featureDefinition.subclass(initialization);
            } catch (e) {
              throw new Error("Failed to construct feature subclass:\n" + e.toString());
            }

            if (!(markdownDocumenterFeature instanceof MarkdownDocumenterFeature)) {
              throw new Error('The constructed subclass was not an instance of MarkdownDocumenterFeature');
            }

            try {
              markdownDocumenterFeature.onInitialized();
            } catch (e) {
              throw new Error('Error occurred during the onInitialized() event: ' + e.toString());
            }

            this.markdownDocumenterFeature = markdownDocumenterFeature;
          } else {
            throw new Error("Unknown feature definition kind: \"" + _featureDefinition.kind + "\"");
          }
        }
      } catch (e) {
        throw new Error("Error loading plugin " + configPlugin.packageName + ": " + e.message);
      }
    }
  };

  return PluginLoader;
}();

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
/**
 * Renders API documentation in the Markdown file format.
 * For more info:  https://en.wikipedia.org/wiki/Markdown
 */

var MarkdownDocumenter =
/*#__PURE__*/
function () {
  function MarkdownDocumenter(apiModel, projectFolder, documenterConfig) {
    this.projectFolder = projectFolder;
    this._$$_apiModel = apiModel;
    this._$$_documenterConfig = documenterConfig;
    this._$$_tsdocConfiguration = CustomDocNodes.configuration;
    this._$$_markdownEmitter = new CustomMarkdownEmitter(this._$$_apiModel);
    this._$$_pluginLoader = new PluginLoader();
  }

  var _proto = MarkdownDocumenter.prototype;

  _proto.generateFiles = function generateFiles(outputFolder) {
    var _this = this;

    this._$$_outputFolder = outputFolder;

    if (this._$$_documenterConfig) {
      this._$$_pluginLoader.load(this._$$_documenterConfig, function () {
        return new MarkdownDocumenterFeatureContext({
          apiModel: _this._$$_apiModel,
          outputFolder: outputFolder,
          documenter: new MarkdownDocumenterAccessor({
            getLinkForApiItem: function getLinkForApiItem(apiItem) {
              return _this._$$_getLinkFilenameForApiItem(apiItem);
            }
          })
        });
      });
    }

    console.log();

    this._$$_deleteOldOutputFiles();

    this._$$_writeApiItemPage(this._$$_apiModel);

    if (this._$$_pluginLoader.markdownDocumenterFeature) {
      this._$$_pluginLoader.markdownDocumenterFeature.onFinished({});
    }
  };

  _proto._$$_writeApiItemPage = function _$$_writeApiItemPage(apiItem) {
    var _this2 = this;

    var configuration = this._$$_tsdocConfiguration;
    var output = new tsdoc.DocSection({
      configuration: this._$$_tsdocConfiguration
    });

    this._$$_writeBreadcrumb(output, apiItem);

    var scopedName = apiItem.getScopedNameWithinPackage();

    switch (apiItem.kind) {
      case "Class"
      /* Class */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName + " class"
        }));
        break;

      case "Enum"
      /* Enum */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName + " enum"
        }));
        break;

      case "Interface"
      /* Interface */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName + " interface"
        }));
        break;

      case "Constructor"
      /* Constructor */
      :
      case "ConstructSignature"
      /* ConstructSignature */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName
        }));
        break;

      case "Method"
      /* Method */
      :
      case "MethodSignature"
      /* MethodSignature */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName + " method"
        }));
        break;

      case "Function"
      /* Function */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName + " function"
        }));
        break;

      case "Model"
      /* Model */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: "API Reference"
        }));
        break;

      case "Namespace"
      /* Namespace */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName + " namespace"
        }));
        break;

      case "Package"
      /* Package */
      :
        console.log("Writing " + apiItem.displayName + " package");
        var unscopedPackageName = nodeCoreLibrary.PackageName.getUnscopedName(apiItem.displayName);
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: unscopedPackageName + " package"
        }));
        break;

      case "Property"
      /* Property */
      :
      case "PropertySignature"
      /* PropertySignature */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName + " property"
        }));
        break;

      case "TypeAlias"
      /* TypeAlias */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName + " type"
        }));
        break;

      case "Variable"
      /* Variable */
      :
        output.appendNode(new DocHeading({
          configuration: configuration,
          title: scopedName + " variable"
        }));
        break;

      default:
        throw new Error('Unsupported API item kind: ' + apiItem.kind);
    }

    if (apiExtractorModel.ApiReleaseTagMixin.isBaseClassOf(apiItem)) {
      if (apiItem.releaseTag === apiExtractorModel.ReleaseTag.Beta) {
        this._$$_writeBetaWarning(output);
      }
    }

    if (apiItem instanceof apiExtractorModel.ApiDocumentedItem) {
      var tsdocComment = apiItem.tsdocComment;

      if (tsdocComment) {
        if (tsdocComment.deprecatedBlock) {
          output.appendNode(new DocNoteBox({
            configuration: this._$$_tsdocConfiguration
          }, [new tsdoc.DocParagraph({
            configuration: this._$$_tsdocConfiguration
          }, [new tsdoc.DocPlainText({
            configuration: this._$$_tsdocConfiguration,
            text: 'Warning: This API is now obsolete. '
          })])].concat(tsdocComment.deprecatedBlock.content.nodes)));
        }

        this._$$_appendSection(output, tsdocComment.summarySection);
      }
    }

    if (apiItem instanceof apiExtractorModel.ApiDeclaredItem) {
      if (apiItem.excerpt.text.length > 0) {
        output.appendNode(new tsdoc.DocParagraph({
          configuration: configuration
        }, [new DocEmphasisSpan({
          configuration: configuration,
          bold: true
        }, [new tsdoc.DocPlainText({
          configuration: configuration,
          text: 'Signature:'
        })])]));
        output.appendNode(new tsdoc.DocFencedCode({
          configuration: configuration,
          code: apiItem.getExcerptWithModifiers(),
          language: 'typescript'
        }));
      }
    }

    var appendRemarks = true;

    switch (apiItem.kind) {
      case "Class"
      /* Class */
      :
      case "Interface"
      /* Interface */
      :
      case "Namespace"
      /* Namespace */
      :
      case "Package"
      /* Package */
      :
        this._$$_writeRemarksSection(output, apiItem);

        appendRemarks = false;
        break;
    }

    switch (apiItem.kind) {
      case "Class"
      /* Class */
      :
        var _tsdocComment = apiItem.tsdocComment;

        if (_tsdocComment) {
          var codeSpinnet = this._$$getSummaryConnect(output, _tsdocComment.summarySection);

          if (codeSpinnet) {
            this._$$_appendSection(output, new tsdoc.DocSection({
              configuration: this._$$_tsdocConfiguration
            }, [codeSpinnet]));
          }
        }

        this._$$_writeClassTables(output, apiItem);

        break;

      case "Enum"
      /* Enum */
      :
        this._$$_writeEnumTables(output, apiItem);

        break;

      case "Interface"
      /* Interface */
      :
        this._$$_writeInterfaceTables(output, apiItem);

        break;

      case "Constructor"
      /* Constructor */
      :
      case "ConstructSignature"
      /* ConstructSignature */
      :
      case "Method"
      /* Method */
      :
      case "MethodSignature"
      /* MethodSignature */
      :
      case "Function"
      /* Function */
      :
        this._$$_writeParameterTables(output, apiItem);

        this._$$_writeThrowsSection(output, apiItem);

        break;

      case "Namespace"
      /* Namespace */
      :
        this._$$_writePackageOrNamespaceTables(output, apiItem);

        break;

      case "Model"
      /* Model */
      :
        this._$$_writeModelTable(output, apiItem);

        break;

      case "Package"
      /* Package */
      :
        this._$$_writePackageOrNamespaceTables(output, apiItem);

        break;

      case "Property"
      /* Property */
      :
      case "PropertySignature"
      /* PropertySignature */
      :
        break;

      case "TypeAlias"
      /* TypeAlias */
      :
        break;

      case "Variable"
      /* Variable */
      :
        break;

      default:
        throw new Error('Unsupported API item kind: ' + apiItem.kind);
    }

    if (appendRemarks) {
      this._$$_writeRemarksSection(output, apiItem);
    }

    var filename = path.join(this._$$_outputFolder, this._$$_getFilenameForApiItem(apiItem));
    var stringBuilder = new tsdoc.StringBuilder();
    stringBuilder.append('<!-- Do not edit this file. It is automatically generated by API Documenter. -->\n\n');

    this._$$_markdownEmitter.emit(stringBuilder, output, {
      contextApiItem: apiItem,
      onGetFilenameForApiItem: function onGetFilenameForApiItem(apiItemForFilename) {
        return _this2._$$_getLinkFilenameForApiItem(apiItemForFilename);
      }
    });

    var pageContent = stringBuilder.toString();

    if (this._$$_pluginLoader.markdownDocumenterFeature) {
      // Allow the plugin to customize the pageContent
      var eventArgs = {
        apiItem: apiItem,
        outputFilename: filename,
        pageContent: pageContent
      };

      this._$$_pluginLoader.markdownDocumenterFeature.onBeforeWritePage(eventArgs);

      pageContent = eventArgs.pageContent;
    }

    nodeCoreLibrary.FileSystem.writeFile(filename, pageContent, {
      // @ts-ignore
      vertLineEndings: this._$$_documenterConfig ? this._$$_documenterConfig.newlineKind : "\r\n"
      /* CrLf */

    });
  };

  _proto._$$_writeRemarksSection = function _$$_writeRemarksSection(output, apiItem) {
    if (apiItem instanceof apiExtractorModel.ApiDocumentedItem) {
      var tsdocComment = apiItem.tsdocComment;

      if (tsdocComment) {
        // Write the @remarks block
        if (tsdocComment.remarksBlock) {
          output.appendNode(new DocHeading({
            configuration: this._$$_tsdocConfiguration,
            title: 'Remarks'
          }));

          this._$$_appendSection(output, tsdocComment.remarksBlock.content);
        } // Write the @example blocks


        var exampleBlocks = tsdocComment.customBlocks.filter(function (x) {
          return x.blockTag.tagNameWithUpperCase === tsdoc.StandardTags.example.tagNameWithUpperCase;
        });
        var exampleNumber = 1;

        for (var _iterator = exampleBlocks, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var exampleBlock = _ref;
          var heading = exampleBlocks.length > 1 ? "Example " + exampleNumber : 'Example';
          output.appendNode(new DocHeading({
            configuration: this._$$_tsdocConfiguration,
            title: heading
          }));

          this._$$_appendSection(output, exampleBlock.content);

          ++exampleNumber;
        }
      }
    }
  }
  /**
   *
   * @author yuyi
   * @param output
   * @param section
   * @param parent
   */
  ;

  _proto._$$getSummaryConnect = function _$$getSummaryConnect(output, section, parent) {
    if (parent === void 0) {
      parent = [];
    }

    if (!section) return null;

    if (section.kind === DocNodeKind$1.BlockTag && section._tagName === '@includeSnippet') {
      // if (section) {
      var includeSpinning = section;
      var parentNode = parent[parent.length - 1];
      var next = parentNode.getChildNodes()[parentNode.getChildNodes().findIndex(function (i) {
        return i === section;
      }) + 1];

      if (next.kind === DocNodeKind$1.PlainText) {
        var text = next.text;

        var _text$split = text.split('#'),
            codePath = _text$split[0],
            name = _text$split[1];

        if (codePath) {
          var filePath = path.relative(process.cwd(), codePath.replace(/^( )+/, '').replace('~', this.projectFolder));
          console.log( // includeSpinning.configuration.tagDefinitions,
          includeSpinning.kind, text, filePath);
          var readFile = nodeCoreLibrary.FileSystem.readFile(filePath); // const code = /test\(['"](.*?)['"], (.[\s\S]*)\)/.exec(readFile);
          // console.log(code);

          parentNode.clearNodes(); // output.appendNodeInParagraph()

          return new tsdoc.DocFencedCode({
            code: readFile,
            language: 'ts',
            configuration: this._$$_tsdocConfiguration
          });
        }
      }
    } else if (section.kind === DocNodeKind$1.Section || section.kind === 'Paragraph' || section.kind === 'SoftBreak') {
      for (var _iterator2 = section.getChildNodes(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var item = _ref2;

        var r = this._$$getSummaryConnect(output, item, [].concat(parent, [section]));

        if (r) return r;
      }
    }

    return null;
  };

  _proto._$$_writeThrowsSection = function _$$_writeThrowsSection(output, apiItem) {
    if (apiItem instanceof apiExtractorModel.ApiDocumentedItem) {
      var tsdocComment = apiItem.tsdocComment;

      if (tsdocComment) {
        // Write the @throws blocks
        var throwsBlocks = tsdocComment.customBlocks.filter(function (x) {
          return x.blockTag.tagNameWithUpperCase === tsdoc.StandardTags.throws.tagNameWithUpperCase;
        });

        if (throwsBlocks.length > 0) {
          var heading = 'Exceptions';
          output.appendNode(new DocHeading({
            configuration: this._$$_tsdocConfiguration,
            title: heading
          }));

          for (var _iterator3 = throwsBlocks, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
              if (_i3 >= _iterator3.length) break;
              _ref3 = _iterator3[_i3++];
            } else {
              _i3 = _iterator3.next();
              if (_i3.done) break;
              _ref3 = _i3.value;
            }

            var throwsBlock = _ref3;

            this._$$_appendSection(output, throwsBlock.content);
          }
        }
      }
    }
  }
  /**
   * GENERATE PAGE: MODEL
   */
  ;

  _proto._$$_writeModelTable = function _$$_writeModelTable(output, apiModel) {
    var configuration = this._$$_tsdocConfiguration;
    var packagesTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Package', 'Description']
    });

    for (var _iterator4 = apiModel.members, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref4 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref4 = _i4.value;
      }

      var apiMember = _ref4;
      var row = new DocTableRow({
        configuration: configuration
      }, [this._$$_createTitleCell(apiMember), this._$$_createDescriptionCell(apiMember)]);

      switch (apiMember.kind) {
        case "Package"
        /* Package */
        :
          packagesTable.addRow(row);

          this._$$_writeApiItemPage(apiMember);

          break;
      }
    }

    if (packagesTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Packages'
      }));
      output.appendNode(packagesTable);
    }
  }
  /**
   * GENERATE PAGE: PACKAGE or NAMESPACE
   */
  ;

  _proto._$$_writePackageOrNamespaceTables = function _$$_writePackageOrNamespaceTables(output, apiContainer) {
    var configuration = this._$$_tsdocConfiguration;
    var classesTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Class', 'Description']
    });
    var enumerationsTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Enumeration', 'Description']
    });
    var functionsTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Function', 'Description']
    });
    var interfacesTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Interface', 'Description']
    });
    var namespacesTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Namespace', 'Description']
    });
    var variablesTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Variable', 'Description']
    });
    var typeAliasesTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Type Alias', 'Description']
    });
    var apiMembers = apiContainer.kind === "Package"
    /* Package */
    ? apiContainer.entryPoints[0].members : apiContainer.members;

    for (var _iterator5 = apiMembers, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray5) {
        if (_i5 >= _iterator5.length) break;
        _ref5 = _iterator5[_i5++];
      } else {
        _i5 = _iterator5.next();
        if (_i5.done) break;
        _ref5 = _i5.value;
      }

      var apiMember = _ref5;
      var row = new DocTableRow({
        configuration: configuration
      }, [this._$$_createTitleCell(apiMember), this._$$_createDescriptionCell(apiMember)]);

      switch (apiMember.kind) {
        case "Class"
        /* Class */
        :
          classesTable.addRow(row);

          this._$$_writeApiItemPage(apiMember);

          break;

        case "Enum"
        /* Enum */
        :
          enumerationsTable.addRow(row);

          this._$$_writeApiItemPage(apiMember);

          break;

        case "Interface"
        /* Interface */
        :
          interfacesTable.addRow(row);

          this._$$_writeApiItemPage(apiMember);

          break;

        case "Namespace"
        /* Namespace */
        :
          namespacesTable.addRow(row);

          this._$$_writeApiItemPage(apiMember);

          break;

        case "Function"
        /* Function */
        :
          functionsTable.addRow(row);

          this._$$_writeApiItemPage(apiMember);

          break;

        case "TypeAlias"
        /* TypeAlias */
        :
          typeAliasesTable.addRow(row);

          this._$$_writeApiItemPage(apiMember);

          break;

        case "Variable"
        /* Variable */
        :
          variablesTable.addRow(row);

          this._$$_writeApiItemPage(apiMember);

          break;
      }
    }

    if (classesTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Classes'
      }));
      output.appendNode(classesTable);
    }

    if (enumerationsTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Enumerations'
      }));
      output.appendNode(enumerationsTable);
    }

    if (functionsTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Functions'
      }));
      output.appendNode(functionsTable);
    }

    if (interfacesTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Interfaces'
      }));
      output.appendNode(interfacesTable);
    }

    if (namespacesTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Namespaces'
      }));
      output.appendNode(namespacesTable);
    }

    if (variablesTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Variables'
      }));
      output.appendNode(variablesTable);
    }

    if (typeAliasesTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Type Aliases'
      }));
      output.appendNode(typeAliasesTable);
    }
  }
  /**
   * GENERATE PAGE: CLASS
   */
  ;

  _proto._$$_writeClassTables = function _$$_writeClassTables(output, apiClass) {
    var configuration = this._$$_tsdocConfiguration;
    var eventsTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Property', 'Modifiers', 'Type', 'Description']
    });
    var constructorsTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Constructor', 'Modifiers', 'Description']
    });
    var propertiesTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Property', 'Modifiers', 'Type', 'Description']
    });
    var methodsTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Method', 'Modifiers', 'Description']
    });

    for (var _iterator6 = apiClass.members, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray6) {
        if (_i6 >= _iterator6.length) break;
        _ref6 = _iterator6[_i6++];
      } else {
        _i6 = _iterator6.next();
        if (_i6.done) break;
        _ref6 = _i6.value;
      }

      var apiMember = _ref6;

      switch (apiMember.kind) {
        case "Constructor"
        /* Constructor */
        :
          {
            constructorsTable.addRow(new DocTableRow({
              configuration: configuration
            }, [this._$$_createTitleCell(apiMember), this._$$_createModifiersCell(apiMember), this._$$_createDescriptionCell(apiMember)]));

            this._$$_writeApiItemPage(apiMember);

            break;
          }

        case "Method"
        /* Method */
        :
          {
            methodsTable.addRow(new DocTableRow({
              configuration: configuration
            }, [this._$$_createTitleCell(apiMember), this._$$_createModifiersCell(apiMember), this._$$_createDescriptionCell(apiMember)]));

            this._$$_writeApiItemPage(apiMember);

            break;
          }

        case "Property"
        /* Property */
        :
          {
            if (apiMember.isEventProperty) {
              eventsTable.addRow(new DocTableRow({
                configuration: configuration
              }, [this._$$_createTitleCell(apiMember), this._$$_createModifiersCell(apiMember), this._$$_createPropertyTypeCell(apiMember), this._$$_createDescriptionCell(apiMember)]));
            } else {
              propertiesTable.addRow(new DocTableRow({
                configuration: configuration
              }, [this._$$_createTitleCell(apiMember), this._$$_createModifiersCell(apiMember), this._$$_createPropertyTypeCell(apiMember), this._$$_createDescriptionCell(apiMember)]));
            }

            this._$$_writeApiItemPage(apiMember);

            break;
          }
      }
    }

    if (eventsTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Events'
      }));
      output.appendNode(eventsTable);
    }

    if (constructorsTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Constructors'
      }));
      output.appendNode(constructorsTable);
    }

    if (propertiesTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Properties'
      }));
      output.appendNode(propertiesTable);
    }

    if (methodsTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Methods'
      }));
      output.appendNode(methodsTable);
    }
  }
  /**
   * GENERATE PAGE: ENUM
   */
  ;

  _proto._$$_writeEnumTables = function _$$_writeEnumTables(output, apiEnum) {
    var configuration = this._$$_tsdocConfiguration;
    var enumMembersTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Member', 'Value', 'Description']
    });

    for (var _iterator7 = apiEnum.members, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
      var _ref7;

      if (_isArray7) {
        if (_i7 >= _iterator7.length) break;
        _ref7 = _iterator7[_i7++];
      } else {
        _i7 = _iterator7.next();
        if (_i7.done) break;
        _ref7 = _i7.value;
      }

      var apiEnumMember = _ref7;
      enumMembersTable.addRow(new DocTableRow({
        configuration: configuration
      }, [new DocTableCell({
        configuration: configuration
      }, [new tsdoc.DocParagraph({
        configuration: configuration
      }, [new tsdoc.DocPlainText({
        configuration: configuration,
        text: Utilities.getConciseSignature(apiEnumMember)
      })])]), new DocTableCell({
        configuration: configuration
      }, [new tsdoc.DocParagraph({
        configuration: configuration
      }, [new tsdoc.DocCodeSpan({
        configuration: configuration,
        code: apiEnumMember.initializerExcerpt.text
      })])]), this._$$_createDescriptionCell(apiEnumMember)]));
    }

    if (enumMembersTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Enumeration Members'
      }));
      output.appendNode(enumMembersTable);
    }
  }
  /**
   * GENERATE PAGE: INTERFACE
   */
  ;

  _proto._$$_writeInterfaceTables = function _$$_writeInterfaceTables(output, apiClass) {
    var configuration = this._$$_tsdocConfiguration;
    var eventsTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Property', 'Type', 'Description']
    });
    var propertiesTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Property', 'Type', 'Description']
    });
    var methodsTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Method', 'Description']
    });

    for (var _iterator8 = apiClass.members, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
      var _ref8;

      if (_isArray8) {
        if (_i8 >= _iterator8.length) break;
        _ref8 = _iterator8[_i8++];
      } else {
        _i8 = _iterator8.next();
        if (_i8.done) break;
        _ref8 = _i8.value;
      }

      var apiMember = _ref8;

      switch (apiMember.kind) {
        case "ConstructSignature"
        /* ConstructSignature */
        :
        case "MethodSignature"
        /* MethodSignature */
        :
          {
            methodsTable.addRow(new DocTableRow({
              configuration: configuration
            }, [this._$$_createTitleCell(apiMember), this._$$_createDescriptionCell(apiMember)]));

            this._$$_writeApiItemPage(apiMember);

            break;
          }

        case "PropertySignature"
        /* PropertySignature */
        :
          {
            if (apiMember.isEventProperty) {
              eventsTable.addRow(new DocTableRow({
                configuration: configuration
              }, [this._$$_createTitleCell(apiMember), this._$$_createPropertyTypeCell(apiMember), this._$$_createDescriptionCell(apiMember)]));
            } else {
              propertiesTable.addRow(new DocTableRow({
                configuration: configuration
              }, [this._$$_createTitleCell(apiMember), this._$$_createPropertyTypeCell(apiMember), this._$$_createDescriptionCell(apiMember)]));
            }

            this._$$_writeApiItemPage(apiMember);

            break;
          }
      }
    }

    if (eventsTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Events'
      }));
      output.appendNode(eventsTable);
    }

    if (propertiesTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Properties'
      }));
      output.appendNode(propertiesTable);
    }

    if (methodsTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Methods'
      }));
      output.appendNode(methodsTable);
    }
  }
  /**
   * GENERATE PAGE: FUNCTION-LIKE
   */
  ;

  _proto._$$_writeParameterTables = function _$$_writeParameterTables(output, apiParameterListMixin) {
    var configuration = this._$$_tsdocConfiguration;
    var parametersTable = new DocTable({
      configuration: configuration,
      headerTitles: ['Parameter', 'Type', 'Description']
    });

    for (var _iterator9 = apiParameterListMixin.parameters, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
      var _ref9;

      if (_isArray9) {
        if (_i9 >= _iterator9.length) break;
        _ref9 = _iterator9[_i9++];
      } else {
        _i9 = _iterator9.next();
        if (_i9.done) break;
        _ref9 = _i9.value;
      }

      var apiParameter = _ref9;
      var parameterDescription = new tsdoc.DocSection({
        configuration: configuration
      });

      if (apiParameter.tsdocParamBlock) {
        this._$$_appendSection(parameterDescription, apiParameter.tsdocParamBlock.content);
      }

      parametersTable.addRow(new DocTableRow({
        configuration: configuration
      }, [new DocTableCell({
        configuration: configuration
      }, [new tsdoc.DocParagraph({
        configuration: configuration
      }, [new tsdoc.DocPlainText({
        configuration: configuration,
        text: apiParameter.name
      })])]), new DocTableCell({
        configuration: configuration
      }, [new tsdoc.DocParagraph({
        configuration: configuration
      }, [new tsdoc.DocCodeSpan({
        configuration: configuration,
        code: apiParameter.parameterTypeExcerpt.text
      })])]), new DocTableCell({
        configuration: configuration
      }, parameterDescription.nodes)]));
    }

    if (parametersTable.rows.length > 0) {
      output.appendNode(new DocHeading({
        configuration: this._$$_tsdocConfiguration,
        title: 'Parameters'
      }));
      output.appendNode(parametersTable);
    }

    if (apiExtractorModel.ApiReturnTypeMixin.isBaseClassOf(apiParameterListMixin)) {
      var returnTypeExcerpt = apiParameterListMixin.returnTypeExcerpt;
      output.appendNode(new tsdoc.DocParagraph({
        configuration: configuration
      }, [new DocEmphasisSpan({
        configuration: configuration,
        bold: true
      }, [new tsdoc.DocPlainText({
        configuration: configuration,
        text: 'Returns:'
      })])]));
      output.appendNode(new tsdoc.DocParagraph({
        configuration: configuration
      }, [new tsdoc.DocCodeSpan({
        configuration: configuration,
        code: returnTypeExcerpt.text.trim() || '(not declared)'
      })]));

      if (apiParameterListMixin instanceof apiExtractorModel.ApiDocumentedItem) {
        if (apiParameterListMixin.tsdocComment && apiParameterListMixin.tsdocComment.returnsBlock) {
          this._$$_appendSection(output, apiParameterListMixin.tsdocComment.returnsBlock.content);
        }
      }
    }
  };

  _proto._$$_createTitleCell = function _$$_createTitleCell(apiItem) {
    var configuration = this._$$_tsdocConfiguration;
    return new DocTableCell({
      configuration: configuration
    }, [new tsdoc.DocParagraph({
      configuration: configuration
    }, [new tsdoc.DocLinkTag({
      configuration: configuration,
      tagName: '@link',
      linkText: Utilities.getConciseSignature(apiItem),
      urlDestination: this._$$_getLinkFilenameForApiItem(apiItem)
    })])]);
  }
  /**
   * This generates a DocTableCell for an ApiItem including the summary section and "(BETA)" annotation.
   *
   * @remarks
   * We mostly assume that the input is an ApiDocumentedItem, but it's easier to perform this as a runtime
   * check than to have each caller perform a type cast.
   */
  ;

  _proto._$$_createDescriptionCell = function _$$_createDescriptionCell(apiItem) {
    var configuration = this._$$_tsdocConfiguration;
    var section = new tsdoc.DocSection({
      configuration: configuration
    });

    if (apiExtractorModel.ApiReleaseTagMixin.isBaseClassOf(apiItem)) {
      if (apiItem.releaseTag === apiExtractorModel.ReleaseTag.Beta) {
        section.appendNodesInParagraph([new DocEmphasisSpan({
          configuration: configuration,
          bold: true,
          italic: true
        }, [new tsdoc.DocPlainText({
          configuration: configuration,
          text: '(BETA)'
        })]), new tsdoc.DocPlainText({
          configuration: configuration,
          text: ' '
        })]);
      }
    }

    if (apiItem instanceof apiExtractorModel.ApiDocumentedItem) {
      if (apiItem.tsdocComment !== undefined) {
        this._$$_appendAndMergeSection(section, apiItem.tsdocComment.summarySection);
      }
    }

    return new DocTableCell({
      configuration: configuration
    }, section.nodes);
  };

  _proto._$$_createModifiersCell = function _$$_createModifiersCell(apiItem) {
    var configuration = this._$$_tsdocConfiguration;
    var section = new tsdoc.DocSection({
      configuration: configuration
    });

    if (apiExtractorModel.ApiStaticMixin.isBaseClassOf(apiItem)) {
      if (apiItem.isStatic) {
        section.appendNodeInParagraph(new tsdoc.DocCodeSpan({
          configuration: configuration,
          code: 'static'
        }));
      }
    }

    return new DocTableCell({
      configuration: configuration
    }, section.nodes);
  };

  _proto._$$_createPropertyTypeCell = function _$$_createPropertyTypeCell(apiItem) {
    var configuration = this._$$_tsdocConfiguration;
    var section = new tsdoc.DocSection({
      configuration: configuration
    });

    if (apiItem instanceof apiExtractorModel.ApiPropertyItem) {
      section.appendNodeInParagraph(new tsdoc.DocCodeSpan({
        configuration: configuration,
        code: apiItem.propertyTypeExcerpt.text
      }));
    }

    return new DocTableCell({
      configuration: configuration
    }, section.nodes);
  };

  _proto._$$_writeBreadcrumb = function _$$_writeBreadcrumb(output, apiItem) {
    output.appendNodeInParagraph(new tsdoc.DocLinkTag({
      configuration: this._$$_tsdocConfiguration,
      tagName: '@link',
      linkText: 'Home',
      urlDestination: this._$$_getLinkFilenameForApiItem(this._$$_apiModel)
    }));

    for (var _iterator10 = apiItem.getHierarchy(), _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
      var _ref10;

      if (_isArray10) {
        if (_i10 >= _iterator10.length) break;
        _ref10 = _iterator10[_i10++];
      } else {
        _i10 = _iterator10.next();
        if (_i10.done) break;
        _ref10 = _i10.value;
      }

      var hierarchyItem = _ref10;

      switch (hierarchyItem.kind) {
        case "Model"
        /* Model */
        :
        case "EntryPoint"
        /* EntryPoint */
        :
          // We don't show the model as part of the breadcrumb because it is the root-level container.
          // We don't show the entry point because today API Extractor doesn't support multiple entry points;
          // this may change in the future.
          break;

        default:
          output.appendNodesInParagraph([new tsdoc.DocPlainText({
            configuration: this._$$_tsdocConfiguration,
            text: ' > '
          }), new tsdoc.DocLinkTag({
            configuration: this._$$_tsdocConfiguration,
            tagName: '@link',
            linkText: hierarchyItem.displayName,
            urlDestination: this._$$_getLinkFilenameForApiItem(hierarchyItem)
          })]);
      }
    }
  };

  _proto._$$_writeBetaWarning = function _$$_writeBetaWarning(output) {
    var configuration = this._$$_tsdocConfiguration;
    var betaWarning = 'This API is provided as a preview for developers and may change' + ' based on feedback that we receive.  Do not use this API in a production environment.';
    output.appendNode(new DocNoteBox({
      configuration: configuration
    }, [new tsdoc.DocParagraph({
      configuration: configuration
    }, [new tsdoc.DocPlainText({
      configuration: configuration,
      text: betaWarning
    })])]));
  };

  _proto._$$_appendSection = function _$$_appendSection(output, docSection) {
    for (var _iterator11 = docSection.nodes, _isArray11 = Array.isArray(_iterator11), _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
      var _ref11;

      if (_isArray11) {
        if (_i11 >= _iterator11.length) break;
        _ref11 = _iterator11[_i11++];
      } else {
        _i11 = _iterator11.next();
        if (_i11.done) break;
        _ref11 = _i11.value;
      }

      var node = _ref11;
      output.appendNode(node);
    }
  };

  _proto._$$_appendAndMergeSection = function _$$_appendAndMergeSection(output, docSection) {
    var firstNode = true;

    for (var _iterator12 = docSection.nodes, _isArray12 = Array.isArray(_iterator12), _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
      var _ref12;

      if (_isArray12) {
        if (_i12 >= _iterator12.length) break;
        _ref12 = _iterator12[_i12++];
      } else {
        _i12 = _iterator12.next();
        if (_i12.done) break;
        _ref12 = _i12.value;
      }

      var node = _ref12;

      if (firstNode) {
        if (node.kind === DocNodeKind$1.Paragraph) {
          output.appendNodesInParagraph(node.getChildNodes());
          firstNode = false;
          continue;
        }
      }

      firstNode = false;
      output.appendNode(node);
    }
  };

  _proto._$$_getFilenameForApiItem = function _$$_getFilenameForApiItem(apiItem) {
    if (apiItem.kind === "Model"
    /* Model */
    ) {
        return 'index.md';
      }

    var baseName = '';

    for (var _iterator13 = apiItem.getHierarchy(), _isArray13 = Array.isArray(_iterator13), _i13 = 0, _iterator13 = _isArray13 ? _iterator13 : _iterator13[Symbol.iterator]();;) {
      var _ref13;

      if (_isArray13) {
        if (_i13 >= _iterator13.length) break;
        _ref13 = _iterator13[_i13++];
      } else {
        _i13 = _iterator13.next();
        if (_i13.done) break;
        _ref13 = _i13.value;
      }

      var hierarchyItem = _ref13;
      // For overloaded methods, add a suffix such as "MyClass.myMethod_2".
      var qualifiedName = Utilities.getSafeFilenameForName(hierarchyItem.displayName);

      if (apiExtractorModel.ApiParameterListMixin.isBaseClassOf(hierarchyItem)) {
        if (hierarchyItem.overloadIndex > 1) {
          // Subtract one for compatibility with earlier releases of API Documenter.
          // (This will get revamped when we fix GitHub issue #1308)
          qualifiedName += "_" + (hierarchyItem.overloadIndex - 1);
        }
      }

      switch (hierarchyItem.kind) {
        case "Model"
        /* Model */
        :
        case "EntryPoint"
        /* EntryPoint */
        :
          break;

        case "Package"
        /* Package */
        :
          baseName = Utilities.getSafeFilenameForName(nodeCoreLibrary.PackageName.getUnscopedName(hierarchyItem.displayName));
          break;

        default:
          baseName += '.' + qualifiedName;
      }
    }

    return baseName + '.md';
  };

  _proto._$$_getLinkFilenameForApiItem = function _$$_getLinkFilenameForApiItem(apiItem) {
    return './' + this._$$_getFilenameForApiItem(apiItem);
  };

  _proto._$$_deleteOldOutputFiles = function _$$_deleteOldOutputFiles() {
    console.log('Deleting old output from ' + this._$$_outputFolder);
    nodeCoreLibrary.FileSystem.ensureEmptyFolder(this._$$_outputFolder);
  };

  return MarkdownDocumenter;
}();

var MarkdownAction =
/*#__PURE__*/
function (_BaseAction) {
  _inheritsLoose(MarkdownAction, _BaseAction);

  function MarkdownAction(inputFolder, outputFolder) {
    var _this;

    _this = _BaseAction.call(this, inputFolder, outputFolder) || this;
    _this.inputFolder = inputFolder;
    _this.outputFolder = outputFolder;
    return _this;
  }

  var _proto = MarkdownAction.prototype;

  _proto.onExecute = function onExecute(projectFolder) {
    console.error(this.inputFolder, this.outputFolder);
    var apiModel = this.buildApiModel();
    var markdownDocumenter = new MarkdownDocumenter(apiModel, projectFolder, undefined);
    markdownDocumenter.generateFiles(this.outputFolder);
    return Promise.resolve();
  };

  return MarkdownAction;
}(BaseAction);

// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.

var yaml =
/*#__PURE__*/
require('js-yaml');

var yamlApiSchema =
/*#__PURE__*/
nodeCoreLibrary.JsonSchema.fromFile(
/*#__PURE__*/
path.join(__dirname, '..', 'yaml', 'typescript.schema.json'));
var Navigation = {
  Exports: ".",
  Members: "#",
  Locals: "~"
};
/**
 * Writes documentation in the Universal Reference YAML file format, as defined by typescript.schema.json.
 */

var YamlDocumenter =
/*#__PURE__*/
function () {
  function YamlDocumenter(apiModel, newDocfxNamespaces) {
    if (newDocfxNamespaces === void 0) {
      newDocfxNamespaces = false;
    }

    this._$$_apiModel = apiModel;
    this.newDocfxNamespaces = newDocfxNamespaces;
    this._$$_markdownEmitter = new CustomMarkdownEmitter(this._$$_apiModel);
    this._$$_apiItemsByCanonicalReference = new Map();

    this._$$_initApiItems();
  }
  /** @virtual */


  var _proto = YamlDocumenter.prototype;

  _proto.generateFiles = function generateFiles(outputFolder) {
    this._$$_outputFolder = outputFolder;
    console.log();

    this._$$_deleteOldOutputFiles();

    for (var _iterator = this._$$_apiModel.packages, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var apiPackage = _ref;
      console.log("Writing " + apiPackage.name + " package");

      this._$$_visitApiItems(apiPackage, undefined);
    }

    this._$$_writeTocFile(this._$$_apiModel.packages);
  }
  /** @virtual */
  ;

  _proto.onGetTocRoot = function onGetTocRoot() {
    return {
      name: 'SharePoint Framework reference',
      href: '~/overview/sharepoint.md',
      items: []
    };
  }
  /** @virtual */
  ;

  _proto.onCustomizeYamlItem = function onCustomizeYamlItem(yamlItem) {};

  _proto._$$_visitApiItems = function _$$_visitApiItems(apiItem, parentYamlFile) {
    var savedYamlReferences;

    if (!this._shouldEmbed(apiItem.kind)) {
      savedYamlReferences = this._$$_yamlReferences;
      this._$$_yamlReferences = undefined;
    }

    var yamlItem = this._$$_generateYamlItem(apiItem);

    if (!yamlItem) {
      return false;
    }

    this.onCustomizeYamlItem(yamlItem);

    if (this._shouldEmbed(apiItem.kind)) {
      if (!parentYamlFile) {
        throw new nodeCoreLibrary.InternalError('Missing file context');
      }

      parentYamlFile.items.push(yamlItem);
    } else {
      var newYamlFile = {
        items: []
      };
      newYamlFile.items.push(yamlItem);

      var children = this._getLogicalChildren(apiItem);

      for (var _iterator2 = children, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var child = _ref2;

        if (child instanceof apiExtractorModel.ApiDocumentedItem) {
          if (this._$$_visitApiItems(child, newYamlFile)) {
            if (!yamlItem.children) {
              yamlItem.children = [];
            }

            yamlItem.children.push(this._getUid(child));
          }
        }
      }

      if (this._$$_yamlReferences && this._$$_yamlReferences.references.length > 0) {
        newYamlFile.references = this._$$_yamlReferences.references;
      }

      this._$$_yamlReferences = savedYamlReferences;

      var yamlFilePath = this._$$_getYamlFilePath(apiItem);

      if (apiItem.kind === "Package"
      /* Package */
      ) {
          console.log('Writing ' + yamlFilePath);
        }

      this._$$_writeYamlFile(newYamlFile, yamlFilePath, 'UniversalReference', yamlApiSchema);

      if (parentYamlFile) {
        // References should be recorded in the parent YAML file with the local name of the embedded item.
        // This avoids unnecessary repetition when listing items inside of a namespace.
        this._$$_recordYamlReference(this._$$_ensureYamlReferences(), this._getUid(apiItem), this._$$_getYamlItemName(apiItem, {
          includeNamespace: !this.newDocfxNamespaces,
          includeSignature: true
        }), this._$$_getYamlItemName(apiItem, {
          includeNamespace: true,
          includeSignature: true
        }));
      }
    }

    return true;
  };

  _proto._getLogicalChildren = function _getLogicalChildren(apiItem) {
    var children = [];

    if (apiItem.kind === "Package"
    /* Package */
    ) {
        // Skip over the entry point, since it's not part of the documentation hierarchy
        this._$$_flattenNamespaces(apiItem.members[0].members, children, this.newDocfxNamespaces ? 0
        /* NestedNamespacesAndChildren */
        : 3
        /* NestedChildren */
        );
      } else {
      this._$$_flattenNamespaces(apiItem.members, children, this.newDocfxNamespaces ? 2
      /* ImmediateChildren */
      : 3
      /* NestedChildren */
      );
    }

    return children;
  } // Flattens nested namespaces into top level entries so that the following:
  //   namespace X { export namespace Y { export namespace Z { } }
  // Is represented as:
  //   - X
  //   - X.Y
  //   - X.Y.Z
  ;

  _proto._$$_flattenNamespaces = function _$$_flattenNamespaces(items, childrenOut, mode) {
    var hasNonNamespaceChildren = false;

    for (var _iterator3 = items, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var item = _ref3;

      if (item.kind === "Namespace"
      /* Namespace */
      ) {
          switch (mode) {
            case 3
            /* NestedChildren */
            :
              // Include children of namespaces, but not the namespaces themselves. This matches existing legacy behavior.
              this._$$_flattenNamespaces(item.members, childrenOut, 3
              /* NestedChildren */
              );

              break;

            case 1
            /* NestedNamespacesOnly */
            :
            case 0
            /* NestedNamespacesAndChildren */
            :
              // At any level, always include a nested namespace if it has non-namespace children, but do not include its
              // non-namespace children in the result.
              // Record the offset at which the namespace is added in case we need to remove it later.
              var index = childrenOut.length;
              childrenOut.push(item);

              if (!this._$$_flattenNamespaces(item.members, childrenOut, 1
              /* NestedNamespacesOnly */
              )) {
                // This namespace had no non-namespace children, remove it.
                childrenOut.splice(index, 1);
              }

              break;
          }
        } else if (this._shouldInclude(item.kind)) {
        switch (mode) {
          case 3
          /* NestedChildren */
          :
          case 0
          /* NestedNamespacesAndChildren */
          :
          case 2
          /* ImmediateChildren */
          :
            // At the top level, include non-namespace children as well.
            childrenOut.push(item);
            break;
        }

        hasNonNamespaceChildren = true;
      }
    }

    return hasNonNamespaceChildren;
  }
  /**
   * Write the table of contents
   */
  ;

  _proto._$$_writeTocFile = function _$$_writeTocFile(apiItems) {
    var tocFile = this.buildYamlTocFile(apiItems);
    var tocFilePath = path.join(this._$$_outputFolder, 'toc.yml');
    console.log('Writing ' + tocFilePath);

    this._$$_writeYamlFile(tocFile, tocFilePath, '', undefined);
  }
  /** @virtual */
  ;

  _proto.buildYamlTocFile = function buildYamlTocFile(apiItems) {
    var _rootItem$items;

    var tocFile = {
      items: []
    };
    var rootItem = this.onGetTocRoot();
    tocFile.items.push(rootItem);

    (_rootItem$items = rootItem.items).push.apply(_rootItem$items, this._$$_buildTocItems(apiItems));

    return tocFile;
  };

  _proto._$$_buildTocItems = function _$$_buildTocItems(apiItems) {
    var tocItems = [];

    for (var _iterator4 = apiItems, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref4 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref4 = _i4.value;
      }

      var apiItem = _ref4;
      var tocItem = void 0;

      if (apiItem.kind === "Namespace"
      /* Namespace */
      && !this.newDocfxNamespaces) {
        tocItem = {
          name: this._getTocItemName(apiItem)
        };
      } else {
        if (this._shouldEmbed(apiItem.kind)) {
          // Don't generate table of contents items for embedded definitions
          continue;
        }

        tocItem = {
          name: this._getTocItemName(apiItem),
          uid: this._getUid(apiItem)
        };
      }

      tocItems.push(tocItem);

      var children = this._getLogicalChildren(apiItem);

      var childItems = this._$$_buildTocItems(children);

      if (childItems.length > 0) {
        tocItem.items = childItems;
      }
    }

    return tocItems;
  }
  /** @virtual */
  ;

  _proto._getTocItemName = function _getTocItemName(apiItem) {
    var name;

    if (apiItem.kind === "Package"
    /* Package */
    ) {
        name = nodeCoreLibrary.PackageName.getUnscopedName(apiItem.displayName);
      } else {
      name = this._$$_getYamlItemName(apiItem);
    }

    if (name === apiItem.displayName && apiItem.getMergedSiblings().length > 1) {
      name += " (" + apiItem.kind + ")";
    }

    return name;
  };

  _proto._shouldEmbed = function _shouldEmbed(apiItemKind) {
    switch (apiItemKind) {
      case "Class"
      /* Class */
      :
      case "Package"
      /* Package */
      :
      case "Interface"
      /* Interface */
      :
      case "Enum"
      /* Enum */
      :
        return false;

      case "Namespace"
      /* Namespace */
      :
        return !this.newDocfxNamespaces;
    }

    return true;
  };

  _proto._shouldInclude = function _shouldInclude(apiItemKind) {
    // Filter out known items that are not yet supported
    switch (apiItemKind) {
      case "CallSignature"
      /* CallSignature */
      :
      case "ConstructSignature"
      /* ConstructSignature */
      :
      case "IndexSignature"
      /* IndexSignature */
      :
        return false;
    }

    return true;
  };

  _proto._$$_generateYamlItem = function _$$_generateYamlItem(apiItem) {
    // Filter out known items that are not yet supported
    if (!this._shouldInclude(apiItem.kind)) {
      return undefined;
    }

    var uid = this._getUidObject(apiItem);

    var yamlItem = {
      uid: uid.toString()
    };

    if (apiItem.tsdocComment) {
      var tsdocComment = apiItem.tsdocComment;

      if (tsdocComment.summarySection) {
        var summary = this._$$_renderMarkdown(tsdocComment.summarySection, apiItem);

        if (summary) {
          yamlItem.summary = summary;
        }
      }

      if (tsdocComment.remarksBlock) {
        var remarks = this._$$_renderMarkdown(tsdocComment.remarksBlock.content, apiItem);

        if (remarks) {
          yamlItem.remarks = remarks;
        }
      }

      if (tsdocComment.deprecatedBlock) {
        var deprecatedMessage = this._$$_renderMarkdown(tsdocComment.deprecatedBlock.content, apiItem);

        if (deprecatedMessage.length > 0) {
          yamlItem.deprecated = {
            content: deprecatedMessage
          };
        }
      }
    }

    if (apiExtractorModel.ApiReleaseTagMixin.isBaseClassOf(apiItem)) {
      if (apiItem.releaseTag === apiExtractorModel.ReleaseTag.Beta) {
        yamlItem.isPreview = true;
      }
    }

    yamlItem.name = this._$$_getYamlItemName(apiItem, {
      includeSignature: true,
      includeNamespace: !this.newDocfxNamespaces
    });
    yamlItem.fullName = this._$$_getYamlItemName(apiItem, {
      includeSignature: true,
      includeNamespace: true
    });
    yamlItem.langs = ['typeScript']; // Add the namespace of the item if it is contained in one.
    // Do not add the namespace parent of a namespace as they are flattened in the documentation.

    if (apiItem.kind !== "Namespace"
    /* Namespace */
    && apiItem.parent && apiItem.parent.kind === "Namespace"
    /* Namespace */
    && this.newDocfxNamespaces) {
      yamlItem.namespace = apiItem.parent.canonicalReference.toString();
    }

    switch (apiItem.kind) {
      case "Enum"
      /* Enum */
      :
        yamlItem.type = 'enum';
        break;

      case "EnumMember"
      /* EnumMember */
      :
        yamlItem.type = 'field';
        var enumMember = apiItem;

        if (enumMember.initializerExcerpt.text.length > 0) {
          yamlItem.numericValue = enumMember.initializerExcerpt.text;
        }

        break;

      case "Class"
      /* Class */
      :
        yamlItem.type = 'class';

        this._$$_populateYamlClassOrInterface(uid, yamlItem, apiItem);

        break;

      case "Interface"
      /* Interface */
      :
        yamlItem.type = 'interface';

        this._$$_populateYamlClassOrInterface(uid, yamlItem, apiItem);

        break;

      case "Method"
      /* Method */
      :
      case "MethodSignature"
      /* MethodSignature */
      :
        yamlItem.type = 'method';

        this._$$_populateYamlFunctionLike(uid, yamlItem, apiItem);

        break;

      case "Constructor"
      /* Constructor */
      :
        yamlItem.type = 'constructor';

        this._$$_populateYamlFunctionLike(uid, yamlItem, apiItem);

        break;

      case "Package"
      /* Package */
      :
        yamlItem.type = 'package';
        break;

      case "Namespace"
      /* Namespace */
      :
        yamlItem.type = 'namespace';
        break;

      case "Property"
      /* Property */
      :
      case "PropertySignature"
      /* PropertySignature */
      :
        var apiProperty = apiItem;

        if (apiProperty.isEventProperty) {
          yamlItem.type = 'event';
        } else {
          yamlItem.type = 'property';
        }

        this._$$_populateYamlProperty(uid, yamlItem, apiProperty);

        break;

      case "Function"
      /* Function */
      :
        yamlItem.type = 'function';

        this._$$_populateYamlFunctionLike(uid, yamlItem, apiItem);

        break;

      case "Variable"
      /* Variable */
      :
        yamlItem.type = 'variable';

        this._$$_populateYamlVariable(uid, yamlItem, apiItem);

        break;

      case "TypeAlias"
      /* TypeAlias */
      :
        yamlItem.type = 'typealias';

        this._$$_populateYamlTypeAlias(uid, yamlItem, apiItem);

        break;

      default:
        throw new Error('Unimplemented item kind: ' + apiItem.kind);
    }

    if (apiItem.kind !== "Package"
    /* Package */
    && !this._shouldEmbed(apiItem.kind)) {
      var associatedPackage = apiItem.getAssociatedPackage();

      if (!associatedPackage) {
        throw new Error('Unable to determine associated package for ' + apiItem.displayName);
      }

      yamlItem.package = this._getUid(associatedPackage);
    }

    return yamlItem;
  };

  _proto._$$_populateYamlTypeParameters = function _$$_populateYamlTypeParameters(contextUid, apiItem) {
    var typeParameters = [];

    for (var _iterator5 = apiItem.typeParameters, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray5) {
        if (_i5 >= _iterator5.length) break;
        _ref5 = _iterator5[_i5++];
      } else {
        _i5 = _iterator5.next();
        if (_i5.done) break;
        _ref5 = _i5.value;
      }

      var apiTypeParameter = _ref5;
      var typeParameter = {
        id: apiTypeParameter.name
      };

      if (apiTypeParameter.tsdocTypeParamBlock) {
        typeParameter.description = this._$$_renderMarkdown(apiTypeParameter.tsdocTypeParamBlock.content, apiItem);
      }

      if (!apiTypeParameter.constraintExcerpt.isEmpty) {
        typeParameter.type = [this._$$_renderType(contextUid, apiTypeParameter.constraintExcerpt)];
      }

      typeParameters.push(typeParameter);
    }

    return typeParameters;
  };

  _proto._$$_populateYamlClassOrInterface = function _$$_populateYamlClassOrInterface(uid, yamlItem, apiItem) {
    if (apiItem instanceof apiExtractorModel.ApiClass) {
      if (apiItem.extendsType) {
        yamlItem.extends = [this._$$_renderType(uid, apiItem.extendsType.excerpt)];
        yamlItem.inheritance = this._$$_renderInheritance(uid, [apiItem.extendsType]);
      }

      if (apiItem.implementsTypes.length > 0) {
        yamlItem.implements = [];

        for (var _iterator6 = apiItem.implementsTypes, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
          var _ref6;

          if (_isArray6) {
            if (_i6 >= _iterator6.length) break;
            _ref6 = _iterator6[_i6++];
          } else {
            _i6 = _iterator6.next();
            if (_i6.done) break;
            _ref6 = _i6.value;
          }

          var implementsType = _ref6;
          yamlItem.implements.push(this._$$_renderType(uid, implementsType.excerpt));
        }
      }
    } else if (apiItem instanceof apiExtractorModel.ApiInterface) {
      if (apiItem.extendsTypes.length > 0) {
        yamlItem.extends = [];

        for (var _iterator7 = apiItem.extendsTypes, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
          var _ref7;

          if (_isArray7) {
            if (_i7 >= _iterator7.length) break;
            _ref7 = _iterator7[_i7++];
          } else {
            _i7 = _iterator7.next();
            if (_i7.done) break;
            _ref7 = _i7.value;
          }

          var extendsType = _ref7;
          yamlItem.extends.push(this._$$_renderType(uid, extendsType.excerpt));
        }

        yamlItem.inheritance = this._$$_renderInheritance(uid, apiItem.extendsTypes);
      }

      var typeParameters = this._$$_populateYamlTypeParameters(uid, apiItem);

      if (typeParameters.length) {
        yamlItem.syntax = {
          typeParameters: typeParameters
        };
      }
    }

    if (apiItem.tsdocComment) {
      if (apiItem.tsdocComment.modifierTagSet.isSealed()) {
        var sealedMessage;

        if (apiItem.kind === "Class"
        /* Class */
        ) {
            sealedMessage = 'This class is marked as `@sealed`. Subclasses should not extend it.';
          } else {
          sealedMessage = 'This interface is marked as `@sealed`. Other interfaces should not extend it.';
        }

        if (!yamlItem.remarks) {
          yamlItem.remarks = sealedMessage;
        } else {
          yamlItem.remarks = sealedMessage + '\n\n' + yamlItem.remarks;
        }
      }
    }
  };

  _proto._$$_populateYamlFunctionLike = function _$$_populateYamlFunctionLike(uid, yamlItem, apiItem) {
    var syntax = {
      content: apiItem.getExcerptWithModifiers()
    };
    yamlItem.syntax = syntax;

    if (apiExtractorModel.ApiReturnTypeMixin.isBaseClassOf(apiItem)) {
      var returnType = this._$$_renderType(uid, apiItem.returnTypeExcerpt);

      var returnDescription = '';

      if (apiItem.tsdocComment && apiItem.tsdocComment.returnsBlock) {
        returnDescription = this._$$_renderMarkdown(apiItem.tsdocComment.returnsBlock.content, apiItem); // temporary workaround for people who mistakenly add a hyphen, e.g. "@returns - blah"

        returnDescription = returnDescription.replace(/^\s*-\s+/, '');
      }

      if (returnType || returnDescription) {
        syntax.return = {
          type: [returnType],
          description: returnDescription
        };
      }
    }

    var parameters = [];

    for (var _iterator8 = apiItem.parameters, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
      var _ref8;

      if (_isArray8) {
        if (_i8 >= _iterator8.length) break;
        _ref8 = _iterator8[_i8++];
      } else {
        _i8 = _iterator8.next();
        if (_i8.done) break;
        _ref8 = _i8.value;
      }

      var apiParameter = _ref8;
      var parameterDescription = '';

      if (apiParameter.tsdocParamBlock) {
        parameterDescription = this._$$_renderMarkdown(apiParameter.tsdocParamBlock.content, apiItem);
      }

      parameters.push({
        id: apiParameter.name,
        description: parameterDescription,
        type: [this._$$_renderType(uid, apiParameter.parameterTypeExcerpt)]
      });
    }

    if (parameters.length) {
      syntax.parameters = parameters;
    }

    if (apiExtractorModel.ApiTypeParameterListMixin.isBaseClassOf(apiItem)) {
      var typeParameters = this._$$_populateYamlTypeParameters(uid, apiItem);

      if (typeParameters.length) {
        syntax.typeParameters = typeParameters;
      }
    }
  };

  _proto._$$_populateYamlProperty = function _$$_populateYamlProperty(uid, yamlItem, apiItem) {
    var syntax = {
      content: apiItem.getExcerptWithModifiers()
    };
    yamlItem.syntax = syntax;

    if (apiItem.propertyTypeExcerpt.text) {
      syntax.return = {
        type: [this._$$_renderType(uid, apiItem.propertyTypeExcerpt)]
      };
    }
  };

  _proto._$$_populateYamlVariable = function _$$_populateYamlVariable(uid, yamlItem, apiItem) {
    var syntax = {
      content: apiItem.getExcerptWithModifiers()
    };
    yamlItem.syntax = syntax;

    if (apiItem.variableTypeExcerpt.text) {
      syntax.return = {
        type: [this._$$_renderType(uid, apiItem.variableTypeExcerpt)]
      };
    }
  };

  _proto._$$_populateYamlTypeAlias = function _$$_populateYamlTypeAlias(uid, yamlItem, apiItem) {
    var syntax = {
      content: apiItem.getExcerptWithModifiers()
    };
    yamlItem.syntax = syntax;

    var typeParameters = this._$$_populateYamlTypeParameters(uid, apiItem);

    if (typeParameters.length) {
      syntax.typeParameters = typeParameters;
    }

    if (apiItem.typeExcerpt.text) {
      syntax.return = {
        type: [this._$$_renderType(uid, apiItem.typeExcerpt)]
      };
    }
  };

  _proto._$$_renderMarkdown = function _$$_renderMarkdown(docSection, contextApiItem) {
    var _this = this;

    var stringBuilder = new tsdoc.StringBuilder();

    this._$$_markdownEmitter.emit(stringBuilder, docSection, {
      contextApiItem: contextApiItem,
      onGetFilenameForApiItem: function onGetFilenameForApiItem(apiItem) {
        // NOTE: GitHub's markdown renderer does not resolve relative hyperlinks correctly
        // unless they start with "./" or "../".
        // To ensure the xref is properly escaped, we first encode the entire xref
        // to handle escaping of reserved characters. Then we must replace '#' and '?'
        // characters so that they are not interpreted as a querystring or hash.
        // We must also backslash-escape unbalanced `(` and `)` characters as the
        // markdown spec insists that they are only valid when balanced. To reduce
        // the overhead we only support balanced parenthesis with a depth of 1.
        return encodeURI("xref:" + _this._getUid(apiItem)).replace(/[#?]/g, function (s) {
          return encodeURIComponent(s);
        }).replace(/(\([^(]*\))|[()]/g, function (s, balanced) {
          return balanced || '\\' + s;
        });
      }
    });

    return stringBuilder.toString().trim();
  };

  _proto._$$_writeYamlFile = function _$$_writeYamlFile(dataObject, filePath, yamlMimeType, schema) {
    nodeCoreLibrary.JsonFile.validateNoUndefinedMembers(dataObject);
    var stringified = yaml.safeDump(dataObject, {
      lineWidth: 120
    });

    if (yamlMimeType) {
      stringified = "### YamlMime:" + yamlMimeType + "\n" + stringified;
    }

    nodeCoreLibrary.FileSystem.writeFile(filePath, stringified, {
      convertLineEndings: "\r\n"
      /* CrLf */
      ,
      ensureFolderExists: true
    });

    if (schema) {
      schema.validateObject(dataObject, filePath);
    }
  }
  /**
   * Calculate the DocFX "uid" for the ApiItem
   * Example:  `node-core-library!JsonFile#load`
   */
  ;

  _proto._getUid = function _getUid(apiItem) {
    return this._getUidObject(apiItem).toString();
  };

  _proto._getUidObject = function _getUidObject(apiItem) {
    return apiItem.canonicalReference;
  }
  /**
   * Initialize the _apiItemsByCanonicalReference data structure.
   */
  ;

  _proto._$$_initApiItems = function _$$_initApiItems() {
    this._$$_initApiItemsRecursive(this._$$_apiModel);
  }
  /**
   * Helper for _initApiItems()
   */
  ;

  _proto._$$_initApiItemsRecursive = function _$$_initApiItemsRecursive(apiItem) {
    if (apiItem.canonicalReference && !apiItem.canonicalReference.isEmpty) {
      this._$$_apiItemsByCanonicalReference.set(apiItem.canonicalReference.toString(), apiItem);
    } // Recurse container members


    if (apiExtractorModel.ApiItemContainerMixin.isBaseClassOf(apiItem)) {
      for (var _iterator9 = apiItem.members, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
        var _ref9;

        if (_isArray9) {
          if (_i9 >= _iterator9.length) break;
          _ref9 = _iterator9[_i9++];
        } else {
          _i9 = _iterator9.next();
          if (_i9.done) break;
          _ref9 = _i9.value;
        }

        var apiMember = _ref9;

        this._$$_initApiItemsRecursive(apiMember);
      }
    }
  };

  _proto._$$_ensureYamlReferences = function _$$_ensureYamlReferences() {
    if (!this._$$_yamlReferences) {
      this._$$_yamlReferences = {
        references: [],
        typeNameToUid: new Map(),
        uidTypeReferenceCounters: new Map()
      };
    }

    return this._$$_yamlReferences;
  };

  _proto._$$_renderInheritance = function _$$_renderInheritance(contextUid, heritageTypes) {
    var result = [];

    for (var _iterator10 = heritageTypes, _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : _iterator10[Symbol.iterator]();;) {
      var _ref10;

      if (_isArray10) {
        if (_i10 >= _iterator10.length) break;
        _ref10 = _iterator10[_i10++];
      } else {
        _i10 = _iterator10.next();
        if (_i10.done) break;
        _ref10 = _i10.value;
      }

      var heritageType = _ref10;

      var type = this._$$_renderType(contextUid, heritageType.excerpt);

      var yamlInheritance = {
        type: type
      };

      var apiItem = this._$$_apiItemsByCanonicalReference.get(type);

      if (apiItem) {
        if (apiItem instanceof apiExtractorModel.ApiClass) {
          if (apiItem.extendsType) {
            yamlInheritance.inheritance = this._$$_renderInheritance(this._getUidObject(apiItem), [apiItem.extendsType]);
          }
        } else if (apiItem instanceof apiExtractorModel.ApiInterface) {
          if (apiItem.extendsTypes.length > 0) {
            yamlInheritance.inheritance = this._$$_renderInheritance(this._getUidObject(apiItem), apiItem.extendsTypes);
          }
        }
      }

      result.push(yamlInheritance);
    }

    return result;
  };

  _proto._$$_renderType = function _$$_renderType(contextUid, typeExcerpt) {
    var excerptTokens = typeExcerpt.tokens.slice(typeExcerpt.tokenRange.startIndex, typeExcerpt.tokenRange.endIndex);

    if (excerptTokens.length === 0) {
      return '';
    } // Remove the last token if it consists only of whitespace


    var lastToken = excerptTokens[excerptTokens.length - 1];

    if (lastToken.kind === "Content"
    /* Content */
    && !lastToken.text.trim()) {
      excerptTokens.pop();

      if (excerptTokens.length === 0) {
        return '';
      }
    }

    var typeName = typeExcerpt.text.trim(); // If there are no references to be used for a complex type, return the type name.

    if (!excerptTokens.some(function (tok) {
      return tok.kind === "Reference"
      /* Reference */
      && !!tok.canonicalReference;
    })) {
      return typeName;
    }

    var yamlReferences = this._$$_ensureYamlReferences();

    var existingUid = yamlReferences.typeNameToUid.get(typeName); // If this type has already been referenced for the current file, return its uid.

    if (existingUid) {
      return existingUid;
    } // If the excerpt consists of a single reference token, record the reference.


    if (excerptTokens.length === 1 && excerptTokens[0].kind === "Reference"
    /* Reference */
    && excerptTokens[0].canonicalReference) {
      var excerptRef = excerptTokens[0].canonicalReference.toString();

      var apiItem = this._$$_apiItemsByCanonicalReference.get(excerptRef);

      return this._$$_recordYamlReference(yamlReferences, excerptTokens[0].canonicalReference.toString(), apiItem ? this._$$_getYamlItemName(apiItem) : typeName, apiItem ? this._$$_getYamlItemName(apiItem, {
        includeNamespace: true
      }) : typeName);
    } // Otherwise, the type is complex and consists of one or more reference tokens. Record a reference
    // and return its uid.


    var baseUid = contextUid.withMeaning(undefined).withOverloadIndex(undefined).toString(); // Keep track of the count for the base uid (without meaning or overload index) to ensure
    // that each complex type reference is unique.

    var counter = yamlReferences.uidTypeReferenceCounters.get(baseUid) || 0;
    yamlReferences.uidTypeReferenceCounters.set(baseUid, counter + 1);
    var uid = contextUid.addNavigationStep(Navigation.Locals, "" + counter) //@ts-ignore
    .withMeaning("complex"
    /* ComplexType */
    ).withOverloadIndex(undefined).toString();
    return this._$$_recordYamlReference(yamlReferences, uid, typeName, typeName, excerptTokens);
  };

  _proto._$$_recordYamlReference = function _$$_recordYamlReference(yamlReferences, uid, name, fullName, excerptTokens) {
    if (yamlReferences.references.some(function (ref) {
      return ref.uid === uid;
    })) {
      return uid;
    } // Fill in the reference spec from the excerpt.


    var specs = [];

    if (excerptTokens) {
      for (var _iterator11 = excerptTokens, _isArray11 = Array.isArray(_iterator11), _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : _iterator11[Symbol.iterator]();;) {
        var _ref11;

        if (_isArray11) {
          if (_i11 >= _iterator11.length) break;
          _ref11 = _iterator11[_i11++];
        } else {
          _i11 = _iterator11.next();
          if (_i11.done) break;
          _ref11 = _i11.value;
        }

        var token = _ref11;

        if (token.kind === "Reference"
        /* Reference */
        ) {
            var spec = {};
            var specUid = token.canonicalReference && token.canonicalReference.toString();
            var apiItem = specUid ? this._$$_apiItemsByCanonicalReference.get(specUid) : undefined;

            if (specUid) {
              spec.uid = specUid;
            }

            spec.name = token.text;
            spec.fullName = apiItem ? apiItem.getScopedNameWithinPackage() : token.canonicalReference ? token.canonicalReference.withSource(undefined).withMeaning(undefined).withOverloadIndex(undefined).toString() : token.text;
            specs.push(spec);
          } else {
          specs.push({
            name: token.text,
            fullName: token.text
          });
        }
      }
    }

    var yamlReference = {
      uid: uid
    };

    if (specs.length > 0) {
      yamlReference.name = specs.map(function (s) {
        return s.name;
      }).join('').trim();
      yamlReference.fullName = specs.map(function (s) {
        return s.fullName || s.name;
      }).join('').trim();
      yamlReference['spec.typeScript'] = specs;
    } else {
      if (name !== uid) {
        yamlReference.name = name;
      }

      if (fullName !== uid && fullName !== name) {
        yamlReference.fullName = fullName;
      }
    }

    yamlReferences.references.push(yamlReference);
    return uid;
  };

  _proto._$$_getYamlItemName = function _$$_getYamlItemName(apiItem, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        includeSignature = _options.includeSignature,
        includeNamespace = _options.includeNamespace;
    var baseName = includeSignature ? Utilities.getConciseSignature(apiItem) : apiItem.displayName;

    if ((includeNamespace || apiItem.kind === "Namespace"
    /* Namespace */
    ) && apiItem.parent && apiItem.parent.kind === "Namespace"
    /* Namespace */
    ) {
        // If the immediate parent is a namespace, then add the namespaces to the name.  For example:
        //
        //   // Name: "N1"
        //   export namespace N1 {
        //     // Name: "N1.N2"
        //     export namespace N2 {
        //       // Name: "N1.N2.f(x,y)"
        //       export function f(x: string, y: string): string {
        //         return x + y;
        //       }
        //
        //
        //       // Name: "N1.N2.C"
        //       export class C {
        //         // Name: "member(x,y)"  <===========
        //         public member(x: string, y: string): string {
        //           return x + y;
        //         }
        //       }
        //     }
        //   }
        //
        // In the above example, "member(x, y)" does not appear as "N1.N2.C.member(x,y)" because YamlDocumenter
        // embeds this entry in the web page for "N1.N2.C", so the container is obvious.  Whereas "N1.N2.f(x,y)"
        // needs to be qualified because the DocFX template doesn't make pages for namespaces.  Instead, they get
        // flattened into the package's page.
        var nameParts = [baseName];

        for (var current = apiItem.parent; current; current = current.parent) {
          if (current.kind !== "Namespace"
          /* Namespace */
          ) {
              break;
            }

          nameParts.unshift(current.displayName);
        }

        return nameParts.join('.');
      } else {
      return baseName;
    }
  };

  _proto._$$_getYamlFilePath = function _$$_getYamlFilePath(apiItem) {
    var result = '';

    for (var _iterator12 = apiItem.getHierarchy(), _isArray12 = Array.isArray(_iterator12), _i12 = 0, _iterator12 = _isArray12 ? _iterator12 : _iterator12[Symbol.iterator]();;) {
      var _ref12;

      if (_isArray12) {
        if (_i12 >= _iterator12.length) break;
        _ref12 = _iterator12[_i12++];
      } else {
        _i12 = _iterator12.next();
        if (_i12.done) break;
        _ref12 = _i12.value;
      }

      var current = _ref12;

      switch (current.kind) {
        case "Model"
        /* Model */
        :
        case "EntryPoint"
        /* EntryPoint */
        :
          break;

        case "Package"
        /* Package */
        :
          result += Utilities.getSafeFilenameForName(nodeCoreLibrary.PackageName.getUnscopedName(current.displayName));
          break;

        default:
          if (current.parent && current.parent.kind === "EntryPoint"
          /* EntryPoint */
          ) {
              result += '/';
            } else {
            result += '.';
          }

          result += Utilities.getSafeFilenameForName(current.displayName);
          break;
      }
    }

    var disambiguator = '';

    if (apiItem.getMergedSiblings().length > 1) {
      disambiguator = "-" + apiItem.kind.toLowerCase();
    }

    return path.join(this._$$_outputFolder, result + disambiguator + '.yml');
  };

  _proto._$$_deleteOldOutputFiles = function _$$_deleteOldOutputFiles() {
    console.log('Deleting old output from ' + this._$$_outputFolder);
    nodeCoreLibrary.FileSystem.ensureEmptyFolder(this._$$_outputFolder);
  };

  return YamlDocumenter;
}();

var YamlAction =
/*#__PURE__*/
function (_BaseAction) {
  _inheritsLoose(YamlAction, _BaseAction);

  function YamlAction() {
    return _BaseAction.apply(this, arguments) || this;
  }

  var _proto = YamlAction.prototype;

  _proto.onDefineParameters = function onDefineParameters() {
    // override
    _BaseAction.prototype.onDefineParameters.call(this);
  };

  _proto.onExecute = function onExecute() {
    console.error(this.inputFolder, this.outputFolder);
    var apiModel = this.buildApiModel();
    var markdownDocumenter = new YamlDocumenter(apiModel, undefined);
    markdownDocumenter.generateFiles(this.outputFolder);
    return Promise.resolve();
  };

  return YamlAction;
}(BaseAction);

function init() {
  var apiMain = createMainApiTask();
  var apiTree = createApiTask$1();
  var apiFix = ApiExtractorFix$1.createApiTask();
  var docFix = ApiExtractorFix$1.createApiFixedTask({
    items: [{
      name: projectName
    }]
  });
  gulpAwesome.task('api:main', apiMain);
  gulpAwesome.task('api:all', apiTree);
  gulpAwesome.task('api:fix', apiFix);
  gulpAwesome.task('doc:fix', docFix);
  var build = gulpAwesome.task('build', function () {
    gulp.src('.', {
      read: false
    }).pipe(gulpAwesome.logger('Exec')("api-documenter markdown -i " + resolveTmpDir("./etc") + " -o " + resolveTmpDir("./document/articles"))).pipe(gulpAwesome.logger('Exec')("api-documenter yaml -i " + resolveTmpDir("./etc") + " -o " + resolveTmpDir("./document/src"))).pipe(gulpAwesome.logger('Exec')("docfx build " + resolveTmpDir('./document/docfx.json'))).pipe(gulpAwesome.shell("docfx build " + resolveTmpDir('./document/docfx.json'))).pipe(gulpAwesome.logger('Run server with:')(colors__default.cyan(colors__default.underline("docfx serve ./docs"))));
  });
  var tmpTemplate = gulpAwesome.task('doc:templateTmp', function () {
    return gulp.src(resolve('./config/document/**')).pipe(replace('"../docs"', "\"" + resolve('./docs', true) + "\"")).pipe(gulp.dest(resolveTmpDir('./document')));
  });
  var cleanDocTmp = gulpAwesome.task('clean:doctmp', gulpAwesome.shellTask("rimraf " + resolveTmpDir('./document/**')));
  var outputTemplate = gulpAwesome.task('doc:template', function () {
    return gulp.src(resolve('./config/document/**')).pipe(gulp.dest('./document'));
  });
  gulp.task('default', gulp.series( // apiMain,
  apiTree, // (async (done) => {
  //   const tasks = [];
  //   const results = await Promise.all(depends.map(resolveModuleDTS));
  //   for (const [moduleName, dtsPath] of results) {
  //     tasks.push(createDependApiTask(moduleName, dtsPath));
  //   }
  //   console.error(tasks);
  //   return gulp.parallel(tasks)(done);
  // }),
  apiFix, cleanDocTmp, tmpTemplate, gulp.parallel(gulpAwesome.task('markdown:articles', function () {
    try {
      var action = new MarkdownAction(resolveTmpDir("./etc"), resolveTmpDir("./document/articles"));
      return Promise.resolve(action.onExecute(resolve('.', true)));
    } catch (e) {
      return Promise.reject(e);
    }
  }), gulpAwesome.task('ymlfile:src', function () {
    try {
      var action = new YamlAction(resolveTmpDir("./etc"), resolveTmpDir("./document/src"));
      return Promise.resolve(action.onExecute());
    } catch (e) {
      return Promise.reject(e);
    }
  })), docFix, build));
}

exports.MarkdownAction = MarkdownAction;
exports.MarkdownDocumenterAccessor = MarkdownDocumenterAccessor;
exports.MarkdownDocumenterFeature = MarkdownDocumenterFeature;
exports.MarkdownDocumenterFeatureContext = MarkdownDocumenterFeatureContext;
exports.PluginFeature = PluginFeature;
exports.PluginFeatureContext = PluginFeatureContext;
exports.PluginFeatureInitialization = PluginFeatureInitialization;
exports.YamlAction = YamlAction;
exports.init = init;
//# sourceMappingURL=ts-api-docs.cjs.development.js.map
