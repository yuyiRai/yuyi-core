----@Fade
--track0:速さ(秒),0,2,0.50,0.01
--track1:間隔(秒),0,1,0.01,0.01
--track2:拡大率,0,100,1,0.01
--track3:X座標,-100,100,4,0.01
--dialog:加速/chk,local a=0;減速/chk,local b=1;逆のFade/chk,local rese=0;
--check0:Simple Fade Out,0
local p, ep
if obj.track0 > 0 then
  local eofs = obj.check0 and 0 or (obj.num-obj.index-1)*obj.track1
  local sp = 1 - math.max(0, math.min(1, (obj.track0-obj.time+obj.index*obj.track1)/obj.track0))
  ep = math.max(0, math.min(1, (obj.totaltime-obj.time-eofs)/obj.track0))
  p = sp * ep
else
  p = obj.notfound and 0 or 1
end
--逆向计算
if rese == 1 then
	p = 1 - p
end
if p == 0 then
  obj.alpha = 0
  return
elseif p == 1 then
  return
end
if ep < 1 and obj.check0 then
  obj.alpha = obj.alpha * p
  return
end
obj.alpha = obj.alpha * p
obj.zoom = obj.zoom * p + (obj.zoom * obj.track2) * (1 - p)
obj.ox = obj.ox * p + (obj.ox + obj.track3) * (1 - p)

----@基本登場
--track0:速さ(秒),-2,2,0.50,0.01
--track1:間隔(秒),0,1,0.03,0.01
--track2:透明度,0,1,1,0.01
--dialog:x/chk,local x=1;y/chk,local y=0;rx,local rx=0;ry,local ry=0;rz,local rz=0;
local p
if obj.track0 > 0 then
  p = math.max(0, math.min(1, (obj.track0-obj.time+obj.index*obj.track1)/obj.track0))
elseif obj.track0 < 0 then
  p = obj.notfound and 1 or math.max(0, math.min(1, (obj.track0+obj.totaltime-obj.time-(obj.num-obj.index-1)*obj.track1)/obj.track0))
else
  p = obj.notfound and 1 or 0
end
if obj.track2 ~= 1 then
  obj.alpha = obj.alpha * (1 - p) + obj.track2 * p
end
if x == 1 and y == 1 then
  obj.zoom = obj.zoom * (1 - p)
elseif x == 1 then
  obj.aspect = obj.aspect * (1 - p) + p
elseif y == 1 then
  obj.aspect = obj.aspect * (1 - p) + -1 * p
end
obj.rx = obj.rx * (1 - p) + rx * p
obj.ry = obj.ry * (1 - p) + ry * p
obj.rz = obj.rz * (1 - p) + rz * p

----@相対移動
--track0:速さ(秒),0,5,0.50,0.01
--track1:間隔(秒),0,5,0.50,0.01
--track2:透明度,0,1,1,0.01
--track3:X,-2000,2000,20,0.1
--dialog:Y,local y=0;Z,local z=0;加速/chk,local a=0;減速/chk,local b=1;登場/chk,local ein=1;退場/chk,local eout=1;
--check0:逆の移動,0
local TchieLib = require("./TachieLib")

if obj.notfound then
  obj.alpha = obj.alpha * obj.track2
  return
end
local p, sp
if obj.track0 > 0 then
  local eofs = (obj.num-obj.index-1)*obj.track1
  sp = ein == 0 and 1 or 1 - math.max(0, math.min(1, (obj.track0-obj.time+obj.index*obj.track1)/obj.track0))
  local ep = eout == 0 and 1 or math.max(0, math.min(1, (obj.totaltime-obj.time-eofs)/obj.track0))
  p = sp * ep
else
  p = obj.notfound and 0 or 1
end
if p ~= 0 and p ~= 1 then
  if a == 1 and b == 1 then
    p = p < 0.5 and YuyiCore.easein(p * 2) * 0.5 or YuyiCore.easeout((p - 0.5) * 2) * 0.5 + 0.5
  elseif a == 1 then
    p = sp < 1 and YuyiCore.easein(p) or YuyiCore.easeout(p)
  elseif b == 1 then
    p = sp < 1 and YuyiCore.easeout(p) or YuyiCore.easein(p)
  end
end
local x = obj.track3;
--local function getValue(base, offset, offsetMax)
-- return (base + offset) * p
--end
obj.alpha = obj.alpha * p + obj.alpha * obj.track2 * (1 - p)
obj.ox = obj.ox * (1 - p) + (obj.ox + x) * p - (obj.check0 and x or 0)
obj.oy = obj.oy * (1 - p) + (obj.oy + y) * p - (obj.check0 and y or 0)
obj.oz = obj.oz * (1 - p) + (obj.oz + z) * p - (obj.check0 and z or 0)


----@ぼよん
--track0:長さ(秒),0,5,0.30,0.01
--track1:間隔(秒),0,1,0.03,0.01
--track2:速さ(秒),0.01,1,0.1,0.01
--track3:サイズ,0.01,0.5,0.05,0.01
--dialog:横位置(0-2),local ax=1;縦位置(0-2),local ay=2;
local p = math.max(0, math.min(1, (obj.track0-obj.time+obj.index*obj.track1)/obj.track0))
if p == 0 or p == 1 then
  return
end
local scale = math.sin(math.pi*(obj.time-obj.index*obj.track1)/obj.track2)
local z = obj.zoom
obj.zoom = obj.zoom + scale * obj.track3 * p
if ax ~= 1 then
  local ofs = (obj.w * obj.zoom - obj.w * z) * 0.5
  obj.ox = obj.ox + (ax == 0 and ofs or -ofs)
end
if ay ~= 1 then
  local ofs = (obj.h * obj.zoom - obj.h * z) * 0.5
  obj.oy = obj.oy + (ay == 0 and ofs or -ofs)
end
