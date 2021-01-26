/*
 * @Author: junjie.lean
 * @Date: 2021-01-26 14:45:38
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-01-26 16:55:06
 */

/**
 * @description
 * @export webpack config
 */

const path = require("path");

module.exports = {
  mode: "production",
  // devtool: "inline-source-map",
  entry: path.resolve(__dirname, "../src", "entry.ts"),
  output: {
    path: path.resolve(__dirname, "../build"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
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
                  loose: true,
                  targets: {
                    node: "current",
                  },
                },
              ],
              ["@babel/preset-typescript"],
            ],
          },
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
};
