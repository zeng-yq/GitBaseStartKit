# Markdown 样式实现指南

本文档记录了项目中 Markdown 渲染的样式实现细节。

## 功能特性

### 1. 行内代码
- **语法**: `代码`
- **效果**: 灰色背景、粉色文字、圆角、无反引号
- **CSS类**: `.prose :not(pre) > code`

### 2. 高亮文本
- **语法**: ==高亮文本==
- **效果**: 黄色背景、深色文字
- **CSS类**: `.highlight-mark`

### 3. 代码块
- **语法**: ```language ... ```
- **效果**: 语法高亮、灰色背景、圆角、边框
- **插件**: `rehype-pretty-code`

## 技术实现

### 插件架构
1. **remark** - Markdown 解析器
2. **自定义插件** (`remark-highlight-text.js`) - 处理 ==语法==
3. **remark-rehype** - 转换 AST
4. **rehype-pretty-code** - 代码高亮
5. **rehype-stringify** - 生成 HTML

### 样式系统
- **Tailwind CSS** - 基础样式框架
- **Tailwind Typography** - 文章排版
- **自定义 CSS** - 特殊样式（globals.css）

## 文件结构
```
src/
├── lib/
│   ├── posts.js                 # Markdown 处理逻辑
│   └── remark-highlight-text.js # 自定义高亮插件
├── app/
│   └── globals.css              # 自定义样式
└── tailwind.config.ts           # Tailwind 配置
```

## 依赖说明

### 核心依赖
- `@tailwindcss/typography` - 文章排版插件
- `rehype-pretty-code` - 代码语法高亮
- `remark` - Markdown 处理器
- `remark-rehype` - AST 转换器
- `rehype-stringify` - HTML 生成器
- `unist-util-visit` - AST 遍历工具

### 移除的依赖
- `remark-html` - 已被 rehype-stringify 替代
- `remark-mark` - 无效，使用自定义插件替代

## 使用示例

### 测试文件
`data/md/zh/markdown-rendering-test.md` 包含了所有功能的测试用例。

### 访问地址
- 开发环境: http://localhost:3000/zh/posts/markdown-rendering-test

## 注意事项

1. 行内代码的反引号通过 CSS 伪元素隐藏
2. 高亮文本通过自定义 remark 插件转换为 `<mark>` 标签
3. 代码块高亮主题设置为 `github-dark`
4. 所有样式都支持深色模式