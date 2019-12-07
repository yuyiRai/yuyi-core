local utils = {}
local function condition(epxect, ifTrue, ifFalse)
  if epxect then
    return ifTrue
  else
    return ifFalse
  end
end

--判断是否为nil，如果是则返回默认值，否则返回自身
local function defaultTo(value, defaultValue)
  return condition(value == nil, defaultValue, value)
end


--判断类型，符合返回，不符合返回默认值
local function defaultTypeTo(value, typeName, defaultValue)
  return condition(type(value) ~= typeName, defaultValue, value)
end

--[[取得默认的table]]
local function getDefaultTable(value)
  return defaultTypeTo(value, "table", {})
end
utils.getDefaultTable = getDefaultTable

--转化为表
local function castTable(value)
  return condition(type(value) ~= 'table', { value }, value)
end




local function mixins(...)
  local target = {}
  local source = { ... }
  local length = #source
  source.__index = source
  setmetatable(target, source)
  return target
end

local function getUnicode(utfChar)
  local r = {}
  for i=1, #utfChar do
    local byte = string.byte(utfChar, i)
    -- print(string.format("%#x", byte))
    table.insert(r, "\\"..byte)
  end
  return table.concat(r, '')
end


utils.condition = condition
utils.defaultTo = defaultTo
utils.defaultTypeTo = defaultTypeTo
utils.mixins = mixins

utils.castTable = castTable


utils.getUnicode = getUnicode


function utils.log(...)
  local p = { ... }
  print(YuyiCore.toString(p))
end
return utils
