const path = require("path");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    cabinet: "./src/js/cabinet.js",
    initFragments: "./src/js/initFragments.js",
    main: "./src/js/main.js",
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
  },
  mode: "development",
  performance: {
    maxEntrypointSize: 50 * 1024 * 1024, // 10 MiB
    maxAssetSize: 50 * 1024 * 1024, // 10 MiB
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["istanbul"], // добавляем плагин покрытия кода
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./fragments", to: "fragments" },
        { from: "./images", to: "images" },
        { from: "./video", to: "video" },
        { from: "./js/luxon.js", to: "js" },
        { from: "./js/cssVariables.js", to: "js" },
      ],
    }),
    ...[
      "index",
      "cabinet",
      "contacts",
      "searchingResult",
      "userProfile",
      "userSignUp",
    ].map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `./${page}.html`,
          filename: `${page}.html`,
          inject: "body",
        })
    ),
  ],
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    open: true,
    hot: true,
  },
};
