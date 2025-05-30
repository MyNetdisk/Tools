const config = require('./webpack.common.js'); // 引入公共配置
const { merge } = require('webpack-merge'); // 合并配置
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 引入css压缩插件
const TerserPlugin = require('terser-webpack-plugin'); // 引入js压缩插件

// 生产环境配置
const prodConfig = {
  mode: 'production', // 生产模式
  optimize: {
    minimize: true, // 开启代码压缩
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 删除console
          },
        },
      }),
    ], // 使用css和js压缩插件
  },
};

module.exports = merge(config, prodConfig); // 合并配置