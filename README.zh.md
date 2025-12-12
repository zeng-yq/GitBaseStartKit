# GitBase

[GitBase](https://gitbase.app/) 是一个无需传统数据库的开源动态网站解决方案，使用 Next.js、Tailwind CSS 和 Shadcn/UI 构建。它利用 GitHub 作为内容管理系统，提供了一种无缝创建和管理网站内容的方式。

![GitBase](https://toimg.xyz/file/5aa892c8e8385232fcdf3.png)

## 在 Vercel 上部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fqiayue%2Fgitbase&project-name=GitBase&repository-name=GitBase&external-id=https%3A%2F%2Fgithub.com%2Fqiayue%2Fgitbase%2Ftree%2Fmain)

## 功能特性

- **无数据库架构**：利用 GitHub 进行内容存储和管理
- **动态内容**：使用 Next.js 服务端渲染动态渲染内容
- **Markdown 支持**：使用 Markdown 格式编写内容，便于编辑和版本控制
- **管理界面**：内置管理面板进行内容管理
- **多语言支持**：内置国际化支持，支持子目录路由（en、zh、ja）
- **智能语言检测**：自动检测浏览器语言并提供非侵入式建议
- **分类系统**：使用可视化分类徽章组织文章和资源
- **响应式设计**：使用 Tailwind CSS 实现完全响应式设计
- **SEO 友好**：通过动态元数据优化搜索引擎
- **易于部署**：简单的 Vercel 部署流程

## 前置要求

- Node.js（14 版本或更高）
- npm（随 Node.js 一起安装）
- Git
- GitHub 账号
- Vercel 账号（用于部署）

## 安装

1. 克隆仓库：
   ```
   git clone https://github.com/qiayue/gitbase.git
   cd gitbase
   ```

2. 安装依赖：
   ```
   npm install
   ```

3. 在根目录创建 `.env.local` 文件并添加以下内容：
   ```
   GITHUB_TOKEN=你的github个人访问令牌
   GITHUB_OWNER=你的github用户名
   GITHUB_REPO=你的仓库名称
   JWT_SECRET=你的jwt密钥
   DOMAIN=localhost
   ACCESS_USERNAME=你的管理员用户名
   ACCESS_PASSWORD=你的安全访问密码
   ```

4. 设置你的 GitHub 仓库：
   - 在 GitHub 上创建一个新仓库
   - 在仓库中创建两个文件夹：`data/json` 和 `data/md`
   - 在 `data/json` 中，创建一个名为 `resources.json` 的文件，内容为空数组：`[]`

5. 运行开发服务器：
   ```
   npm run dev
   ```

访问 `http://localhost:3000` 即可看到本地运行的 GitBase 实例。

## 部署

1. 将代码推送到 GitHub。
2. 登录 Vercel 并从 GitHub 仓库创建新项目。
3. 在 Vercel 中配置环境变量：
   - `GITHUB_TOKEN` - 你的 GitHub 个人访问令牌
   - `GITHUB_OWNER` - 你的 GitHub 用户名
   - `GITHUB_REPO` - 你的仓库名称
   - `JWT_SECRET` - 一个安全的随机字符串（至少 32 个字符）
   - `DOMAIN` - 你的生产域名（例如：yourdomain.com）
   - `ACCESS_USERNAME` - 登录的管理员用户名
   - `ACCESS_PASSWORD` - 登录的管理员密码
4. 部署项目。

详细的部署指南，请参考我们的[安装和部署指南](https://gitbase.app/posts/gitbase-install-guide)。

## 使用方法

- 访问 `/login` 并输入你的 `ACCESS_USERNAME` 和 `ACCESS_PASSWORD` 进入管理面板
- 通过 `/admin` 的管理界面创建和编辑文章
- 在管理面板中管理资源
- 所有更改会自动与 GitHub 仓库同步
- 出于安全考虑，管理员会话在 1 小时后过期


## 贡献

我们欢迎对 GitBase 的贡献！请阅读我们的[贡献指南](https://gitbase.app/posts/how-to-contributing-to-gitbase)了解我们的行为准则和提交拉取请求的流程。

## 许可证

GitBase 是根据 [MIT 许可证](https://github.com/qiayue/gitbase/?tab=MIT-1-ov-file)授权的开源软件。

## 支持

如果你遇到任何问题或有疑问，请在 GitHub 仓库上提交 issue。

## 致谢

GitBase 使用以下开源库构建：
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

我们感谢这些项目的维护者和贡献者。
