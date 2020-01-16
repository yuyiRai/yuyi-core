import { EncodingType } from './encoding';
import { Args } from '@yuyi919/utils/dist/NodeUtils';

export type Config = {
  history: Record<string, string[]>
}

export type Options = {
  encoding?: EncodingType;
  name?: string;
  outdir?: string;
  pack?: boolean;
  config?: string;
  reverse?: boolean;
};

export function initParams() {
  const pkg = require("../package.json")
  return new Args({
    version: pkg.version,
    description: pkg.description
  })
    .addArgument("input", { help: '输入的pfv文件(路径)' })
    .addOption("encoding", {
      dest: "encoding",
      defaultValue: "SJIS",
      help: "输出转换编码类型"
    })
    .addOption("config", {
      dest: "config",
      defaultValue: "./pfvec.json",
      help: "配置文件存放位置,默认为\"./pfvec.json\""
    })
    .addOption("outdir", {
      dest: "outdir",
      help: "指定输出路径(为空时表示当前文件夹)"
    })
    .addOption("reverse", {
      action: "storeTrue",
      dest: "reverse",
      defaultValue: false,
      help: "倒叙解析Pfv-options"
    })
    .addOption("pack", {
      action: "storeTrue",
      dest: "pack",
      defaultValue: false,
      help: "输出为一个文件夹"
    })
    .parser;
}
