# StartKit

[StartKit](https://gitbase.app/) 是一个开源的动态网站解决方案，无需传统数据库，采用 Next.js、Tailwind CSS 和 Shadcn/UI 构建。它利用 GitHub 作为内容管理系统，为创建和管理网站内容提供了无缝的方式。

![StartKit](https://toimg.xyz/file/5aa892c8e8385232fcdf3.png)


## 在 Vercel 上部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fqiayue%2Fgitbase&project-name=GitBase&repository-name=GitBase&external-id=https%3A%2F%2Fgithub.com%2Fqiayue%2Fgitbase%2Ftree%2Fmain)


## 功能特性

- **无数据库架构**：利用 GitHub 进行内容存储和管理。
- **动态内容**：使用 Next.js 服务端渲染动态呈现内容。
- **Markdown 支持**：以 Markdown 格式编写内容，便于编辑和版本控制。
- **管理界面**：内置内容管理面板。
- **多语言支持**：内置国际化支持，采用子目录路由（en、zh、ja）。
- **智能语言检测**：自动浏览器语言检测，提供非侵入式建议。
- **分类系统**：通过可视化分类标签组织文章和资源。
- **响应式设计**：使用 Tailwind CSS 实现完全响应式设计。
- **SEO 友好**：针对搜索引擎优化，具有动态元数据。
- **简易部署**：简化到 Vercel 的部署流程。

## 前提条件

- Node.js（版本 14 或更高）
- npm（随 Node.js 一起提供）
- Git
- GitHub 账户
- Vercel 账户（用于部署）

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

3. 在根目录下创建一个 `.env.local` 文件，并添加以下内容：
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repo_name
   JWT_SECRET=your_jwt_secret_key
   DOMAIN=localhost
   ACCESS_USERNAME=your_admin_username
   ACCESS_PASSWORD=your_secure_access_password
   ```

4. 设置 GitHub 仓库：
   - 在 GitHub 上创建一个新仓库
   - 在仓库中创建两个文件夹：`data/json` 和 `data/md`
   - 在 `data/json` 中创建一个名为 `resources.json` 的文件，内容为空数组：`[]`

5. 运行开发服务器：
   ```
   npm run dev
   ```

访问 `http://localhost:3000` 查看本地运行的 GitBase 实例。

## 部署

1. 将代码推送到 GitHub。
2. 登录 Vercel 并从 GitHub 仓库创建一个新项目。
3. 在 Vercel 中配置环境变量：
   - `GITHUB_TOKEN` - GitHub 个人访问令牌
   - `GITHUB_OWNER` - GitHub 用户名
   - `GITHUB_REPO` - 仓库名称
   - `JWT_SECRET` - 安全随机字符串（至少 32 个字符）
   - `DOMAIN` - 生产域名（例如，yourdomain.com）
   - `ACCESS_USERNAME` - 登录的管理员用户名
   - `ACCESS_PASSWORD` - 登录的管理员密码
4. 部署项目。

有关详细部署指南，请参阅我们的[安装和部署指南](https://gitbase.app/posts/gitbase-install-guide)。

## 使用

- 通过导航到 `/login` 并输入 `ACCESS_USERNAME` 和 `ACCESS_PASSWORD` 访问管理面板。
- 通过管理界面在 `/admin` 创建和编辑文章。
- 在管理面板中管理资源。
- 所有更改都会自动与 GitHub 仓库同步。
- 管理员会话在 1 小时后过期以确保安全。


## 贡献

我们欢迎对 GitBase 的贡献！请阅读我们的[贡献指南](https://gitbase.app/posts/how-to-contributing-to-gitbase)以了解我们的行为准则和提交拉取请求的过程。

## 许可证

GitBase 是开源软件，使用 [MIT 许可证](https://github.com/qiayue/gitbase/?tab=MIT-1-ov-file) 许可。

## 支持

如果您遇到任何问题或有疑问，请在 GitHub 仓库中提交问题。

## 致谢

GitBase 使用以下开源库构建：
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

我们感谢这些项目的维护者和贡献者。
