import fs from 'fs-extra';
import { toPairs,map, chunk, reduce, template, TemplateOptions } from 'lodash';
import pathlib from 'path';
import { toBuffer, EncodingType, toStr } from './encoding';
import { PfvFilterGroup } from './PfvFilterGroup';
import { Options, initParams, Config } from './Options';
import { convertKuromojiTokenToString, Tokenizer } from './kuromoji';

// import { kakasi } from '@yuyi919/kakasi'
export type ReadResult = {
  characterName: string;
  rootName: string;
  params: PfvFilterGroup[];
}
export async function readPfv(path: string, options?: Options): Promise<ReadResult> {
  const pfv: string = fs.readFileSync(path, "utf8").toString();
  const groups: string[] = pfv.split(/\n\/\/(.*?)\~filter\n/ig);
  const [top, ...other] = groups
  const group: PfvFilterGroup[] = reduce(
    chunk(other, 2),
    (obj: PfvFilterGroup[], [key, current]: [string, string]) => {
      const group = new PfvFilterGroup(
        current.split(/\n\n/ig).map((text) => text.split('\n')),
        key,
        options
      )
      return obj.concat([group])
    },
    []
  );
  // console.log(pfv);
  return {
    rootName: top.match(/root\-name\/(.*)/ig)[0].split('/')[1],
    characterName: group[0].rootName,
    params: group
  }
}

