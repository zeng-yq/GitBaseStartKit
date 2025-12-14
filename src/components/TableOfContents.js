'use client'

import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('')
  const [collapsedItems, setCollapsedItems] = useState(() => {
    // 初始化时，将所有 H1 和 H2 标题添加到折叠列表中，这样它们会默认展开
    const initialCollapsed = new Set()
    headings.forEach((heading, index) => {
      // 只将有子级的 H1 和 H2 标题加入折叠列表
      if (heading.level <= 2 && index < headings.length - 1) {
        if (headings[index + 1].level > heading.level) {
          initialCollapsed.add(heading.id)
        }
      }
    })
    return initialCollapsed
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        threshold: [0.1, 0.5], // 使用多个阈值提升准确性
        rootMargin: '-20% 0px -70% 0px' // 更精确地判断当前章节
      }
    )

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  // 当活跃状态改变时，自动展开包含活跃项的折叠父级
  useEffect(() => {
    if (!activeId) return

    const activeIndex = headings.findIndex(h => h.id === activeId)
    if (activeIndex === -1) return

    // 找到活跃项的所有父级
    const parentIds = new Set()
    for (let i = activeIndex - 1; i >= 0; i--) {
      const currentHeading = headings[i]
      const nextHeading = headings[i + 1]

      // 如果下一项层级比当前项大，说明当前项是父级
      if (nextHeading && nextHeading.level > currentHeading.level) {
        // 检查这个父级是否包含活跃项
        let isActiveInThisGroup = false
        for (let j = i + 1; j < headings.length; j++) {
          if (headings[j].level <= currentHeading.level) break
          if (headings[j].id === activeId) {
            isActiveInThisGroup = true
            break
          }
        }
        if (isActiveInThisGroup) {
          parentIds.add(currentHeading.id)
        }
      }
    }

    // 展开所有包含活跃项的父级
    setCollapsedItems(prev => {
      const newSet = new Set(prev)
      parentIds.forEach(id => newSet.delete(id))
      return newSet
    })
  }, [activeId, headings])

  // 检查是否有子级
  const hasChildren = (heading, index) => {
    if (index === headings.length - 1) return false
    return headings[index + 1].level > heading.level
  }


  // 切换折叠状态
  const toggleCollapse = (headingId) => {
    setCollapsedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(headingId)) {
        newSet.delete(headingId)
      } else {
        newSet.add(headingId)
      }
      return newSet
    })
  }

  // 检查是否应该隐藏该项目
  const shouldHide = (heading, index) => {
    // 找到父级
    let parentIndex = -1
    for (let i = index - 1; i >= 0; i--) {
      if (headings[i].level < heading.level) {
        parentIndex = i
        break
      }
    }

    if (parentIndex >= 0) {
      const parent = headings[parentIndex]
      return collapsedItems.has(parent.id)
    }

    return false
  }

  if (!headings || headings.length === 0) {
    return null
  }

  return (
    <nav
      role="navigation"
      aria-label="文章目录"
      className="table-of-contents"
    >
      <ul className="space-y-1">
        {headings.map((heading, index) => {
          const hasChild = hasChildren(heading, index)
          const isCollapsed = collapsedItems.has(heading.id)
          const hide = shouldHide(heading, index)

          if (hide) return null

          return (
            <li
              key={heading.id}
              className={`
                toc-level-${heading.level}
                ${activeId === heading.id ? 'toc-active' : ''}
              `}
            >
              <div className="flex items-center">
                <div className="w-8 h-5 flex items-center justify-center">
                  {hasChild && (
                    <button
                      onClick={() => toggleCollapse(heading.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
                      aria-label={isCollapsed ? '展开' : '折叠'}
                      aria-expanded={!isCollapsed}
                    >
                      <ChevronRight
                        className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
                          !isCollapsed ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
                <a
                  href={`#${heading.id}`}
                  className="toc-link block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-1 flex-1"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(heading.id)
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      })
                      window.history.pushState(null, '', `#${heading.id}`)
                      // 移除焦点以避免 hover 和 active 状态叠加
                      e.currentTarget.blur()
                    }
                  }}
                >
                  {heading.text}
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}