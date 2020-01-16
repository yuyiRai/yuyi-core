import path from 'path';
import { flattenDepth } from 'lodash'
import * as gulp from 'gulp'
import { TaskFunction } from  'undertaker'
import throuth from 'through2';
import stream from 'stream';
import ShellJS from 'gulp-shell';

export interface TaskHandler<K extends string = string> extends TaskFunction {
  taskName: K;
}
export function task<K extends string>(name: K, handler: TaskFunction | string): TaskHandler<K> {
  const func: TaskHandler<K> = Object.assign(handler instanceof Function ? handler : shellTask(handler), {
    taskName: name
  });
  gulp.task(name, func);
  return func;
}
export function series(...tasks: (string | TaskHandler | TaskFunction | (string | TaskHandler | TaskFunction)[])[]): TaskFunction {
  const seriec = flattenDepth(tasks, 2).map(f => {
    // @ts-ignore
    return f.taskName || f;
  });
  // console.log(seriec)
  return gulp.series(seriec);
};

export function parallel(...tasks: (string | TaskHandler | TaskFunction | (string | TaskHandler | TaskFunction)[])[]): TaskFunction {
  const seriec = flattenDepth(tasks, 2).map(f => {
    // @ts-ignore
    return f.taskName || f;
  });
  // console.log(seriec)
  return gulp.parallel(seriec);
};

export type FileTemplateRaw<R = string> = (file: FileParam) => R;
export type FileTemplateRaws<R = string> = (FileTemplateRaw<R> | R)[];
export type FileRawsOptions = TemplateStringsArray | string | FileTemplateRaw;
export function getThrouth(callback: (this: stream.Transform, chunk: Buffer & FileParam, enc: string, callback: throuth.TransformCallback) => void) {
  return throuth.obj((file: any, encode, done) => {
    const paths: string[] = file.history.map((p: string) => path.relative(process.cwd(), p));
    file.sourcePath = paths[0];
    file.path = paths[paths.length - 1];
    file.sourceFileName = path.basename(file.sourcePath);
    file.fileName = path.basename(file.path);
    callback.call(this, file, encode, done);
  });
}


export function rawToString<P>(params: [P, ...any[]], msg: TemplateStringsArray, ...raws: FileTemplateRaws) {
  return msg.length === 1
    ? msg.join("")
    : msg.reduce((r, current, index) => {
      if (index > 0) {
        const raw = raws[index - 1];
        raw && (r = r + (raw instanceof Function ? raw.apply(null, params) : raw));
      }
      return r + current;
    }, '');
}

export type FileParam = {
  history: string[];
  sourceFileName: string;
  fileName: string;
  sourcePath: string;
  path: string;
};

export function convertTemplates(file: FileParam, msg: FileRawsOptions, ...raws: FileTemplateRaws) {
  if (typeof msg === 'string') {
    return msg
      .replace(/\$\{fileName\}/, file.fileName)
      .replace(/\$\{path\}/, file.path)
      .replace(/\$\{sourceFileName\}/, file.sourceFileName)
      .replace(/\$\{sourcePath\}/, file.sourcePath);
  } else if (msg instanceof Function) {
    return msg(file);
  } else {
    return rawToString([file], msg, ...raws);
  }
}

/**
 * 创建入参为模板字符串的插件
 * @param haneler 接受完成的参数，入参为file
 * @param paramTo 入参转换函数
 */
export function createTemplateStrHandler(haneler: (str: string) => any, paramTo?: FileTemplateRaw<FileParam>) {
  return function templated(msg: FileRawsOptions, ...raws: FileTemplateRaws) {
    return getThrouth(async function (file, encode, done) {
      const message: string = convertTemplates(paramTo ? paramTo(file) : file, msg, ...raws);
      // console.log(message)
      const result = await haneler(message);
      done(null, result === undefined ? file : result);
    });
  };
}

export interface Options {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  shell?: true | string;
  quiet?: boolean;
  verbose?: boolean;
  ignoreErrors?: boolean;
  errorMessage?: string;
  templateData?: object;
}
export const shell = createTemplateStrHandler(shellStr => ShellJS.task(shellStr)());
export const shellTask = function task(commands: string | string[], options ?: Options) {
  return ShellJS.task(commands, options)
}
