import fs from 'fs-extra';
import { last, set, get, escapeRegExp, merge } from 'lodash';
import * as gulp from 'gulp'
import replace from 'gulp-replace'
import jeditor from 'gulp-json-editor';
import JSON5 from 'json5';

import convert from 'gulp-convert';
import { resolveTmpDir, projectName, paths } from './resolve';

JSON.parse = JSON5.parse;
export namespace ApiExtractorFix {
  const suffix = '.api.json';
  function taskFactroy(name: string) {
    const src = resolveTmpDir(`./etc/${name === projectName ? 'index' : name}${suffix}`);
    return function () {
      return gulp.src(src, { allowEmpty: true })
        .pipe(replace('@yuyi919/ts-api-docs', name))
        .pipe(jeditor(function (json) {
          console.error(`modify ${src} name to ${name}`);
          set(json, 'name', name);
          return json;
        }))
        .pipe(gulp.dest(paths.tmpEtcDir));
    };
  }

  let files = [];
  function getFiles() {
    if (files.length === 0) {
      files = fs.readdirSync(paths.tmpEtcDir)
        .filter(name => new RegExp(`^(.*?)${escapeRegExp(suffix)}$`).test(name))
        .map(name => name.replace(suffix, ''));
    }
    return files
  }

  export function createApiTask() {
    return function (a) {
      const files = getFiles()
      const list = files.map(name => taskFactroy(name === 'index' ? projectName : name))
      console.log('createApiTask', list);
      return gulp.parallel(list)(a)
    };
  }
  function editYml(source: string | string[], target: string, dothing: (json: any) => any) {
    return gulp.src(source)
      .pipe(convert({
        // @ts-ignore
        from: 'yml',
        to: 'json'
      })).pipe(jeditor(dothing))
      .pipe(convert({
        // @ts-ignore
        from: 'json',
        to: 'yml'
      }))
      .pipe(gulp.dest(target))
  }


  function mapTree(name: string, list: string[]) {
    const fileName = name + ".md"
    const md = fs.readFileSync('./document/articles/' + fileName).toString()


    // 通过正则从源文件匹配准确大小写
    const lastName = last(name.split('.'))
    const NameMatcher = `\\\[(${lastName})\\\]\\\(\\\.\\\/${fileName}\\\)`
    const moduleName = get(md.match(new RegExp(NameMatcher, 'i')), '[1]', lastName)

    // console.log();
    // 只匹配下一级
    const testStr = `^${name}\\\.([a-z0-9])+\.md$`
    const next = list.filter(filename => new RegExp(testStr, 'ig').test(filename))
    return ({
      name: moduleName,
      homepage: fileName,
      items: next.map(name => mapTree(name.replace(/\.md$/, ''), list))
    })
  }

  export function createApiFixedTask(jsonTmp = {}) {
    let markdownList = []
    return gulp.parallel(
      gulp.series(
        function templateInit() {
          markdownList = fs.readdirSync('./document/articles/')
          return gulp.src('./config/template/apiDoc/**/*').pipe(gulp.dest('./document'))
        },
        function apiTocFixed() {
          const files = getFiles()
          return editYml('./document/articles/toc.yml', './document/articles', function (json) {
            console.log(json);
            const children = files.map(name => mapTree(name, markdownList))
            return merge(json, {
              items: [
                get(json, 'items[0]')
              ].concat({
                items: children,
                homepage: children[0].homepage
              })
            });
          })
        }
      ),
      function srcTocFixed() {
        return editYml('./document/src/toc.yml', './document/src', function (json) {
          console.log(json, get(json, 'items[0].name'));
          jsonTmp = merge(json, jsonTmp)
          return jsonTmp;
        })
      }
    )
  }
}

export default ApiExtractorFix