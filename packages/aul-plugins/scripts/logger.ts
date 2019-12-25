import moment from 'dayjs';
import colors from 'colors';
import { GulpUtils } from './GulpUtils';

function log(msg: string, type?: string) {
  console.log(`[${colors.gray(moment().format("HH:mm:ss"))}]${type && ` ${type} ` || ""}${log.format(msg)}`);
}
log.format = function (msg: string) {
  return msg.replace(/'(.*?)'/g, "'" + colors.cyan('$1') + "'");
};

export function logger(type: string) {
  return GulpUtils.createTemplateStrHandler((msg: string) => log(msg, type));
}
logger.log = logger("Logging");
logger.output = logger("Outputing");
logger.input = logger("Inputing");
logger.move = logger("Move");
logger.parseEncoding = logger("Parse Encoding");
