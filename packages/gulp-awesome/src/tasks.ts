import { task } from './GulpUtils';
export namespace Tasks {
  export enum CHCP_CODE {
    utf8,
    shiftjis
  }
  const codeoptions = [65001, 932];
  export function CHCP(code: CHCP_CODE | number = 0) {
    const encode = codeoptions[code] || code
    return task("配置CHCP" + encode + "[" + (CHCP_CODE[code] || '未知') + "]环境", "CHCP " + encode);
  }
}
