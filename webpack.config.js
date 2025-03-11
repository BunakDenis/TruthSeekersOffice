const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

const pagesDir = path.resolve(__dirname, "src/pages");
const htmlFiles = fs
  .readdirSync(pagesDir)
  .filter((file) => file.endsWith(".html"));

// Записываем список файлов в JSON
fs.writeFileSync(
  path.resolve(__dirname, "dist/htmlFilesNames.json"), // Путь для записи JSON
  JSON.stringify(htmlFiles, null, 2) // Преобразуем в JSON с отступами
);

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
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    open: true,
    hot: true,
  },
};
