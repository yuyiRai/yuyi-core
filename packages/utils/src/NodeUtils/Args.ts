import argparse, { SubparserOptions, ArgumentParser, ArgumentOptions, ActionConstructorOptions, Action, Namespace, ArgumentParserOptions } from 'argparse';
import { KeyOf } from '../TsUtils';
import isEqual from 'lodash/isEqual';
// const argparse = require('argparse')

export declare interface ArgumentOptionsFixed extends ArgumentOptions {
  action?: 'store' // 只存储参数的值。这是默认操作。
  | 'storeConst' // 存储由const关键字参数指定的值。（请注意，const关键字参数默认为相当无用的None。）'storeConst'操作最常用于可选参数，它指定某种标志。
  | 'storeTrue' // 存储值True。这些是'storeConst'的特例。
  | 'storeFalse' // 存储值False。这些是'storeConst'的特例。
  | 'append' // 存储列表，并将const关键字参数指定的值附加到列表中。（注意，const关键字参数默认为None。）当多个参数需要将常量存储到同一列表时，通常使用'appendConst'操作。
  | 'appendConst' // 计算关键字参数出现的次数。例如，用于增加详细程度。
  | 'help' // 为当前解析器中的所有选项打印完整的帮助消息，然后退出。默认情况下，帮助操作会自动添加到解析器中。有关如何创建输出的详细信息，请参阅ArgumentParser。
  | 'version'// 打印版本信息并退出。version= 期望在addArgument（）调用中使用关键字参数。
  | (new (options: ActionConstructorOptions) => Action)
}
export declare interface ArgumentParserFixed<T> extends Partial<ArgumentParser> {
  addArgument(args: string | string[], options?: ArgumentOptionsFixed): this;
}

const replacer = {
  'v': 'V',
  'version': 'Version'
}
export class Args<T = any> {
  // parser: ArgumentParserFixed
  private config: ArgumentParserOptions;
  private options: [string | string[], ArgumentOptionsFixed][] = ([]) as any[]
  private namesMap: any = {}
  constructor(config: ArgumentParserOptions = {}) {
    this.config = {
      version: '0.0.1',
      addHelp: true,
      description: 'Argparse',
      ...config
    }
  }
  /** @deprecated */
  public addOption(name: "version", option: ArgumentOptionsFixed): this;
  public addOption<K extends KeyOf<T>>(name: K, option: ArgumentOptionsFixed): this;
  public addOption<K extends KeyOf<T>>(name: K, option: ArgumentOptionsFixed) {
    var n = (replacer[name[0]] || name[0]) as string
    if (!!this.namesMap[n]) {
      n = n.toUpperCase()  + (replacer[name[1]] || name[1])
    }
    this.namesMap[n] = (replacer[name as any] || name)
    return this.addArgument(["-" + n, "--" + this.namesMap[n]], option);
  }
  public addArgument(name: string | string[], option: ArgumentOptionsFixed) {
    // this.parser.addArgument(a, b)
    if (this.options.some(i => isEqual(i, [name, option]))) {
      return this
    }
    this.options.push([name, option])
    return this;
  }
  _parser: ArgumentParserFixed<T>;
  get parser(): ArgumentParserFixed<T> {
    const parser = this._parser || new argparse.ArgumentParser(this.config) as ArgumentParserFixed<T>;
    this.options.forEach((option) => {
      parser.addArgument(option[0], option[1]);
    });
    return (this._parser = parser)
  }
  public init(args?: string[], ns?: object | Namespace, allowUnknown?: false): [T, any[]];
  public init(args?: string[], ns?: object | Namespace, allowUnknown?: true): T;
  public init(args?: string[], ns?: object | Namespace, allowUnknown = true) {
    const parser = this.parser
    return allowUnknown ? parser.parseKnownArgs(args, ns) : parser.parseArgs(args, ns)
  }

  public registerSubArgs<T>(args: Args<T>, { name, ...option }: { name: string; } & SubparserOptions) {
    const sub = args.parser.addSubparsers(option);
    const parser = sub.addParser(name, this.config);
    this.options.forEach((option) => {
      parser.addArgument(option[0], option[1]);
    });
    return args;
  }
  public registerSub<T>(parse: ArgumentParserFixed<T>, { name, ...option }: { name: string } & SubparserOptions) {
    const sub = parse.addSubparsers(option);
    const parser = sub.addParser(name, this.config)
    this.options.forEach((option) => {
      parser.addArgument(option[0], option[1]);
    })
    return parse
  }
};

export default Args
