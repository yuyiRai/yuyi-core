-- 配置对象
require "YuyiCore"

local TextPanel = {}
local Utils = {}

TextPanel.Utils = Utils

TextPanel.KEY_LineSize = "lineSize"
TextPanel.KEY_LinePrefix = "linePrefix"
TextPanel.KEY_LineSuffix = "lineSuffix"
TextPanel.KEY_IsDebug = "IsDebug"
local Config = {
  fontType = "Arial",
  fontSize = 35,
  lang = {
    "jp",
    "ch"
  }
}

--设置配置
function TextPanel.set(key, value)
  Config[key] = value
end

--取得配置
function TextPanel.get(key, defaultValue)
  if defaultValue ~= nil then return YuyiCore.defaultTo(Config[key], defaultValue) end
  return Config[key]
end


function TextPanel.isDebug()
  return TextPanel.get(TextPanel.KEY_IsDebug)
end

function TextPanel.setPlatform(isDebug, lineSize, prefix, suffix)
  TextPanel.set(TextPanel.KEY_IsDebug, isDebug)
  TextPanel.set(TextPanel.KEY_LineSize, lineSize)
  TextPanel.set(TextPanel.KEY_LinePrefix, TextPanel.getTableOptions(prefix))
  TextPanel.set(TextPanel.KEY_LineSuffix, TextPanel.getTableOptions(suffix))
end
function TextPanel.platformFormat(text)
  return table.concat(
    YuyiCore.chunkString(
      text, 
      TextPanel.get(TextPanel.KEY_LineSize, 0), 
      TextPanel.get(TextPanel.KEY_LinePrefix), 
      TextPanel.get(TextPanel.KEY_LineSuffix)
    ), 
    '\n'
  )
end

function TextPanel.getTableOptions(value)
  local types = type(value)
  if types == 'string' or type == 'number' then
    return YuyiCore.stringToChars(value.."")
  elseif types == 'table' then
    return value
  else
    return {}
  end
end

-- 输出增量
function TextPanel.increment(preMsg, nextTime, preTime)
  local preLength = YuyiCore.getStringLength(preMsg)
  local incrementLength = 20 * (nextTime - preTime) - preLength + 1.5
  -- local pm = preLength.."("..preTime..":"..nextTime..""..":"..incrementLength..")".."\r\n"
  -- obj.mes(pm)
  -- obj.mes(string.rep("1", incrementLength - getStringLength(pm)))
  return "<w"..(incrementLength / 20)..">" --string.rep(" ", incrementLength - 1)
end

function TextPanel.getMessageMap(obj, msg, szSeparator, special)
  if type(msg) == 'string' and TextPanel.__LAST_MSG ~= msg then
    for i=1, #special do
      msg = string.gsub(msg, special[i].."\\", special[i])
    end
    TextPanel.__LAST_MSG = YuyiCore.splitStrMul(msg, szSeparator, 1)
  end
  return TextPanel.__LAST_MSG
end

-- 根据中间点执行操作
function TextPanel.toPoint(obj, msg, szSeparator, special, forceRender)
  local msgMap = TextPanel.getMessageMap(obj, msg, szSeparator, special)
  local text = ""
  local currentTime = obj.time
  local max = obj.getoption("section_num") - 1
  local currentSelection = 1
  for i=0, max do
    local index = i + 1
    local pointTime = obj.getvalue("time", 0, i)
    local isSelectionTime = currentTime >= pointTime
    if forceRender == true or isSelectionTime then
      if i > 0 then
        if isSelectionTime then
          currentSelection = index
        end
        local preTime = obj.getvalue("time", 0, i - 1)
        text = text..TextPanel.increment(msgMap[i], pointTime, preTime)
      end
      text = text..msgMap[index]
    else
      break
    end
  end
  if TextPanel.isDebug() and (type(currentSelection) == 'number') then
    obj.mes("current: "..currentSelection.."\n")
  end
  return text
end


-- 根据中间点执行操作
function TextPanel.getPointIter(obj, msg, szSeparator, width)
  local msgMap = YuyiCore.splitStr(msg, szSeparator)
  local max = obj.getoption("section_num") - 1
  local i = 0
  return function(obj)
    local current = obj.getvalue("time")
    local pointTime = obj.getvalue("time", 0, i)
    local text = ""
    if current >= pointTime then
      text = msgMap[i+1]
      local lll = YuyiCore.getStringLength(text)
      if lll > width then
        text = string.sub(text, 1, string.len(string.rep("  ", lll - width)))
      elseif lll < width then
        text = text..width..lll
      end
    end
    i = i + 1
    return text, i
  end, max
