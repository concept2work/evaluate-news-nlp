const { merge } = require('webpack-merge');
const dotenv = require('dotenv').config({ path: './.env' });
const HtmlWebPackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: process.env.PORT_DEV,
    proxy: {
      '*': `http://[::1]:${process.env.PORT_DEV_PROXY}`,
      // '/api': `http://localhost:${process.env.PORT_DEV_PROXY}`,
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/client/views/index.html',
      filename: './index.html',
    }),
  ],
});
