import { ShellUtils } from "./ShellUtils";


export class WindowEnv {
  public shell: ShellUtils = new ShellUtils()
  constructor(public prefix: string) {}

  set(key: string, value: any) {
    return this.shell.setEnv(this.prefix + '_' + key, value)
  }

  get(key: string, defaultValue?: any) {
    return this.shell.getEnv(this.prefix + '_' + key) || defaultValue
  }
}
