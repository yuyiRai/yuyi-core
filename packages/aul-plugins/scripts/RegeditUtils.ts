import { exec } from 'child_process'
import path from 'path'

const shellPath = "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\CommandStore\\shell"


export namespace RegExpPath {

  export function generateCommndDelete(key: string) {
    return generateCommnd(key).map(path => `reg delete "${path}" /f`);
  }
  export function generateDelete(path: string | string[], key?: string ) {
    if (path instanceof Array) {
      return path.reduce((r, path) => r.concat(generateDelete(path, key)), [])
    }
    return [`reg delete "${path}"${key ? " /v "+key : ""} /f`];
  }

  export function generateCommnd(key: string) {
    const base = `${shellPath}\\${key}`;
    return [base, `${base}\\command`];
  }

  /**
   * 生成自定义右键菜单指令的注册表路径
   * @param key 指令的key
   * @param typeKeys 指令的位置
   */
  export function generateContextTarget(key: string, ...typeKeys: string[]) {
    return `HKEY_CLASSES_ROOT\\${typeKeys.join("\\")}\\shell\\${key}`;
  }

  /**
   * 生成自定义右键菜单指令的注册表路径
   * @param key 指令的key
   * @param typeKeys 指令的位置
   */
  export function generateContextTargetList(key: string, typeKeys: Source[]) {
    return typeKeys.map(type => `HKEY_CLASSES_ROOT\\${type}\\shell\\${key}`);
  }
  /**
   * 生成自定义右键菜单指令的注册表路径
   * @param key 指令的key
   * @param typeKeys 指令的位置
   */
  export function generateContextTargetAuto(key: string, source?: Source | Source[]) {
    const addSource: RegExpPath.Source[] = source && (source instanceof Array ? source : [source]) || RegExpPath.SOURCE_ALL
    return generateContextTargetList(key, addSource);
  }

  /**
   * 添加注册表
   * @param path 路径
   * @param target 对象, 除了value以外都是该路径下的子值
   * @param sync 是否保持value以外其他键值的同步（删除值为value的key）
   */
  export function generateAdd(path: string | string[], target: { value?: number | string, [key: string]: number | string; }, sync: boolean = true): string[] {
    if (path instanceof Array) {
      return path.reduce((r, p) => r.concat(generateAdd(p, target)), [])
    }
    const { value, ...values } = target
    const base = [];
    if (value != null) {
      base.push(`reg add "${path}" /d "${value}" /f`.replace("\\\\", "\\"));
    }
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        base.push(`reg add "${path}" /v "${key}" /d "${value}" /f`.replace("\\\\", "\\"))
      } else if (sync) {
        base.push(generateDelete(path, key))
      }
    }
    return base
  }
  export const SOURCE_ALL_FILE = "*";
  export const SOURCE_ALL_Directory = "Directory";
  export const SOURCE_ALL_Directory_BACKGROUND = "Directory\\Background"
  export type Source = typeof SOURCE_ALL_FILE | typeof SOURCE_ALL_Directory | typeof SOURCE_ALL_Directory_BACKGROUND;
  export const SOURCE_ALL: Source[] = [
    RegExpPath.SOURCE_ALL_FILE,
    RegExpPath.SOURCE_ALL_Directory,
    RegExpPath.SOURCE_ALL_Directory_BACKGROUND
  ]
}

export interface RegContext {
  "MUIVerb": string;
  "SubCommands": string;
  "Position": string;
}

export function execCommands(...command: string[]) {
  return new Promise<[number, NodeJS.Signals]>(r => {
    const commondStr = command.join(" && ")
    const p = exec(commondStr).addListener("close", (code: number, signal: NodeJS.Signals) => {
      console.log(commondStr, code, signal)
      r([code, signal])
    });
    p.stdout.addListener("data", v => {
      console.log(v)
    })
  })
}

/**
 * 向注册表添加菜单
 * @param key 标识符
 * @param options 配置项
 */
export function addContext(key: string, options: {
  source?: RegExpPath.Source | RegExpPath.Source[],
  title: string,
  commond: string[],
  Position: "bottom" | number
}) {
  const { source, title = key, commond = [], Position = "bottom" } = options
  const r = RegExpPath.generateAdd(RegExpPath.generateContextTargetAuto(key, source), {
    MUIVerb: title,
    SubCommands: commond.join(";"),
    Position
  });
  return execCommands(...r)
}
export function addSubItem(key: string, title: string, execCommand?: string, iconPath?: string) {
  const [base, command] = RegExpPath.generateCommnd(key)
  const r = RegExpPath.generateAdd(base, {
    value: title,
    Icon: iconPath
  }).concat(
    RegExpPath.generateAdd(command, {
      value: execCommand
    })
  );
  return execCommands(...r);
}
/**
 * 从注册表删除菜单
 * @param key 标识符
 * @param options 配置项
 */
export function deleteContext(key: string, source?: RegExpPath.Source | RegExpPath.Source[]) {
  const r = RegExpPath.generateDelete(RegExpPath.generateContextTargetAuto(key, source));
  return execCommands(...r);
}


export async function main() {
  await addContext("yuyi", {
    source: "*",
    title: "YuyiCore", 
    commond: ["logs", "addremark", "searchfile", "yuyi"],
    Position: 2
  });
  await addSubItem("logs", "转化为aul_scripts", process.execPath + " D:\\WorkSpace\\@yuyi\\packages\\pfv-extractor\\scripts\\index.js %1%", "node.exe");
  // await deleteContext("yuyi")
  console.log(require.resolve("path"))
}
main()
