require('../YuyiCore')

local easein = YuyiCore.easein
local easeout = YuyiCore.easeout

-- 将局部变量赋值给模块名
_G["YuyiCore"] = YuyiCore
-- 消除结尾return直接将模块赋值给package.loaded
package.loaded["YuyiCore"] = YuyiCore
return {
  YuyiCore = YuyiCore,
  easeout = easeout,
  easein = easein
}
