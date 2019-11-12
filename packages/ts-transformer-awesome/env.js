"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-nameof");
global.filters = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args[0];
};
global.__DEV__ = process.env.NODE_ENV !== 'production';
