import argparse, { ArgumentParser, ArgumentOptions, ActionConstructorOptions, Action, Namespace, ArgumentParserOptions } from 'argparse';
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
export declare interface ArgumentParserFixed extends Partial<ArgumentParser> {
  addArgument(args: string | string[], options?: ArgumentOptionsFixed): Args;
}

export class Args implements ArgumentParserFixed {
  parser: ArgumentParserFixed
  constructor(config: ArgumentParserOptions = {}) {
    this.parser = new argparse.ArgumentParser({
      version: '0.0.1',
      addHelp: true,
      description: 'Argparse example',
      ...config
    }) as ArgumentParserFixed
  }
  public addArgument: ArgumentParserFixed['addArgument'] = (a, b) => {
    this.parser.addArgument(a, b)
    return this;
  }
  public init(args?: string[], ns?: object | Namespace) {
    return this.parser.parseArgs(args, ns)
  }
};

export default Args
