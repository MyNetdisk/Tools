const path = require('path'); // 引入path模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理dist文件夹
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 把css提取到单独的文件中

module.exports = {
  entry: {
    main: './src/main.js',       // 主业务逻辑
    watermark: './src/watermark/js/index.js', // 水印
  }, // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出文件路径
    filename: 'js/bundle-[name]-[fullhash:8].js', // 输出文件名
  }, // 输出文件
  plugins: [
    new HtmlWebpackPlugin({
      // 生成html文件
      title: '主页', // 页面标题
      template: './src/index.html', // 模板文件
      filename: 'index.html', // 输出文件名
      inject: 'head', // 注入位置
      chunks: ['main'], // 引入的js文件
    }),
    new HtmlWebpackPlugin({
      // 生成html文件
      title: '水印', // 页面标题
      template: './src/watermark/index.html', // 模板文件
      filename: 'watermark.html', // 输出文件名
      inject: 'head', // 注入位置
      chunks: ['watermark'], // 引入的js文件
    }),
    new CleanWebpackPlugin(), // 清理dist文件夹
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[fullhash:8].css', // 输出文件名
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/, // 匹配css文件
        use: [
          MiniCssExtractPlugin.loader, // 把css提取到单独的文件中
          'css-loader', // 解析css文件
          'postcss-loader' // ← 自动读取 postcss.config.js 的配置
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i, // 匹配图片文件
        type: 'asset/resource', // 使用资源模块
        generator: {
          filename: 'assets/[hash][ext][query]', // 输出文件名
        },
      },
    ],
  },
};
