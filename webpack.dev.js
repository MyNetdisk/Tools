const config = require('./webpack.common.js'); // 引入公共配置
const { merge } = require('webpack-merge'); // 合并配置
const path = require('path'); // 引入path模块

const devConfig = {
  mode: 'development', // 开发模式
  // 开发服务器配置
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // 替换原来的contentBase
      watch: true, // 监听文件变化
    },
    headers: {
      'Cache-Control': 'no-store', // 禁用缓存
    },
    compress: true, // 启用gzip压缩
    port: 3000, // 设置端口号
    hot: true, // 启用热更新
    open: true, // 自动打开浏览器
    liveReload: false, // 关闭自动刷新（避免与HMR冲突）
  },
};

module.exports = merge(config, devConfig);
