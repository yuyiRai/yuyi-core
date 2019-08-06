-- Core
YuyiCore = {}
YuyiCore._VERSION = '1.0'     -- 模块版本

-- 获取字符串的长度（任何单个字符长度都为1）
function YuyiCore.getStringLength(inputstr)
  if not inputstr or type(inputstr) ~= "string" or #inputstr <= 0 then
      return nil
  end
  local length = 0  -- 字符的个数
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
      -- local char = string.sub(inputstr, i, i + byteCount - 1)
      -- print(char)  -- 打印单个字符
      i = i + byteCount
      length = length + 1
      if i > #inputstr then
          break
      end
  end
  return length
end

-- 拆分出单个字符
function YuyiCore.stringToChars(str)
  -- 主要用了Unicode(UTF-8)编码的原理分隔字符串
  -- 简单来说就是每个字符的第一位定义了该字符占据了多少字节
  -- UTF-8的编码：它是一种变长的编码方式
  -- 对于单字节的符号，字节的第一位设为0，后面7位为这个符号的unicode码。因此对于英语字母，UTF-8编码和ASCII码是相同的。
  -- 对于n字节的符号（n>1），第一个字节的前n位都设为1，第n+1位设为0，后面字节的前两位一律设为10。
  -- 剩下的没有提及的二进制位，全部为这个符号的unicode码。
  local list = {}
  local len = string.len(str)
  local i = 1
  while i <= len do
    local c = string.byte(str, i)
    local shift = 1
    if c > 0 and c <= 127 then
      shift = 1
    elseif (c >= 192 and c <= 223) then
      shift = 2
    elseif (c >= 224 and c <= 239) then
      shift = 3
    elseif (c >= 240 and c <= 247) then
      shift = 4
    end
    local char = string.sub(str, i, i+shift-1)
    i = i + shift
    table.insert(list, char)
  end
  return list, len
end

-- 分割字符串
function YuyiCore.splitStr(szFullString, szSeparator)
  local nFindStartIndex = 1
  local nSplitIndex = 1
  local nSplitArray = {}
  while true do
     local nFindLastIndex = string.find(szFullString, szSeparator, nFindStartIndex)
     if not nFindLastIndex then
      nSplitArray[nSplitIndex] = string.sub(szFullString, nFindStartIndex, string.len(szFullString))
      break
     end
     nSplitArray[nSplitIndex] = string.sub(szFullString, nFindStartIndex, nFindLastIndex - 1)
     nFindStartIndex = nFindLastIndex + string.len(szSeparator)
     nSplitIndex = nSplitIndex + 1
  end
  return nSplitArray, nSplitIndex
end

-- 返回某个字符重复n次
-- function YuyiCore.repeatStr(str, n)
--   local resTxt = ""
--   for _=0, n do
--     resTxt = resTxt..str
--   end
--   return resTxt
-- end

-- 将局部变量赋值给模块名
_G["YuyiCore"] = YuyiCore
-- 消除结尾return直接将模块赋值给package.loaded
package.loaded["YuyiCore"] = YuyiCore