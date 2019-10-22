import './wasm'

declare global {
  interface WasmImporter {
    (module: any): WebAssembly.Instance | WebAssembly.WebAssemblyInstantiatedSource;
    ___module: {};
  }
}