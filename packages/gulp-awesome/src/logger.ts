import moment from 'dayjs';
import colors from 'colors';
import * as GulpUtils from './GulpUtils';
import stream from 'stream'

function log(msg: string, type?: string) {
  console.error(`[${colors.gray(moment().format("HH:mm:ss"))}]${type && ` ${type} ` || ""}${log.format(msg)}`);
}
log.format = function (msg: string) {
  return msg.replace(/'(.*?)'/g, "'" + colors.cyan('$1') + "'");
};

/**
 * 执行过程中输出log
 * @param type 
 */
export function logger<T extends string>(type: T): Logger<T> {
  return GulpUtils.createTemplateStrHandler((msg: string) => log(msg, type)) as any;
}
export enum LoggerType {
  log = "Logging",
  output = "Outputing",
  input = "Inputing",
  move = "Move",
  parseEncoding = "Parse Encoding"
}
export type Logger<T extends string | LoggerType> = (
  msg: GulpUtils.FileRawsOptions, ...raws: GulpUtils.FileTemplateRaws<string>
) => stream.Transform;

logger.log = logger(LoggerType.log);
logger.output = logger(LoggerType.output);
logger.input = logger(LoggerType.input);
logger.move = logger(LoggerType.move);
logger.parseEncoding = logger(LoggerType.parseEncoding);
