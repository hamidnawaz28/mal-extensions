import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

const config = {
  entry: {
    background: "/src/background/index.js",
    contentScript: "/src/content-script/index.tsx",
    popup: "/src/popup/index.tsx",
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // encode smaller files as data URLs
            },
          },
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "user_care/[name].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.json", to: "user_care" },
        { from: "assets/logo.png", to: "user_care" },
        { from: "src/popup/popup.html", to: "user_care/popup.html" },
      ],
    }),
  ],
  devtool: "cheap-module-source-map",
};
export default config;
