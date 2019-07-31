const t = {
  list: new Array().concat([
    { a: 10 },
    { a: 5 },
    { a: 5 }
  ]),
  r: 0
}

const imports = {
  getList() {
    return t.list
  },
  getList2() {
    return [1, 2, 3, 4, 5]
  },
  result: () => t.r,
  when: () => (item, index, arr) => {
    console.error(item, index, arr)
    t.r += item.a
  },
  get: (i, key) => {
    return t.list[i][key]
  },
  getValue: (i) => {
    return t.list[i].a
  },
  start() {
    console.time('test')
  },
  logger: (i) => {
    console.log(i)
  },
  end() {
    console.timeEnd('test')
  }
}

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

module.exports = {
  Modules: imports
}