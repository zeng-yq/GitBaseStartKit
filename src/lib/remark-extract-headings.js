import { visit } from 'unist-util-visit'

// SEO 友好的 ID 生成函数
function generateSlug(text) {
  // 支持中文、英文、数字
  return text
    .toString()
    .toLowerCase()
    .trim()
    // 移除特殊字符，保留中文、英文、数字、空格和连字符
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s-]/g, '')
    // 将空格替换为连字符
    .replace(/\s+/g, '-')
    // 移除多余的连字符
    .replace(/-+/g, '-')
    // 移除首尾的连字符
    .replace(/^-+|-+$/g, '')
}

export function remarkExtractHeadings() {
  return (tree, file) => {
    const headings = []
    let h1Count = 0

    // 在 remark 阶段，标题是 'heading' 类型的节点
    visit(tree, 'heading', (node, index, parent) => {
      // 提取纯文本
      const text = node.children
        .filter(child => child.type === 'text')
        .map(child => child.value)
        .join('')
        .trim()

      if (!text) return

      const level = node.depth

      // 生成唯一 ID
      let id = generateSlug(text)

      // 处理重复 ID
      const existingIds = headings.map(h => h.id)
      if (existingIds.includes(id)) {
        let counter = 1
        let newId = `${id}-${counter}`
        while (existingIds.includes(newId)) {
          counter++
          newId = `${id}-${counter}`
        }
        id = newId
      }

      // 为标题添加 ID 属性
      node.data = node.data || {}
      node.data.hProperties = node.data.hProperties || {}
      node.data.hProperties.id = id
      node.data.hProperties['data-toc-level'] = level

      // 统计 H1 数量（用于 SEO 建议）
      if (level === 1) h1Count++

      headings.push({
        id,
        level,
        text,
        // 为 SEO 添加额外信息
        wordCount: text.split(/\s+/).length,
        hasAnchor: true
      })
    })

    // 存储标题数据和建议
    file.data.headings = headings
    file.data.seoSuggestions = {
      h1Count,
      hasMultipleH1: h1Count > 1,
      headingCount: headings.length,
      maxHeadingLevel: Math.max(...headings.map(h => h.level), 0)
    }
  }
}