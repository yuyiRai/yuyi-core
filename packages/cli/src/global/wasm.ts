declare module "*.wasm" {
  const install: WasmImporter
  export default install;
}