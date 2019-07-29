-- 获取字符串的长度（任何单个字符长度都为1）
function getStringLength(inputstr)
  if not inputstr or type(inputstr) ~= "string" or #inputstr <= 0 then
      return nil
  end
  local length = 0  -- 字符的个数
  local i = 1
  while true do
      local curByte = string.byte(inputstr, i)
      local byteCount = 1
      if curByte > 239 then
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

-- 分割字符串
function Split(szFullString, szSeparator)  
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
  return nSplitArray  
end

-- 返回某个字符重复n次
function repeatStr(str, n)
  local resTxt = ""
  for i=0, n do
    resTxt  = resTxt..str
  end
  return resTxt
end

-- 输出增量
function increment(preMsg, nextTime, preTime)
  local preLength = getStringLength(preMsg)
  local incrementLength = 20 * (nextTime - preTime) - preLength
  -- local pm = preLength.."("..preTime..":"..nextTime..""..":"..incrementLength..")".."\r\n"
  -- obj.mes(pm)
  -- obj.mes(repeatStr("1", incrementLength - getStringLength(pm)))
  return repeatStr(" ", incrementLength - 1).."\r\n"
end
function getPoint(obj, msg)
  local msgMap = Split(msg, "。")
  local current = obj.getvalue("time")
  local max = obj.getoption("section_num") - 1
  for i=0,max do
    local time = obj.getvalue("time", 0, i)
    if current >= time then
      if i > 0 then
        obj.mes(increment(msgMap[i], time, obj.getvalue("time", 0, i - 1)))
      end
      obj.mes(msgMap[i+1])
    end
  end
end

getPoint(obj,
[[妹の琴葉葵には要注意。
入念で慎重、姉と比べると色んなところに突出
している面がある。
アストラルに来るときには基本的に姉と一緒に
行動をしている、たまに喧嘩をするが全体的には
保護者の立場にいる。
そして他人には見せる事はないが、彼女は見知
らぬ人に対する警戒心がかなり強い。]]
)