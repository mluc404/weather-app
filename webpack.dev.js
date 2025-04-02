const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");

module.exports = merge(config, {
  mode: "development",

  devtool: "eval-source-map",

  devServer: {
    watchFiles: ["./src/template.html"],
    static: "./dist",
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
});
