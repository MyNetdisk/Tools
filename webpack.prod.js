const path = require('path'); // 引入path模块
const config = require('./webpack.common.js'); // 引入公共配置
const { merge } = require('webpack-merge'); // 合并配置
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 引入css压缩插件
const TerserPlugin = require('terser-webpack-plugin'); // 引入js压缩插件

const isAnalyzeMode = process.env.ANALYZE_BUNDLE === 'true'; // 判断是否分析模式

// 生产环境配置
const prodConfig = {
  mode: 'production', // 生产模式
  // 输出配置
  optimization: {
    minimize: true, // 开启代码压缩
    minimizer: [
      new CssMinimizerPlugin({
        // 使用css压缩插件
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }], // 移除所有注释
        },
      }),
      new TerserPlugin({
        // 使用js压缩插件
        terserOptions: {
          compress: {
            drop_console: true, // 删除console
          },
        },
      }),
    ], // 使用css和js压缩插件
    splitChunks: {
      // 分割代码
      chunks: 'all', // 对所有模块进行分割
      minSize: 20000, // 最小分割大小
      cacheGroups: {
        // 缓存组
        vendors: {
          // 第三方库
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          // 默认缓存组
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  // 性能配置
  performance: {
    hints: 'warning', // 性能提示级别
    maxAssetSize: 200000, // 单个资源文件最大体积（字节）
    maxEntrypointSize: 400000, // 入口点文件最大体积（字节）
    assetFilter: function (assetFilename) {
      // 只检查 JS 和 CSS 文件的性能
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
    },
  },
};

// 只有当 ANALYZE_BUNDLE 环境变量为 true 时才添加分析器
if (isAnalyzeMode) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 引入分析器插件
  // 确保 plugins 数组存在
  if (!prodConfig.plugins) {
    prodConfig.plugins = [];
  }
  prodConfig.plugins = [
    ...prodConfig.plugins,
    new BundleAnalyzerPlugin({
      analyzerMode: 'server', // 服务器模式
      openAnalyzer: true, // 自动打开分析器
      reportFilename: path.resolve(__dirname, 'report.html'), // 报告文件路径
      generateStatsFile: true, // 生成stats文件
      statsFilename: path.resolve(__dirname, 'stats.json'), // stats文件路径
    }),
  ]; // 添加分析器插件
}

module.exports = merge(config, prodConfig); // 合并配置
