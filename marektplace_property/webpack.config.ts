import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import ZipPlugin from 'zip-webpack-plugin'

const config = {
  entry: {
    background: '/src/background/index.ts',
    popup: '/src/popup/index.tsx',
    'facebook': '/src/content-scripts/facebook.ts',
    "facebook_ui": '/src/content-scripts/facebook_ui.tsx',
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
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'marketplace_property/[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'marketplace_property' },
        { from: 'src/assets/logo.png', to: 'marketplace_property' },
        { from: 'src/popup/popup.html', to: 'marketplace_property' },
      ],
    }),
    new ZipPlugin({
      path: '/marketplace_property',
      filename: 'marketplace_property.zip',
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
