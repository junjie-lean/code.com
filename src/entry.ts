/*
 * @Author: junjie.lean
 * @Date: 2021-01-26 15:09:42
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-01-26 15:30:43
 */

// import * as config from "./config";
const config: object = {
  name: "lean",
};

export default class CodeCom {
  static lookConfig() {
    console.log(config);
  }
  dev() {
    console.log(config);
  }
}

CodeCom.lookConfig();
