const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    cabinet: "./js/cabinet.js",
    cssVariables: "./js/cssVariables.js",
    initFragments: "./js/initFragments.js",
    luxon: "./js/luxon.js",
    main: "./js/main.js",
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
    new CleanWebpackPlugin(), // Очистка папки dist перед сборкой
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: "./cabinet.html",
      filename: "cabinet.html",
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: "./contacts.html",
      filename: "contacts.html",
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: "./searchingResult.html",
      filename: "searchingResult.html",
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: "./userProfile.html",
      filename: "userProfile.html",
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: "./userSignUp.html",
      filename: "userSignUp.html",
      inject: "body",
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
    new MiniCssExtractPlugin({
      filename: "css/navbar.css",
    }),
    new MiniCssExtractPlugin({
      filename: "css/sidebar.css",
    }),
    new MiniCssExtractPlugin({
      filename: "css/cabinetPage.css",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./fragments", to: "fragments" }],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./images", to: "images" }],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./video", to: "video" }],
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    open: true,
    hot: true,
  },
};
