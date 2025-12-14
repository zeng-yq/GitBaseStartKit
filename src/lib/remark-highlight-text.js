import { visit } from 'unist-util-visit'

// 自定义 remark 插件，将 ==文本== 转换为 <mark> 标签
export function remarkHighlightText() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      // 匹配 ==文本== 语法
      const highlightRegex = /==(.*?)==/g
      const matches = [...node.value.matchAll(highlightRegex)]

      if (matches.length > 0) {
        // 创建新的子节点数组
        const children = []
        let lastIndex = 0

        matches.forEach((match) => {
          // 添加高亮前的普通文本
          if (match.index > lastIndex) {
            children.push({
              type: 'text',
              value: node.value.slice(lastIndex, match.index)
            })
          }

          // 添加高亮文本节点
          children.push({
            type: 'emphasis', // 使用 emphasis 类型，稍后会被转换为 mark
            children: [{
              type: 'text',
              value: match[1]
            }]
          })

          lastIndex = match.index + match[0].length
        })

        // 添加剩余的普通文本
        if (lastIndex < node.value.length) {
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex)
          })
        }

        // 替换原始节点
        parent.children.splice(index, 1, ...children)
      }
    })
  }
}

// rehype 插件，将 emphasis 转换为 mark（仅用于高亮）
export function rehypeHighlightToMark() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // 如果是 emphasis 节点且没有 strong 属性，转换为 mark
      if (node.tagName === 'em') {
        node.tagName = 'mark'
        node.properties = { className: 'highlight-mark' }
      }
    })
  }
}