const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devHost = "localhost";
const devPort = "5000";

const runningEnvironment = {
  Development: "development",
  Production: "production"
};

const plugins = {
  [runningEnvironment.Development]: [],
  [runningEnvironment.Production]: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new WorkboxPlugin.GenerateSW()
  ]
};

const stylesUse = {
  [runningEnvironment.Development]: ["style-loader", "css-loader", "sass-loader"],
  [runningEnvironment.Production]: [
    "style-loader",
    MiniCssExtractPlugin.loader,
    "css-loader",
    "sass-loader"
  ]
};

module.exports = (env = runningEnvironment.Development) => ({
  devServer: {
    host: devHost,
    port: devPort,
    proxy: [
      {
        context: ["/analyseText", "/api"],
        target: "http://localhost:5000"
      }
    ],
    hot: true,
    overlay: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    historyApiFallback: true
  },
  mode: env,
  entry: "./src/client/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle-[hash].min.js",
    libraryTarget: "var",
    library: "Client"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: stylesUse[env]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new HtmlWebPackPlugin({
      template: "./src/client/views/index.html",
      hash: true,
      xhtml: true
    })
  ].concat(plugins[env])
});
