local baseLib = require('YuyiCore.lib')
local tableLib = require('YuyiCore.table')
local strLib = require('YuyiCore.string')
local class = require('YuyiCore.class')

local utils = class.classBase(baseLib, {
  class.create(tableLib),
  class.create(strLib)
})

function utils.module(target, ...)
  return class.classBase(target, {...})
end

return utils
