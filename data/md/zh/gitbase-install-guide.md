# GitBase 安装和部署：分步指南

本指南将引导您完成在本地机器上设置 GitBase 并将其部署到 Vercel 的过程。即使您是 Web 开发的新手，也应该能够按照这些步骤启动并运行您的 GitBase 实例。

## 前提条件

- Node.js（版本 14 或更高）
- npm（通常随 Node.js 一起提供）
- Git
- GitHub 账户
- Vercel 账户

## 步骤 1：克隆仓库

1. 打开您的终端或命令提示符。
2. 导航到您要存储项目的目录。
3. 运行以下命令：

```bash
git clone https://github.com/qiayue/gitbase.git
cd gitbase
```

## 步骤 2：安装依赖

在项目目录中，运行：

```bash
npm install
```

这将安装项目的所有必要依赖。

## 步骤 3：设置环境变量

1. 在项目根目录中，创建一个名为 `.env.local` 的文件。
2. 打开此文件并添加以下行：

```
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
ACCESS_PASSWORD=your_secure_access_password
```

将占位符替换为您的实际 GitHub 信息和所需的访问密码。

## 步骤 4：配置 GitHub 仓库

1. 如果您还没有，请在 GitHub 上创建一个新仓库。
2. 在您的 GitHub 仓库中，创建两个文件夹：`data/json` 和 `data/md`。
3. 在 `data/json` 文件夹中，创建一个名为 `resources.json` 的文件，内容为空数组：`[]`。

## 步骤 5：运行开发服务器

要启动开发服务器，请运行：

```bash
npm run dev
```

在浏览器中打开 `http://localhost:3000`。您应该会看到 GitBase 主页。

## 步骤 6：构建项目

如果开发服务器运行无误，请尝试构建项目：

```bash
npm run build
```

如果成功完成，您的项目就准备好部署了。

## 步骤 7：部署到 Vercel

1. 登录您的 Vercel 账户。
2. 点击"New Project"。
3. 从 GitHub 导入您的 GitBase 仓库。
4. 在"Configure Project"步骤中，添加以下环境变量：
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `ACCESS_PASSWORD`
   使用与 `.env.local` 文件中相同的值。
5. 点击"Deploy"。

## 步骤 8：测试您的部署

部署完成后，Vercel 将为您提供一个 URL。在浏览器中打开此 URL 以验证您的 GitBase 实例是否正常工作。

## 步骤 9：配置自定义域名（可选）

如果您想使用自己的域名：

1. 在 Vercel 项目仪表板中，转到"Settings" > "Domains"。
2. 添加您的自定义域名并按照 Vercel 的说明进行 DNS 配置。

## 使用 GitBase

- 要访问管理面板，请转到 `/admin` 并使用您设置的 `ACCESS_PASSWORD`。
- 您现在可以通过管理界面创建、编辑和管理文章和资源。
- 所有更改将自动与您的 GitHub 仓库同步。

## 故障排除

如果您遇到任何问题：
- 确保所有环境变量在本地和 Vercel 上都正确设置。
- 在浏览器控制台和 Vercel 部署日志中检查任何错误消息。
- 确保您的 GitHub 令牌具有必要的权限（repo 作用域）。

恭喜！您已成功设置并部署了自己的 GitBase 实例。享受您全新的无数据库、GitHub 驱动的网站吧！

如需更多帮助，请参阅 [GitBase 文档](https://github.com/qiayue/gitbase) 或在 GitHub 仓库上创建 issue。