end
-- 根据中间点执行操作
function TextPanel.getPointIter(obj, msgMap, szSeparator, width)
  local max = obj.getoption("section_num") - 1
  local i = 0
  return function(obj)
    local current = obj.getvalue("time")
    local pointTime = obj.getvalue("time", 0, i)
    local text = ""
    if current >= pointTime then
      text = msgMap[i+1]
    end
    i = i + 1
    return text, i
  end, max
end

function Utils.LineMsg(obj, speed, lineheight)
  local line = 0;
  obj.setfont("Tahoma", 41, 3, 0xffffff, 0x000000)
  return function(msg, time)
    obj.setoption("tempbuffer", "tmp", 500, 500)
    obj.load("text", msg, speed, time)
    obj.draw(0, line * lineheight, 0, 1)
    line = line + 1
    obj.load("tempbuffer")
  end
end

function GetPoint(obj, msg)
  local txt = Utils.LineMsg(obj, 20, 41)
  local getMsg, max = TextPanel.getPointIter(obj, msg, "\n", 30)
  for _=0, max do
    txt(_..":"..getMsg(obj), 1)
  end
end

function Utils.fade(time, totaltime, fadein, fadeout, isDebug)
  --淡入淡出
  local t_fade
  local status
  if time < (fadein/1000) then 
    t_fade = time/(fadein/1000)
    status = -1
  elseif time > (totaltime - fadeout/1000) then 
    t_fade = (totaltime - time)/(fadeout/1000)
    status = 1
  else
    t_fade = 1
    status = 0
  end
  Utils.debugMsg(t_fade..","..status, isDebug)
  return t_fade, status
end

function Utils.debugMsg(obj, msg, isDebug)
  if (isDebug and isDebug~=0) then
    obj.setoption("dst", "tmp", 500, 500)
    obj.setfont(Config.fontType, Config.fontSize, 3, 0xffffff, 0x000000)
    obj.load("text", msg)
    obj.draw(0, 0, 0, 1)
    obj.load("tempbuffer")
  end
end


function Utils.mes(obj, msg, size, afterFontConfig)
  if size ~= nil then
    obj.setoption("dst", "tmp")
  else
    obj.setoption("dst", "tmp", size[0], size[1])
  end
  if afterFontConfig == 1 then
    obj.setfont(Config.fontType, Config.fontSize)
  end
  obj.load("text", msg)
end

function Utils.mes2(obj, msg)
  obj.setoption("dst", "tmp")
  obj.setfont(Config.fontType, Config.fontSize)
  obj.load("text", msg)
end

function Utils.setFont(font, size)
  Utils.set('fontSize', size)
  Utils.set('fontType', font)
end

function Utils.setFontSize(size, font)
  Utils.set('fontSize', size)
  Utils.set('fontType', font)
end

function Utils.set(key, value)
  if value ~= nil then
    Config[key] = value
  elseif type(value) == "boolean" then
    Config[key] = nil
  end
end


-- 将局部变量赋值给模块名
_G["TextPanel"] = TextPanel
-- 消除结尾return直接将模块赋值给package.loaded
package.loaded["TextPanel"] = TextPanel

local handler_key = "$TextPanel_displayHandler"
local textTmp_key = "$TextPanel_displayText"


function TextPanel.loadText(obj, text, splitOptions, specialText, forceRender)
  YuyiCore.set(textTmp_key, text)
  YuyiCore.set(handler_key, obj.mes)
  local main, append = YuyiCore.getOption(splitOptions)
  obj.mes(
    TextPanel.toPoint(
      obj,
      text,
      YuyiCore.getMixedPertten(main, append),
      YuyiCore.stringToChars(YuyiCore.defaultTypeTo(specialText, "string", "")),
	    YuyiCore.defaultTypeTo(forceRender, "boolean", true)
    )
  )
end


function TextPanel.toPlatform(obj, text, splitOptions, specialText, forceRender)
  YuyiCore.set(textTmp_key, text)
  YuyiCore.set(handler_key, obj.mes)
  local main, append = YuyiCore.getOption(splitOptions)
  obj.mes(
    TextPanel.toPoint(
      obj,
      TextPanel.platformFormat(text),
      YuyiCore.getMixedPertten(main, append),
      TextPanel.getTableOptions(specialText),
	    YuyiCore.defaultTypeTo(forceRender, "boolean", true)
    )
  )
end

function TextPanel.getDisplayText(text)
	return YuyiCore.defaultTo(text, YuyiCore.get(textTmp_key, "---debugger---"))
end
function TextPanel.mes(text)
	return YuyiCore.get(handler_key, print)(TextPanel.getDisplayText(text))
end

return TextPanel.loadText

