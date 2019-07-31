declare module "*.wasm" {
  const install: WasmImporter
  export default install;
}

declare interface WasmImporter {
  (module: any): WebAssembly.Instance | WebAssembly.WebAssemblyInstantiatedSource;
  ___module: {};
}