const { merge } = require('webpack-merge');
const dotenv = require('dotenv').config({ path: './.env' });
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: process.env.PORT_DEV,
    proxy: {
      '/api': `http://localhost:${process.env.PORT_DEV_PROXY}`,
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
});