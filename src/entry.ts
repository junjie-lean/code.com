/*
 * @Author: junjie.lean
 * @Date: 2021-01-26 15:09:42
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-01-28 16:26:27
 */

/**
 * @version 0.0.1
 * @description :  code compute and statistics result by file author
 * @muduleExport : statistics result
 */

import { promises as fsPromise } from "fs";
import * as path from "path";
import * as lodash from "lodash";
import toolConfig from "./toolConfig";

const { authorKey, modifyKey, includeDir, ignoreDir } = toolConfig;

//code author list
const authorList: Array<any> = [];

//code file header list
const fileStatisticsList: Array<any> = [];

/**
 * @description  recursion dispose dir,
 * if target is Directory, recursion dispose it,
 * or if target is file, call readSize( file path ) function
 * @param { String }  _path
 * @returns Promise
 */
async function recursionDisposeDir(_path: string) {
  const currentStats: any = await fsPromise.stat(_path);
  const currentPathIsDir: boolean = currentStats.isDirectory();

  if (currentPathIsDir) {
    //if current path is dir , check it's in ignore list?
    const currentDirIsInIgnoreList: boolean = ignoreDir.some((item) => {
      // const currentDirName = _path.slice(_path.lastIndexOf("\\") + 1);
      const currentDirName = _path.slice(_path.lastIndexOf(path.sep) + 1);
      return item === currentDirName;
    });

    // console.log( _path.slice(_path.lastIndexOf("\\") + 1), '\n',_path);
    if (!currentDirIsInIgnoreList) {
      let lsDir: Array<string> = await fsPromise.readdir(_path);
      lsDir.map((item) => {
        if (item === ".DS_Store") {
          return false;
        }
        let childrenPath = path.resolve(_path, item);
        recursionDisposeDir(childrenPath);
      });
    }
  } else {
    let fileInfo = await readFileInfo(_path);
    fileStatisticsList.push(fileInfo);
    //处理fileinfo
  }
}

/**
 * @description set authorList value
 * @param { String } _path,current path must be a file
 * @returns file info object
 */
const readFileInfo = async function (_path: string) {
  let fileContent: string = (await fsPromise.readFile(_path)).toString();
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
  return fileInfo;
};

(async () => {
  await recursionDisposeDir("target");
  // console.log("fileStatisticsList1 : ", fileStatisticsList);
  setTimeout(() => {
    //group  statistic data by author name:
    let groupList = lodash.groupBy(fileStatisticsList, "fileAuthor");
    Reflect.ownKeys(groupList).map((item) => {
      if (item !== "") {
        authorList.push(item);
      }
    });

    //reduce all authors code data
    let authorCountArr: Array<any> = [];

    authorList.map((item) => {
      authorCountArr.push({
        name: item,
        countByCreate: groupList[item].length,
        sizeByCreate: groupList[item]
          // .filter((item) => item.isAuthorLastModify)
          .reduce((t, c) => {
            return t + c.fileSize;
          }, 0),
        conut: groupList[item].filter((item) => item.isAuthorLastModify).length,
        size: groupList[item]
          .filter((item) => item.isAuthorLastModify)
          .reduce((t, c) => {
            return t + c.fileSize;
          }, 0),
      });
    });

    let sizeTotal: number = 0;
    let sizeByCreateTotal: number = 0;

    sizeTotal = authorCountArr.reduce((total, current) => {
      return total + current.size;
    }, 0);

    sizeByCreateTotal = authorCountArr.reduce((total, current) => {
      return total + current.sizeByCreate;
    }, 0);

    authorCountArr = authorCountArr.map((item) => {
      return {
        ...item,
        sizePercent: Math.round((item.size / sizeTotal) * 100) + "%",
        sizeByCreatePercent:
          Math.round((item.sizeByCreate / sizeByCreateTotal) * 100) + "%",
      };
    });

    console.log(authorCountArr);
  }, 3000);
})();
