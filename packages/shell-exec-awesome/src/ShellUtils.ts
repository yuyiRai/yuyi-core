import iconv from 'iconv-lite';
import child_process from 'child_process';
import { chcpCodeValues, ChcpCode, EncodingNames, codeoptions } from './encoding';
import { logger } from './logger';

export class ShellUtils {

  @logger('exec', true)
  exec(dll: string, encoding: EncodingNames = this.getEnvEncodingName()) {
    try {
      const r = child_process.execSync(dll, { encoding: 'binary' });
      return iconv.decode(Buffer.from(r, 'binary'), encoding).replace(/([\r\n]+)$/, '').replace(/^([\r\n]+)/, '');
    } catch (error) {
      return iconv.decode(Buffer.from(error.message, 'binary'), encoding)
    }
  }

  @logger('exec-get')
  getEnv(name: string) {
    return this.exec(`echo %${name}%`);
  }

  setEnv(name: string, value: string) {
    return this.exec(`SETX /m ${name} ${value}`);
  }

  deleteGlob(glob: string) {
    return this.exec(`rimraf ${glob}`);
  }

  getEnvCode() {
    return parseInt(this.exec(`CHCP`, 'utf8').split(':')[1].replace(/ /g, ''));
  }

  setEnvCode(name: EncodingNames) {
    return this.exec(`CHCP ${codeoptions[ChcpCode[name]]}`, 'utf8');
  }

  /**
   * 默认返回活动页编码名称，找不到时返回utf8
   */
  getEnvEncodingName(): EncodingNames | undefined {
    return (ChcpCode[chcpCodeValues[this.getEnvCode()]] || 'utf8') as EncodingNames
  }
}
