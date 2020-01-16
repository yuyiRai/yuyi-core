import { shell } from '@yuyi919/shell-exec-awesome';
// import path from 'path';

const shellPath = "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\CommandStore\\shell";


export namespace RegeditUtils {

  export function generateCommndDelete(key: string) {
    return generateCommndReg(key).map(path => `reg delete "${path}" /f`);
  }
  export function generateDelete(path: string | string[], key?: string): string[] {
    if (path instanceof Array) {
      return path.reduce((r, path) => r.concat(generateDelete(path, key)), []);
    }
    return [`reg delete "${path}"${key ? " /v " + key : ""} /f`];
  }

  export function generateCommndReg(key: string) {
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
  export function generateFileTargetList(typeKeys: Source[]) {
    return typeKeys.map(type => `HKEY_CLASSES_ROOT\\${type}`);
  }
  /**
   * 生成自定义右键菜单指令的注册表路径
   * @param key 指令的key
   * @param typeKeys 指令的位置
   */
  export function generateContextTargetAuto(key: string, source?: Source | Source[]) {
    const addSource: RegeditUtils.Source[] = source && (source instanceof Array ? source : [source]) || RegeditUtils.SOURCE_ALL;
    return generateContextTargetList(key, addSource);
  }
  /**
   * 生成自定义右键菜单指令的注册表路径
   * @param key 指令的key
   * @param typeKeys 指令的位置
   */
  export function generateFileTargetAuto(source?: Source | Source[]) {
    const addSource: RegeditUtils.Source[] = source && (source instanceof Array ? source : [source]) || RegeditUtils.SOURCE_ALL;
    return generateFileTargetList(addSource);
  }

  /**
   * 添加注册表
   * @param path 路径
   * @param target 对象, 除了value以外都是该路径下的子值
   * @param sync 是否保持value以外其他键值的同步（删除值为value的key）
   */
  export function generateAdd(path: string | string[], target: { value?: number | string, [key: string]: number | string; }, sync: boolean = true): string[] {
    if (path instanceof Array) {
      return path.reduce((r, p) => r.concat(generateAdd(p, target)), []);
    }
    const { value, ...values } = target;
    const base = [];
    if (value != null) {
      base.push(`reg add "${path}" /d "${value}" /f`.replace("\\\\", "\\"));
    }
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        base.push(`reg add "${path}" /v "${key}" /d "${value}" /f`.replace("\\\\", "\\"));
      } else if (sync) {
        base.push(generateDelete(path, key));
      }
    }
    return base;
  }
  export const SOURCE_ALL_FILE = "*";
  export const SOURCE_ALL_Directory = "Directory";
  export const SOURCE_ALL_Directory_BACKGROUND = "Directory\\Background";
  export type Source<T extends string = string> = typeof SOURCE_ALL_FILE | typeof SOURCE_ALL_Directory | typeof SOURCE_ALL_Directory_BACKGROUND | T;
  export const SOURCE_ALL: Source[] = [
    RegeditUtils.SOURCE_ALL_FILE,
    RegeditUtils.SOURCE_ALL_Directory,
    RegeditUtils.SOURCE_ALL_Directory_BACKGROUND
  ];
}

export interface RegContext {
  "MUIVerb": string;
  "SubCommands": string;
  "Position": string;
}

export function execCommands(...command: string[]) {
  return new Promise<string[]>(r => {
    const result = []
    for (const commondStr of command) {
      const p = shell.exec(commondStr);
      console.log(commondStr);
      console.log(p);
      result.push(p)
    }
    // const commondStr = command.join(" && ");
    r(result);
  });
}

export async function addFileAccess<T extends string>(
  source: RegeditUtils.Source<T> | RegeditUtils.Source<T>[],
  content: string,
  desc: string,
  defaultOpen: string
) {
  const r1 = RegeditUtils.generateAdd('HKEY_CLASSES_ROOT\\' + source, { value: content });
  const r2 = RegeditUtils.generateAdd('HKEY_CLASSES_ROOT\\' + content, { value: desc });
  const r3 = RegeditUtils.generateAdd('HKEY_CLASSES_ROOT\\' + content + '\\shell\\Open\\Command', {
    value: defaultOpen
  });
  return execCommands(...r1, ...r2, ...r3);
}
/**
 * 向注册表添加菜单
 * @param key 标识符
 * @param options 配置项
 */
export async function addContext<T extends string>(key: string, options: {
  source?: RegeditUtils.Source<T> | RegeditUtils.Source<T>[],
  title: string,
  commond: string[],
  Position: "bottom" | number;
}) {
  const { source, title = key, commond = [], Position = "bottom" } = options;
  //@ts-ignore
  const r = RegeditUtils.generateAdd(RegeditUtils.generateContextTargetAuto(key, source), {
    MUIVerb: title,
    SubCommands: commond.join(";"),
    Position
  });
  return execCommands(...r);
}
export function addSubItem(key: string, title: string, execCommand?: string, iconPath?: string) {
  const [base, command] = RegeditUtils.generateCommndReg(key);
  const r = RegeditUtils.generateAdd(base, {
    value: title,
    Icon: iconPath
  }).concat(
    RegeditUtils.generateAdd(command, {
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
export async function deleteFileAccess<T extends string>(source?: RegeditUtils.Source<T> | RegeditUtils.Source<T>[]) {
  const r = RegeditUtils.generateDelete(
    RegeditUtils.generateFileTargetAuto(source)
  );
  return execCommands(...r);
}
/**
 * 从注册表删除菜单
 * @param key 标识符
 * @param options 配置项
 */
export async function deleteContext<T extends string>(key: string, source?: RegeditUtils.Source<T> | RegeditUtils.Source<T>[]) {
  const r = RegeditUtils.generateDelete(RegeditUtils.generateContextTargetAuto(key, source));
  return execCommands(...r);
}


export function addContextMenu() {

}

export async function main() {
  const execPath = "D:\\WorkSpace\\@yuyi\\packages\\pfv-extractor\\pfvec.exe";
  const exec = execPath + ' %1%'
  await addFileAccess('.pfv', 'pfv-extractor', 'psdtool―お好きになり文件', exec)
  await addContext("yuyi", {
    source: "pfv-extractor",
    title: "pfv-extractor", 
    commond: ["PfvExcractor.extract", "PfvExcractor.extractDir"],
    Position: 2
  });
  await addSubItem("PfvExcractor.extract", "转化为Scripts", exec, execPath);
  await addSubItem("PfvExcractor.extractDir", "转化为Scripts(到文件夹)", exec + ' -p', execPath);

  // // @ts-ignore
  // await deleteContext("yuyi", [".pfv", "pfv-extractor"]);
  // // @ts-ignore
  // await deleteFileAccess([".pfv", "pfv-extractor"])
  console.log(require.resolve("path"));
}
main();
