import convertEncoding from 'gulp-convert-encoding'
import { logger, LoggerType } from './logger';
import stream from 'stream'

export namespace Pipes {
  export function encoding(to: string, from: string = 'utf-8') {
    return convertEncoding({ from, to })
  }

  export function logSource2Target<T extends LoggerType | string = LoggerType.output>(type: T | string = LoggerType.output) {
    const func = logger[type as any] instanceof Function ? logger[type as any] : logger(type as any)
    return func("'${sourcePath}' => '${path}'") as stream.Transform
  }
}

