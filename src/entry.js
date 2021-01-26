"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: junjie.lean
 * @Date: 2021-01-26 15:09:42
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-01-26 17:31:31
 */
var fs_1 = require("fs");
var toolConfig_1 = require("./toolConfig");
var CodeCom = /** @class */ (function () {
    function CodeCom() {
    }
    CodeCom.lookConfig = function () {
        console.log(toolConfig_1.default);
        console.log(fs_1.promises);
    };
    CodeCom.prototype.dev = function () {
        console.log(toolConfig_1.default);
    };
    return CodeCom;
}());
exports.default = CodeCom;
CodeCom.lookConfig();
