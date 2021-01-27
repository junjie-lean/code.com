/*
 * @Author: junjie.lean
 * @Date: 2021-01-26 15:09:42
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-01-27 10:31:55
 */

/**
 * @version 0.0.1
 * @description :  code compute and statistics result by file author
 * @muduleExport : statistics result
 */

import { promises as fsPromise } from "fs";
import * as path from "path";

import toolConfig from "./toolConfig";

const { authorKey, modifyKey, includeDir, ignoreDir } = toolConfig;

//root dir
//code author list
const authorList: Array<any> = [];

//code file header list
const fileStatisticsList: Array<any> = [];

/**
 * @description  recursion dispose dir,
 * if target is Directory, recursion dispose it,
 * or if target is file, call readSize( file path ) function
 * @param { String }  _path
 * @returns null
 */
async function recursionDisposeDir(_path: string) {
  const currentStats: any = await fsPromise.stat(_path);
  const currentPathIsDir: boolean = currentStats.isDirectory();

  if (currentPathIsDir) {
    //if current path is dir , check it's in ignore list?

    const currentDirIsInIgnoreList: boolean = ignoreDir.some((item) => {
      // const currentDirName = _path.slice(_path.lastIndexOf("\\") + 1);
      const currentDirName = _path.slice(_path.lastIndexOf(path.sep) + 1);
      return item === currentDirName || item === "DS_Store";
    });

    // console.log( _path.slice(_path.lastIndexOf("\\") + 1), '\n',_path);
    if (currentDirIsInIgnoreList) {
      // current dir is in ignore list , continue
      // console.log("do not dispose this path:", _path);
      // console.log("ignore dir:", _path);
    } else {
      let lsDir = await fsPromise.readdir(_path);

      lsDir.map((item) => {
        let childrenPath = path.resolve(_path, item);
        recursionDisposeDir(childrenPath);
      });
    }
  } else {
    let res = await readFileInfo(_path);
    fileStatisticsList.push(res);
    // console.log(res);
  }
  return fileStatisticsList;
}

/**
 * @description set authorList value
 * @param { String } _path
 * @returns file info object
 */
const readFileInfo = async function (_path: string) {
  let fileContent: string = await (await fsPromise.readFile(_path)).toString();
  let fileStat: any = await fsPromise.stat(_path);

  let fileHeader: Array<string> = fileContent
    .slice(2, fileContent.indexOf("*/"))
    .split(" * ")
    .filter((item) => {
      return item != "\r\n";
    })
    .map((item) => {
      return item ? item.replace("\r\n", "").replace("@", "").trim() : "";
    });

  let fileAuthor: string = "";
  let fileLastModify: string = "";

  fileHeader.map(function (item: string): void {
    if (item.indexOf(authorKey) > -1) {
      //if find author key,dispose fileAuthor
      fileAuthor = item.slice(authorKey.length + 1).trim();
    }

    if (item.indexOf(modifyKey) > -1) {
      //but if find this string key is modifyKey,dispose lastmodify key
      fileLastModify = item.slice(modifyKey.length + 1).trim();
    }
  });

  // console.log("fileAuthor:", fileHeader);
  // console.log("fileLastModify:", fileLastModify);

  let fileInfo = {
    fileName: path.basename(_path),
    filePath: _path,
    fileSize: fileStat.size,
    fileSizeUtil: "byte",
    fileAuthor,
    fileLastModify,
    isAuthorLastModify: fileAuthor === fileLastModify,
  };
  // console.log(fileInfo);
  // fileStatisticsList.push(fileInfo);
  return fileInfo;
};

(async () => {
  // includeDir.map(function (item: string): any {
  //   recursionDisposeDir(item);
  // });

  for (let item of includeDir) {
    await recursionDisposeDir(item);
    console.log(fileStatisticsList);
  }
})();
