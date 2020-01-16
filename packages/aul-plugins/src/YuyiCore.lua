-- Core
local utils = require('./YuyiCore/utils')

local YuyiCore = utils.module({
  _vars = {
    ["encode"] = 'Shift-jis',
  },
  _VERSION = '1.0'  -- 模块版本
}, utils)

local defaultTo = utils.defaultTo
local defaultTypeTo = utils.defaultTypeTo

function YuyiCore.set(key, value)
  YuyiCore._vars[key] = value
end
function YuyiCore.get(key, defaultValue)
  return defaultTo(YuyiCore._vars[key], defaultValue)
end

-- function YuyiCore.stringToChars(s, format)  
--     local tb = {}
--     --[[
--       UTF8的编码规则：  
--       1. 字符的第一个字节范围： 0x00—0x7F(0-127),或者 0xC2—0xF4(194-244); UTF8 是兼容 ascii 的，所以 0~127 就和 ascii 完全一致  
--       2. 0xC0, 0xC1,0xF5—0xFF(192, 193 和 245-255)不会出现在UTF8编码中   
--       3. 0x80—0xBF(128-191)只会出现在第二个及随后的编码中(针对多字节编码，如汉字)
--     ]]
--     for utfChar in string.gmatch(s, "[%z\1-\127\194-\244][\128-\191]*") do
--       local v = format == true and getUnicode(utfChar) or utfChar
--       -- print(v, utfChar)
--       table.insert(tb, v)
--     end 
--     return tb
-- end



-- function YuyiCore.encode(str, source, target) 
--   local convertStr = str
--   local getSource = iconv.new(source, "UTF-8")
--   if getSource then
--     convertStr = getSource:iconv(convertStr)
--   end
--   local toTarget = iconv.new("UTF-8", target)
--   if toTarget then
--     convertStr = toTarget:iconv(convertStr)
--   end
--   return convertStr
-- end
-- function YuyiCore.utf8ToGBK(str)
--   if true then
--     return str
--   end
--   local convertStr = str
--   local togbk = iconv.new(YuyiCore.encode, "GB2312")
--   if togbk then
--     convertStr = togbk:iconv(str)
--   end
--   return convertStr
-- end



-- function YuyiCore.gbkToUTF8(str)
--     if true then
--         return str
--     end
--     local convertStr = str
--     local toutf8 = iconv.new("GB2312", YuyiCore.encode)
--     if toutf8 then
--         convertStr = toutf8:iconv(str)
--     end
--     return convertStr
-- end


function YuyiCore.readFile(path) 
  local t = ''
  local f = io.open(path)
  if f ~= nil then
    for line in f:lines() do
      t = t..line..'{}'
    end
  end
  f:close()
  return string.gsub(t, '\n$', '')
end

function YuyiCore.writeFile(path, content, keepFile)
  local f = io.open(path, "w")
  f:write(content)
  if keepFile ~= true then
    f:close()
  end
  return f
end


function YuyiCore.getOption(value)
  value = utils.castTable(value)
  return value[1], value[2]
end


function YuyiCore.PrintTable(t, splitStr, handle)
  handle = defaultTo(handle, print)
  for i=1, #t do
    handle(t[i])
    if splitStr ~= nil then
      handle(splitStr)
    end
  end
end

function YuyiCore.getMixedPertten(main, append)
  -- local appendTable = {}
  local base = {}
  local tmp = function (main)
    local inner, option = YuyiCore.getOption(main)
    -- print(main)
    if type(inner) == 'string' and #inner > 0 then
      local appendPerttern = '([^%z'..append..']+)'
      -- table.insert(appendTable, main..append)
      table.insert(base, { inner..append, option })
      table.insert(base, { "("..inner..")"..appendPerttern, option })
    end
  end
  utils.forEachTable(
    YuyiCore.flatReduceMap(
      main,
      function (value)
        return type(value) =='string' and YuyiCore.stringToChars(value) or { value }
      end,
      {},
      1
    ),
    tmp
  )
  -- utils.forEachTable(
  --   appendTable,
  --   function (main)
  --     return table.insert(base, main)
  --   end
  -- )
  return base
end


function YuyiCore.easein(p) 
  return p*p 
end
function YuyiCore.easeout(p) 
  return p*(2-p) 
end

function YuyiCore.splitStrMul(szFullString, szSeparators, startIndex, margeMap)
  -- YuyiCore.log(szSeparators)
  margeMap = defaultTo(margeMap, {})
  startIndex = defaultTo(startIndex, 1)
  if startIndex <= #szSeparators then
    local nSplitArray = {}
    local szSeparator, options = YuyiCore.getOption(szSeparators[startIndex])
    -- if options ~= nil then
    --   print('options', szSeparator, options)
    -- end
    if margeMap[szSeparator] ~= true then
      local arr, size, separators = YuyiCore.splitStr(szFullString, szSeparator, defaultTypeTo(options, 'boolean', true))
      utils.forEachTable(arr,
        function (str, index)
          -- if index < #arr then str = str..separators[index] end
          local innerArr = YuyiCore.splitStrMul(str, szSeparators, startIndex + 1, margeMap)
          for k=1, #innerArr do
            local innerStr = defaultTypeTo(innerArr[k], "string", "")
            if #innerStr > 1 then
              table.insert(nSplitArray, innerStr)
            end
          end
        end
      )
      -- for j=1, #arr do
      --   local inj = arr[j]
      -- end
      return nSplitArray, #nSplitArray, margeMap
    end
  end
  return { szFullString }, 1, margeMap
end


-- 返回某个字符重复n�?
function YuyiCore.repeatStr(str, n)
  local resTxt = ""
  for i=0, n do
    resTxt = resTxt..str
  end
  return resTxt
end
-- YuyiCore.repeatStr

-- 将局部变量赋值给模块�?
_G["YuyiCore"] = YuyiCore
-- 消除结尾return直接将模块赋值给package.loaded
package.loaded["YuyiCore"] = YuyiCore
return YuyiCore
