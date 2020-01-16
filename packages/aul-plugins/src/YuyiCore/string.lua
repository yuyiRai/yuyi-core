local lib = require("./lib")
local tableLib = require("./table")
local utils = {}
local keyN = '\n'

-- 获取字符串的长度（任何单个字符长度都为1）
local function stringToChars(inputstr)
  if not inputstr or type(inputstr) ~= "string" or #inputstr <= 0 then
      return {}
  end
  local arr = {}
  local i = 1
  while true do
      local curByte = string.byte(inputstr, i)
      local byteCount = 1
      if string.char(curByte) == "&" and string.match(inputstr, "&#%d%d%d%d%d;", i) ~= nil then
        byteCount = 8
      elseif curByte > 239 then
        byteCount = 4  -- 4字节字符
      elseif curByte > 223 then
        byteCount = 3  -- 汉字
      elseif curByte > 128 then
        byteCount = 2  -- 双字节字符
      else
        byteCount = 1  -- 单字节字符
      end
      table.insert(arr, string.sub(inputstr, i, i + byteCount - 1))
      i = i + byteCount
      if i > #inputstr then
          break
      end
  end
  return arr
end
utils.stringToChars = stringToChars

-- 获取字符串的长度（任何单个字符长度都为1）
local function getStringLength(inputstr)
  return #stringToChars(inputstr)
end
utils.getStringLength = getStringLength
utils.length = getStringLength

--
--
--
local function chunkString(str, size, linePrifix, dangerSuffix)
  local prefix = linePrifix or {}
  local suffix = dangerSuffix or {}
  -- tableLib.log(prefix, suffix)
  local r = {}
  local charts = stringToChars(str)
  local line = {}
  for i=1, #charts do
    -- 段首补全
    if #line == 0 and tableLib.tableIncludes(prefix, charts[i])~=true then
      table.insert(line, prefix[1])
    end
    local normal = charts[i] ~= keyN
    -- if normal == false then print('catch kn') end
    -- print(charts[i])
    if normal then
      table.insert(line, charts[i])
    end

    local matchSpecial = tableLib.tableIncludes(suffix, charts[i+1]) and (true or tableLib.tableIncludes(suffix, charts[i+2]))
    if matchSpecial == false and (size ~= 0 and (#line%size == 0 or normal ~= true)) then
      -- local append = tableLib.condition(i==#charts, '', '\n')
      -- print('line', table.concat(line, ''))
      table.insert(r, table.concat(line, ''))
      line = { }
    end

  end
  table.insert(r, table.concat(line, ''))
  -- print(#charts, #r)
  return r
end

utils.chunkString = chunkString


-- 分割字符串
function utils.splitStr(szFullStr, szSeparator, appendSeparator)
  local fullStr = szFullStr --or string.gsub(szFullStr, '\n', '__')
  -- print(fullStr)
  local nFindStartIndex = 1
  local nSplitIndex = 1
  local nSplitArray = {}
  local replacerSeparatorArray = {}
  while true do
     local nFindLastIndex = string.find(fullStr, szSeparator, nFindStartIndex)
     local matchedSeparator = string.match(fullStr, szSeparator, nFindStartIndex)
     if not nFindLastIndex then
      nSplitArray[nSplitIndex] = string.sub(fullStr, nFindStartIndex, #fullStr)
      replacerSeparatorArray[nSplitIndex] = ''
      break
     end
     local result = string.sub(fullStr, nFindStartIndex, nFindLastIndex - 1)
    --  if string.match(result, matchedSeparator) == nil then
    --  end
     nFindStartIndex = nFindLastIndex + lib.condition(type(matchedSeparator) == 'string', #matchedSeparator, 1)
     if appendSeparator and matchedSeparator ~= nil then
      print(tableLib.joinTable({
        -- result,
        -- string.find(result, '\\n'),
        -- string.match(result, matchedSeparator, 1),
        -- { result, matchedSeparator },
        matchedSeparator,
        -- nFindStartIndex,
        -- #result,
        getStringLength(result)
      }, '|'))
      result = result..matchedSeparator
     end
     nSplitArray[nSplitIndex] = string.gsub(result, '__', '\n')
     replacerSeparatorArray[nSplitIndex] = matchedSeparator
     nSplitIndex = nSplitIndex + 1
  end
  return nSplitArray, nSplitIndex, replacerSeparatorArray
end

return utils
