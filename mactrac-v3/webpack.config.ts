import CopyWebpackPlugin from 'copy-webpack-plugin'
import path from 'path'
import ZipPlugin from 'zip-webpack-plugin'

const config = {
  entry: {
    popup: '/src/Popup/index.jsx',
    contentScript: '/src/main.jsx',
    background: '/src/background/background.js',
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
        test: /\.(js|jsx)$/,
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
              limit: 8192,
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
    extensions: ['.jsx', '.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'mactrac-v3/[name].js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'mactrac-v3' },
        { from: 'src/assets', to: 'mactrac-v3/assets' },
        { from: 'src/Options/options.html', to: 'mactrac-v3' },
        { from: 'src/Options/options.js', to: 'mactrac-v3' },
        { from: 'src/popup/popup.html', to: 'mactrac-v3' },
        { from: 'src/ContentScript/content-pay.js', to: 'mactrac-v3' },
        { from: 'src/ContentScript/Extpay.js', to: 'mactrac-v3' },
      ],
    }),
    new ZipPlugin({
      path: path.resolve(__dirname, 'build'),
      filename: 'mactrac-v3.zip',
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
