import color from 'colors';
import { options, logMap } from "./options";



/**
 * 
 * @param factroy 
 * @param union 信息是否只输出一次
 */
export function resolveMsgFactroy(factroy: () => [string, string, ...any[]], union = true) {
  if (options.logger) {
    const [main, second, ...msg2] = factroy();
    const r = [color.cyan(main), color.green(second), ...(msg2 || []).map(i => color.yellow(i))].join(' ');
    if (!union || !logMap[r]) {
      console.info(r);
      logMap[r] = r;
    }
  }
  return true;
}

export function resolveMsg(main: string, second: string, ...other: any[]) {
  const r = [color.cyan(main), color.green(second), ...(other || []).map(i => color.yellow(i))].join(' ');
  if (options.logger && !logMap[r]) {
    console.info(r);
    logMap[r] = r;
  }
  return true;
}
