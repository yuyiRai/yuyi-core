local lib = require('lib')
local utils = {}

local function concatTableWithTable(target, source)
  if type(target) ~= 'table' then return {} end
  local tmp = nil
  for i=1, #source do
    tmp = source[i]
    if type(tmp) == 'table' then
      for j=1, #tmp do
        table.insert(target, tmp[j])
      end
    end
  end
  return target
end
local function concatTable(target, ...)
  return concatTableWithTable(target, {...})
end
utils.concatTable = concatTable
utils.concatTableWithTable = concatTableWithTable

--遍历表
local function forEachTable(table, callbackfn)
  assert(type(table) == 'table')
  assert(type(callbackfn) == 'function')
  for i=1, #table do
    callbackfn(table[i], i, table)
  end
end
utils.forEachTable = forEachTable

--[[]]
local function deepForEach(source, callbackFn, maxDeep, current)
  current = lib.defaultTypeTo(current, 'number', 0)
  local cont = type(maxDeep)~='number' or current < maxDeep
  if type(source) ~= 'table' or cont~=true then
    callbackFn(source)
  elseif cont then
    forEachTable(source,
      function (v)
        deepForEach(v, callbackFn, maxDeep, current + 1)
      end
    );
  end
end
utils.deepForEach = deepForEach

--[[数组扁平化]]
local function reduce(source, callbackFn, newTable)
  assert(type(callbackFn)=='function')
  forEachTable(
    source, 
    function (value)
      newTable = callbackFn(lib.defaultTo(newTable, {}), value)
    end
  )
  return newTable
end
utils.reduce = reduce

--[[
  数组扁平化
]]
local function deepReduce(source, callbackFn, newTable, maxDeep)
  assert(type(callbackFn)=='function')
  newTable = lib.getDefaultTable(newTable)
  deepForEach(
    source,
    function (value)
      newTable = callbackFn(newTable, value)
    end,
    maxDeep
  )
  return newTable
end
utils.deepReduce = deepReduce

--[[数组扁平化]]
local function flatReduceMap(source, callbackFn, newTable, maxDeep)
  return deepReduce(
    source,
    function (result, item)
      return lib.concatTable(result, callbackFn(item))
    end,
    newTable,
    maxDeep
  )
end
utils.flatReduceMap = flatReduceMap


--数组扁平化
local function flat(source, newTable)
  newTable = lib.getDefaultTable(newTable)
  deepForEach(
    source, 
    function (value)
      table.insert(newTable, value)
    end
  )
  return newTable
end
--[[数组扁平化]]
local function flatMap(source, callbackFn, newTable)
  assert(type(callbackFn)=='function')
  newTable = lib.getDefaultTable(newTable)
  deepForEach(
    source, 
    function (value)
      table.insert(newTable, callbackFn(value))
    end
  )
  return flat(newTable)
end

utils.flatMap = flatMap
utils.flat = flat


local function findMapTableWith(source, search)
  -- print('start', source, #search)
  assert(type(source) == 'table', "搜索源必须为表")
  local r = {}
  local t = nil
  local length = 0
  for i=1, #search do
    -- print('search', table.concat(search[i].keys(), ''), source[search[i]])
    t = source[search[i]]
    if t~=nil then
      table.insert(r, { search[i], t })
      length = length + 1
    end
  end
  local i = 0
  return function()
    i = i + 1
    if i <= length then
        --  返回迭代器的当前元素
        return r[i][1], r[i][2]
    end
  end, length
end

utils.findMapTableWith = findMapTableWith


local function mapToTable(table, callbackfn)
  assert(type(table) == 'table')
  assert(type(callbackfn) == 'function')
  local r = {}
  for i=1, #table do
    r[i] = callbackfn(table[i], i, table)
  end
  return r
end
utils.mapToTable = mapToTable

local function filterTable(table, callbackfn)
  assert(type(table) == 'table')
  assert(type(callbackfn) == 'function')
  local r = {}
  for i=1, #table do
    if callbackfn(table[i], i, table) then
      table.insert(r, table[i])
    end
  end
  return r
end
utils.filterTable = filterTable


local function tableIncludes(table, value)
  assert(type(table) == 'table')
  for i=1, #table do
    if value == table[i] then
      return true
    end
  end
  return false
end
utils.tableIncludes = tableIncludes


-- joinTable
local function joinTable(value, join)
  if type(value) == 'table' then
    local t = ''
    for i=1, #value do
      t = t..
        utils.toString(value[i], type, false)..
        lib.condition(i == #value, '', lib.defaultTo(join, ','))
    end
    return t
  end
end
utils.joinTable = joinTable


function utils.toString(value, typeChecker, formatter)
  local typed = nil
  if typeChecker~=nil then 
    typed = typeChecker(value)
  else 
    typed = type(value)
  end

  local t = ''
  if typed == 'table' then
    return formatter ~= false and "{ '"..joinTable(value, "','").."' }" or joinTable(value, "','")
  else
    t = tostring(value)
  end
  return t
end


return utils