export const parseToUnicodeStr = str => {
  return toBuffer(str, "SJIS");
}
export function convertToParamsLua(data: ReadResult, { encoding = "UNICODE" }: Options = {}) {
  console.log(data.rootName)
  // const generatedParams = data.params.map((item, index) => {
  //   const paramIndex = index + 1
  //   return `
  //   --${item.key}
  //   optionsDisplay[${paramIndex}] = {
  //     ${JSON.stringify(item.childrenList.map(i => i.replace(`//${item.key}/`, ''))).replace(/[\[\]]/g, "")}
  //   }
  //   params[${paramIndex}] = {
  //     ${JSON.stringify(
  //   item.childrenList.map(
  //     r => r
  //       .replace('//', 'S.\'..rootName..\'/')
  //       .replace(item.name + '/', `${item.name}~`)
  //       .replace(item.rootName + '/', `'..fileName..'/`)
  //   )
  // ).replace(/[\[\]]/g, "").replace(/"/g, "'").replace(/,/g, `,
  //     `)}
  //   }
  //   paramsDisplay[${paramIndex}] = "${item.name}"
  //   params[paramsDisplay[${paramIndex}]] = params[${paramIndex}]
  // `
  // }).join('\r\n');

  const generatedParams = data.params.map((item, index) => {
    const paramIndex = index + 1;
    const optionsNames = item.childrenList.map(i => i.replace(`//${item.key}/`, ''))
    return `
    --${item.key}: ${JSON.stringify(optionsNames)}
    optionsDisplay[${paramIndex}] = {
      ${JSON.stringify(optionsNames.map(parseToUnicodeStr)).replace(/[\[\]]/g, "").replace(/\\\\/g, "\\")}
    }
    --常用表互相链接
    paramsDisplay[${paramIndex}] = "${parseToUnicodeStr(item.name)}"
    params[${paramIndex}] = {
      name = paramsDisplay[${paramIndex}],
      display = optionsDisplay[${paramIndex}]
    }
    params[paramsDisplay[${paramIndex}]] = params[${paramIndex}]
    ${
      item.childrenList.map(
        (r, index) => `--${(r).replace('//', 'S.' + data.rootName + '/')
          .replace(item.name + '/', item.name + '~')}
    params[${paramIndex}][${index + 1}] = "${
          ((r).replace('//', 'S."..controlType.."/')
          .replace(item.name + '/' + optionsNames[index], parseToUnicodeStr(item.name + '~' + optionsNames[index]))
          .replace(item.rootName + '/', `"..fileName.."/`))
          }"`
      ).join(`
    `)
      }
  `;
  }).join('\r\n');
  const paramsLua = toStr(`
    --指rootName, pfv是[お気に入り], 还有一种是Layer
    local controlType = "${data.rootName}"
    local fileName = "${data.characterName}"
    local params = {
      controlType = controlType,
      name = fileName
    }
    --按索引存储各params的name
    local paramsDisplay = {}
    --按索引存储各params的options的name
    local optionsDisplay = {}
    ${generatedParams}
    params.keys = paramsDisplay
    params.display = optionsDisplay
    function params.get(key, value)
      local param = params[key]
      if value and value ~= nil then
        return param[value], param.display[value]
      end
      return param, param.name
    end
    return params
  `, encoding);
  return {
    characterName: data.characterName,
    paramStr: paramsLua,
    params: data.params
  }
}

export function useTemplate<P extends object>(name: string, options: TemplateOptions & { encode?: boolean | EncodingType } = { }) {
  const path = pathlib.parse(pathlib.join(__dirname, "../template", name));
  const importPath = pathlib.format({
    ...path,
    base: name + '.lua'
  })
  try {
    let obj = fs.readFileSync(importPath, "utf8").toString().replace(/----@/g, "@").replace(/----\$/g, "$");
    obj = options.encode && toStr(obj, "UTF8", options.encode !== true ? options.encode : "SJIS") || obj
    const tmp = template(obj, options);
    return function (params: P) {
      try {
        const generated = tmp(params)
        return generated
      } catch (error) {
        return error.message
      }
    };
  } catch (e) {
    throw new Error("找不到模板: " + importPath + path.ext)
  }
}

export function output(path: string, content: string, encode?: "SJIS" | "UNICODE") {
  console.log(path)
  const dir = pathlib.dirname(path)
  if (!fs.pathExistsSync(dir)) {
    fs.ensureDirSync(dir)
  }
  if (encode === 'SJIS') {
    return fs.writeFileSync(path, toStr(content, encode), { encoding: "ascii" });
  }
  if (encode === 'UNICODE') {
    return fs.writeFileSync(path, toStr(content, "SJIS"), { encoding: "binary" });
  }
  return fs.writeFileSync(path, content, { encoding: "utf8" });
}

function resolvePath(dir: string, ...path: string[]) {
  try {
    if (!pathlib.isAbsolute(dir)) {
      return pathlib.join(process.cwd(), dir, ...path.filter(p => p))
    }
    return pathlib.join(dir, ...path.filter(p => p))
  } catch (e) {
    console.log('resolve error', dir, path.join(","));
    return pathlib.join(dir, ...path.filter(p => p))
  }
}

async function getJp(str: string) {
  try {
    return convertKuromojiTokenToString((await Tokenizer).tokenize(str))
    // return (await kakasi(str, true)).split("").filter(i => /[\.a-z0-9A-Z_ ]+/.test(i)).join("")
  } catch (error) {
    console.log("罗马音转换失败：", error.message)
  }
  return str
}

export async function generateLua(userFolder: string, fileName: string, options: Options) {
  const path = pathlib.join(userFolder, fileName + '.pfv')
  const outDir = pathlib.join(options.outdir, options.pack ? (await getJp(fileName)) : '').replace(/[ ]/g, "_")
  const config = await readPfv(path, options)
  const { paramStr, params, characterName } = convertToParamsLua(config, options);
  const paramsFileName = "params_" + fileName;
  let paramsObjStr = chunk(params, 4).reduce((r, params, index) => {
    return r + useTemplate("paramater", { imports: { map } })({
      params: params,
      characterName,
      dialogs: params.map((p, i) => `默認[${p.name}],local default${i + 1}=1;`).join(""),
      paramDefaultOptions: params.map((p, i) => `default${i + 1}`).join(", "),
      paramOptions: params.map((param, i) => `--track${i}:${param.name},0,${param.length},0,1`).join('\r\n'),
      paramKeys: params.map(p => p.encodingName).join('", "'),
      paramsFileName: paramsFileName,
      paramsName: "お好きになり_" + (index + 1)
    }) + '\n';
  }, ``);
  paramsObjStr = paramsObjStr + "\n" + useTemplate("draw")({
    characterName,
    params,
    paramsFileName: paramsFileName,
    paramsName: "お好きになり"
  });
  const fileNameCode = parseToUnicodeStr(fileName)
  const initObjStr = useTemplate("init", {})({
    characterName,
    params,
    tag: new Date().getTime(),
    psdName: fileNameCode + '.psd',
    minPsdName: fileNameCode + '.min.psd',
    pfvName: fileNameCode + '.pfv',
    absoluteDir: parseToUnicodeStr(userFolder.replace(/([\\])/g, "/")),
    paramsFileName: paramsFileName
  });
  // try {
    output(resolvePath(outDir, `${paramsFileName}.lua`), paramStr, "SJIS");
    output(resolvePath(outDir, `@ch_${fileName}.anm`), paramsObjStr, "SJIS");
    output(resolvePath(outDir, `@ch_${fileName}.obj`), initObjStr, "SJIS");
    output(resolvePath(outDir, `lib.lua`), useTemplate("lib")({}), "SJIS")
    // console.log(paramsObjStr)
  // } catch (error) {
  //   console.log(error.message)
  // }
  return outDir
}

export async function cmdHandler(path: string, options?: Options) {
  options = options || initParams().parseKnownArgs([path])[0]
  path = resolvePath(path)
  if (fs.pathExistsSync(path)) {
    const { name, ext, dir, root } = pathlib.parse(path);
    if (ext !== '.pfv') {
      throw new Error("目标文件必须是.pfv");
    }
    const o = Object.assign({
      encoding: "SJIS",
    }, options, {
      outdir: options.outdir || dir
    });
    // console.log(o);
    const configPath = pathlib.join(__dirname.replace(/src|dist/, ""), o.config);
    const config: Config = fs.existsSync(configPath) && fs.readJSONSync(configPath) || {}
    const { [path]: history = [] } = config.history || (config.history = {})
    console.log('input: ' + path);
    toPairs(o).forEach(([k, v]) => {
      console.log(`${k}: ${v}`);
    })
    // console.log(name, dir, ext, root)
    const outDir = await generateLua(dir, name, o);
    console.log('outDir: ' + outDir);
    if (history.length === 0 || !history.includes(outDir)) {
      config.history[path] = [...history, outDir];
    }
    fs.writeJSONSync(configPath, config, { spaces: 2 })
    return outDir
  }
  throw new Error("文件路径(" + path + ")不存在！")
}
let parser = null
export function main(params?: string[]) {
  parser = parser || initParams();
  const [{ input, ...options }, unknown] = parser.parseKnownArgs(params);
  return cmdHandler(input, options)
}

export function help() {
  return (parser = parser || initParams()).formatHelp();
}
