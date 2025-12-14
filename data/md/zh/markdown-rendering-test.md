# Markdown 渲染测试

这是一个测试文章，用于验证 Markdown 渲染优化效果。

## 行内代码测试

以下是一些行内代码的例子：

- 使用 `const a = 1` 定义变量
- 使用 `npm install` 安装包
- 使用 `console.log()` 输出信息

这些代码块不应该显示前后反引号，而是应该有灰色背景。

## 高亮文本测试

以下是使用 ==高亮语法== 的例子：

- 这是 ==重要内容== 的高亮效果
- 使用 ==黄色背景== 来强调文本
- 在深色模式下应该显示为 ==暗黄色背景==

## 混合使用测试

这是 ==高亮文本== 和 `行内代码` 混合使用的例子。

## 代码块测试

### JavaScript 代码

```javascript
function greetUser(name) {
  const greeting = `Hello, ${name}!`;
  console.log(greeting);
  return greeting;
}

// 调用函数
const message = greetUser('World');
```

### Python 代码

```python
def fibonacci(n):
    """计算斐波那契数列的第n项"""
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# 计算前10项
for i in range(10):
    print(fibonacci(i))
```

### CSS 代码

```css
.highlight-mark {
  background-color: #fef08a;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.dark .highlight-mark {
  background-color: rgba(234, 179, 8, 0.5);
}
```

## 普通文本作为对比

这段文字是普通的文本，没有任何特殊样式。