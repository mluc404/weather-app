const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");

module.exports = merge(config, {
  mode: "development",

  devtool: "eval-source-map",

  devServer: {
    // watchFiles: ["./src/template.html"],
    watchFiles: ["src/**/*", "dist/*.html"],
    static: "./dist",
    open: true,

    compress: true,
    historyApiFallback: true,

    host: "0.0.0.0",
    port: 8080,
    allowedHosts: "all",

    hot: true,
    liveReload: true,
  },
});
