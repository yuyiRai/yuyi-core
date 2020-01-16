--class.lua
local tableLib = require('./table')
local _class = { }
local function instanceof(self_ptr, compare_class)
    if not compare_class or not self_ptr then return false end
    local raw_class = self_ptr.class
    while raw_class do
        if raw_class == compare_class then return true end
        raw_class = raw_class.super
    end
    return false
end
--创建一个类
local function classBase(defined, super)
    local __proto__ = {
      --_class[super]这里返回的是super 本身作为class_type 对应的vtbl
      --父类的vtbl
      -- super = lib.filterTable(super, function (super) return _class[super] end),
      is = instanceof
    }
    local vtbl = type(defined) == 'table' and defined or { }
    local keys = { }
    local class_type = {
      ctor = false,
      super = super,
      __proto__ = __proto__,
      keys = function ()
        keys = type(super) == 'table' and (
          tableLib.reduce(super, function(result, value)
            return tableLib.concatTable(result, value.keys())
          end,
          {})
        ) or {}
        for key in pairs(vtbl) do
          if string.match(key, '^_') == nil then
            table.insert(keys, key)
          end
        end
        return keys
      end
    }
    _class[class_type] = vtbl

    --设置class_type类本身的元方法，这里操作的是vtbl，并没有修改class_type本身（查找域和添加域都是操作的vtbl，class_type只是简单的原型）
    setmetatable(class_type, {
        __newindex = function(t, k, v) vtbl[k] = v end,
        __index = vtbl
    } )

    if super ~= nil then
      --关联父类子类的关系的查找域，vtbl关联父类的btbl查找域
      setmetatable(vtbl, {
        __index =
        function(target, key)
          if key and class_type.__proto__[key] then
            return class_type.__proto__[key]
          elseif key and super ~= nil and #super > 0 then
            local find, length = tableLib.findMapTableWith(_class, super)
            if key and find then
              local ret = nil
              for superClass_type in find do
                ret = superClass_type[key]
                -- print('get key', key, superClass_type[key])
                vtbl[key] = ret
                if ret then break end;
              end
              assert(ret ~= nil, 'undefined! search: '..length)
              return ret
            end
          end
        end
      } )
    else
      setmetatable(vtbl, { __index = class_type.__proto__ })
    end
    
    return class_type
end

-- local function class(...)
--   local args = { ... }
--   local super = nil
--   local defined = nil
--   if type(args[1]) == 'table' and args[1] and (args[1].__proto__ ~= nil or (args[1][1] and args[1][1] .__proto__)) then
--     super = args[1]
--     defined = args[2]
--   else
--     defined = args[1]
--   end
--   return classBase(super, defined)
-- end
local function class(defined, ...)
  local super = { ... }
  local class_type = classBase(defined, super);
  class_type.__proto__.New = function(...)
      -- 一个类实例的构建
      local obj = { class = class_type }
      -- 设置实例关联类的查找域vtbl
      setmetatable(obj, {
          __index =
          function(t, k)
              return _class[class_type][k]
          end
      } )

      --类和所有父类的ctor构造函数收集，第一个当前类的ctor，第二个父类的ctor，第三个父类的父类的ctor，....
      local inherit_list = { }
      local class_ptr = class_type
      while class_ptr do
          if class_ptr.ctor then table.insert(inherit_list, class_ptr) end
          class_ptr = class_ptr.super
      end
      local inherit_length = #inherit_list
      --调用所有构造函数，从最上层的父类ctor开始知道当前类的ctor
      if inherit_length > 0 then
          for i = inherit_length, 1, -1 do 
              inherit_list[i].ctor(obj, ...)
          end
      end
      obj.super = inherit_list[2];

      if detectMemoryLeak then
          registerToWeakTable(obj, debug.traceback("obj lua stack:"));
      end

      obj.class = class_type

      return obj
  end

  return class_type
end

_G["class"] = class
package.loaded["class"] = class
return {
  create = class,
  classBase = classBase
}
