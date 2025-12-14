'use client'

import { useState, useEffect } from 'react'

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('')

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

  if (!headings || headings.length === 0) {
    return null
  }

  return (
    <nav
      role="navigation"
      aria-labelledby="toc-heading"
      className="table-of-contents"
    >
      <h3 id="toc-heading" className="sr-only">文章目录</h3>
      <div className="toc-title text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">
        目录
      </div>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
            className={`
              toc-level-${heading.level}
              ${activeId === heading.id ? 'toc-active' : ''}
            `}
          >
            <a
              href={`#${heading.id}`}
              className="toc-link block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-1"
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  })
                  window.history.pushState(null, '', `#${heading.id}`)
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}