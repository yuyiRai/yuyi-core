import { test as T } from '../dist/WasmLoader'

test('WasmLoader test', async () => {
  const r = await T()
  console.error(r);
  return r
})
