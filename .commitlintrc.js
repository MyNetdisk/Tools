module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 问题修复
        'docs', // 文档变更
        'style', // 代码样式/格式化
        'refactor', // 重构（非功能/非修复）
        'test', // 测试相关
        'chore', // 构建/工具变更
        'perf', // 性能优化
        'revert', // 回滚提交
      ],
    ],
    'subject-case': [0], // 取消 subject 首字母大写校验
  },
};
