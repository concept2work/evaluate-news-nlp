const path = require('path');
const loader = require('sass-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv').config({ path: './.env' });

module.exports = {
  entry: {
    entry: './src/client/index.js',
  },
  output: {
    libraryTarget: 'var',
    library: 'Client',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: true,
      verbose: true,
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: false,
    }),
    new HtmlWebPackPlugin({
      template: './src/client/views/index.html',
      filename: './index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.PORT_DEV': JSON.stringify(process.env.PORT_DEV),
      'process.env.PORT_DEV_PROXY': JSON.stringify(process.env.PORT_DEV_PROXY),
      'process.env.PORT_PROD': JSON.stringify(process.env.PORT_PROD),
    }),
  ],
};
