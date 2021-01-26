/*
 * @Author: junjie.lean
 * @Date: 2021-01-26 15:09:42
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-01-26 17:31:31
 */
import { promises as fsPromise } from "fs";
import toolConfig from "./toolConfig";

export default class CodeCom {
  static lookConfig() {
    console.log(toolConfig);
    console.log(fsPromise);
  }
  dev() {
    console.log(toolConfig);
  }
}

CodeCom.lookConfig();
