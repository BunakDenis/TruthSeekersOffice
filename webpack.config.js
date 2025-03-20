const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

const pagesDir = path.resolve(__dirname, "src/pages");
const htmlFiles = fs
  .readdirSync(pagesDir)
  .filter((file) => file.endsWith(".html"));

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
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              sources: false, // Отключает обработку путей
            },
          },
        ],
      },
      {
        test: /\.txt$/, // Загружаем частичные файлы как текст
        use: "raw-loader",
        type: "asset/source",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/partials", to: "partials" },
        { from: "./src/images", to: "images" },
        { from: "./src/video", to: "video" },
        { from: "./src/js/luxon.js", to: "js" },
        { from: "./src/js/cssVariables.js", to: "js" },
      ],
    }),
    // Динамически находим все HTML-файлы в папке src/pages
    ...htmlFiles.map(
      (file) =>
        new HtmlWebpackPlugin({
          template: `src/pages/${file}`,
          filename: file,
        })
    ),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    hot: true,
    port: 3000,
    open: true,
    watchFiles: ["*.html", "css/*.css", "js/*.js"],
    historyApiFallback: {
      rewrites: [
        { from: /^\/cabinet$/, to: "/cabinet.html" },
        { from: /^\/contacts$/, to: "/contacts.html" },
        { from: /^\/searchingResult$/, to: "/searchingResult.html" },
        { from: /^\/userProfile$/, to: "/userProfile.html" },
        { from: /^\/userSignUp$/, to: "/userSignUp.html" },
      ],
    },
    devMiddleware: {
      writeToDisk: true, // Записывает файлы в `dist`, как при обычном билде
    },
  },
};
