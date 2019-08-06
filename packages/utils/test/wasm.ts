import { requireWebAssembly, loadWebAssembly } from '../src/WasmLoader'
// @ts-ignore
import wasm from "../wasm/program.wasm"
const log = console.log
test('WasmLoader is Function', async () => {
  expect(loadWebAssembly).toBeInstanceOf(Function)
  log(requireWebAssembly(wasm).exports.main())
  // 调用
  // @ts-ignore
  const { instance } = await loadWebAssembly(() => import("../wasm/async.wasm"));
  const main = instance.exports.main; // 取出c里面的方法
  log(main());
  return
})
