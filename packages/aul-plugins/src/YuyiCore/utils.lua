local baseLib = require('./lib')
local tableLib = require('./table')
local strLib = require('./string')
local class = require('./class')

local utils = class.classBase(baseLib, {
  class.create(tableLib),
  class.create(strLib)
})

function utils.module(target, ...)
  return class.classBase(target, {...})
end

return utils
