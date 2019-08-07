const merge = require("webpack-merge");
const webpack = require("webpack");
const common = require("./webpack.common.js");

module.exports = merge(common(), {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    publicPath: "http://localhost:8080/"
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    hot: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
