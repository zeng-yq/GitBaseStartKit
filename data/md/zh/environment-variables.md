# GitBase 环境变量配置

GitBase 依赖于几个关键的环境变量来实现安全的 GitHub 集成、身份验证和管理员访问。本指南将解释每个变量的用途，并提供正确配置的分步说明。

环境变量在 GitBase 项目的设置和安全中扮演着至关重要的角色。本指南将引导您了解每个变量，解释其目的以及如何正确设置。

## GITHUB_TOKEN

**用途**：此令牌允许 GitBase 与您的 GitHub 仓库交互，使其能够读取和写入内容。

**获取方法**：
1. 访问 GitHub 并登录您的账户。
2. 点击右上角的个人资料图片，选择"Settings"。
3. 在左侧边栏中，点击"Developer settings"。
4. 选择"Personal access tokens"，然后选择"Tokens (classic)"。
5. 点击"Generate new token"并选择"Generate new token (classic)"。
6. 为您的令牌起一个描述性的名称，并选择以下作用域：
   - repo（完全控制私有仓库）
7. 点击页面底部的"Generate token"。
8. 立即复制生成的令牌 - 您将无法再次看到它！

**要求**：必须是具有正确权限的有效 GitHub 个人访问令牌。

## GITHUB_OWNER

**用途**：这是拥有将存储内容的 GitHub 仓库的用户名或组织名称。

**获取方法**：这只是您的 GitHub 用户名或 GitHub 组织名称。

**要求**：必须与您正在使用的仓库的所有者完全匹配。

## GITHUB_REPO

**用途**：这是将存储内容的 GitHub 仓库的名称。

**获取方法**：这是您为 GitBase 内容创建的仓库的名称。

**要求**：必须与仓库名称完全匹配，不包括所有者（例如，"my-gitbase-content"，而不是"username/my-gitbase-content"）。

## JWT_SECRET

**用途**：此密钥用于为 GitBase 应用程序中的身份验证的 JSON Web 令牌（JWT）签名。

**获取方法**：您应该为此生成一个随机的安全字符串。您可以使用密码生成器或在终端中运行此命令：
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**要求**：应该是一个长的随机字符串。出于安全考虑，建议至少 32 个字符。

## DOMAIN

**用途**：这指定了您的 GitBase 实例运行的域。用于安全目的以防止未经授权的访问。

**获取方法**：这应该是您托管 GitBase 实例的域。对于本地开发，您可以使用"localhost"。

**要求**：应该是有效的域名。对于生产环境，这将是您的实际域名（例如，"mygitbase.com"）。对于本地开发，使用"localhost"。

## ACCESS_PASSWORD

**用途**：此密码用于访问您的 GitBase 实例的管理界面。

**获取方法**：您应该为此创建一个强且唯一的密码。

**要求**：应该是强密码。建议使用大写和小写字母、数字和特殊字符的组合。目标至少 12 个字符。

## 设置环境变量

1. 在您的 GitBase 项目根目录中，创建一个名为 `.env.local` 的文件。
2. 将变量以以下格式添加到此文件中：

```
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username_or_org
GITHUB_REPO=your_repo_name
JWT_SECRET=your_generated_jwt_secret
DOMAIN=your_domain_or_localhost
ACCESS_PASSWORD=your_strong_password
```

3. 保存文件。

请记住，切勿将 `.env.local` 文件提交到版本控制。它已包含在 GitBase 的 `.gitignore` 文件中，但请务必再次检查以确保您不会意外泄露敏感信息。

对于生产环境部署（例如，在 Vercel 上），您需要在托管平台的设置中添加这些环境变量。

通过正确配置这些环境变量，您可以确保您的 GitBase 实例能够安全地与 GitHub 交互、验证用户身份并保护您的管理界面。