module.exports = {
  content: [
    './src/**/*.{html,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // 在浏览器控制台显示扫描日志
  experimental: {
    log: {
      parsed: true
    }
  }
}