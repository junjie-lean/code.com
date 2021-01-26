/*
 * @Author: junjie.lean
 * @Date: 2021-01-26 14:45:38
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-01-26 15:27:35
 */

/**
 * @description
 * @export webpack config
 */

const path = require("path");

module.exports = {
  mode: "production",
  devtool: "inline-source-map",
  entry: path.resolve(__dirname, "../src", "entry.ts"),
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            persets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
