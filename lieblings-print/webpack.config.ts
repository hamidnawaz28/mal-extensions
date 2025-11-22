import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import ZipPlugin from 'zip-webpack-plugin'

const config = {
  entry: {
    popup: '/src/popup/index.tsx',
    ebay: '/src/content-script/ebay/index.js',
    temu: '/src/content-script/temu/index.js',
    background: '/src/background.js',
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // encode smaller files as data URLs
            },
          },
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'lister-and-order-processing/[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'lister-and-order-processing' },
        { from: 'src/assets', to: 'lister-and-order-processing' },
        { from: 'src/popup/popup.html', to: 'lister-and-order-processing' },
      ],
    }),
    new ZipPlugin({
      path: '/lister-and-order-processing',
      filename: 'lister-and-order-processing.zip',
      extension: 'zip',
      fileOptions: {
        mtime: new Date(),
        mode: 0o100664,
        compress: true,
        forceZip64Format: false,
      },
      zipOptions: {
        forceZip64Format: false,
      },
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 4000,
  },
  devtool: 'cheap-module-source-map',
}
export default config
