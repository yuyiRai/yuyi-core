// import { IKeyValueMap } from "./TsUtils";
// import { greet } from '@yuyi/core'
export type Loader<T> = () => Promise<T | { default: T }>

/**
 * [静态import]的*.wasm为wasm模块
 * 采用es6的import语法
 * @param install - import install from '../*.wasm'
 */
export function requireWebAssembly(
  install: WasmImporter
): WebAssembly.Instance {
  console.log(typeof install)
  const imports = (requireWebAssembly as any).imports
  imports.env = imports.env || {};
  // 开辟内存空间
  imports.env.memoryBase = imports.env.memoryBase || 0;
  if (!imports.env.memory) {
    imports.env.memory = new WebAssembly.Memory({ initial: 256 });
  }
  // 创建变量映射表
  imports.env.tableBase = imports.env.tableBase || 0;
  if (!imports.env.table) {
    // 在 MVP 版本中 element 只能是 "anyfunc"
    imports.env.table = new WebAssembly.Table({ initial: 0, element: 'anyfunc' });
  }
  return install(imports) as any
}
(requireWebAssembly as any).imports = {}

/**
 * [动态import]*.wasm模块
 * 采用es6的() => import语法
 * @param loader - () => import("../*.wasm")
 */
export async function loadWebAssembly(loader: Loader<any>): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
  const { default: install } = await loader();
  return requireWebAssembly(install) as any
}



// export async function webAssemblyTest(log: any) {
//   // log(requireWebAssembly(wasm).exports.main())
//   // // 调用
//   const { instance } = await loadWebAssembly(() => import("../../wasm/async.wasm"));
//   const main = instance.exports.main; // 取出c里面的方法
//   log(main());
//   // return import('@yuyi/core').then((wasm) => {
//   //   log('test5553', wasm.greet)
//   //   console.error(wasm.greet)
//   //   wasm.greet('testt')
//   // })
// }