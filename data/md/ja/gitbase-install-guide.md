# GitBaseのインストールとデプロイ：ステップバイステップガイド

このガイドでは、ローカルマシンにGitBaseをセットアップし、Vercelにデプロイするプロセスを順を追って説明します。Web開発に不慣れな方でも、これらの手順に従ってGitBaseインスタンスを立ち上げ実行できるはずです。

## 前提条件

- Node.js（バージョン14以降）
- npm（通常Node.jsに付属）
- Git
- GitHubアカウント
- Vercelアカウント

## ステップ1：リポジトリのクローン

1. ターミナルまたはコマンドプロンプトを開きます。
2. プロジェクトを保存したいディレクトリに移動します。
3. 次のコマンドを実行します：

```bash
git clone https://github.com/qiayue/gitbase.git
cd gitbase
```

## ステップ2：依存関係のインストール

プロジェクトディレクトリで、次のコマンドを実行します：

```bash
npm install
```

これにより、プロジェクトに必要なすべての依存関係がインストールされます。

## ステップ3：環境変数の設定

1. プロジェクトのルートに`.env.local`という名前のファイルを作成します。
2. このファイルを開き、次の行を追加します：

```
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
ACCESS_PASSWORD=your_secure_access_password
```

プレースホルダーを実際のGitHub情報と希望するアクセスパスワードに置き換えます。

## ステップ4：GitHubリポジトリの設定

1. まだ作成していない場合は、GitHubに新しいリポジトリを作成します。
2. GitHubリポジトリで、2つのフォルダを作成します：`data/json`と`data/md`
3. `data/json`フォルダに、空の配列で`resources.json`という名前のファイルを作成します：`[]`

## ステップ5：開発サーバーの実行

開発サーバーを起動するには、次のコマンドを実行します：

```bash
npm run dev
```

ブラウザで`http://localhost:3000`を開きます。GitBaseのホームページが表示されるはずです。

## ステップ6：プロジェクトのビルド

開発サーバーがエラーなく実行される場合、プロジェクトのビルドを試みます：

```bash
npm run build
```

これが正常に完了すれば、プロジェクトはデプロイの準備ができています。

## ステップ7：Vercelへのデプロイ

1. Vercelアカウントにログインします。
2. 「New Project」をクリックします。
3. GitHubからGitBaseリポジトリをインポートします。
4. 「Configure Project」ステップで、次の環境変数を追加します：
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `ACCESS_PASSWORD`
   `.env.local`ファイルと同じ値を使用します。
5. 「Deploy」をクリックします。

## ステップ8：デプロイのテスト

デプロイが完了すると、VercelがURLを提供します。このURLをブラウザで開いて、GitBaseインスタンスが正しく動作していることを確認します。

## ステップ9：カスタムドメインの設定（オプション）

独自のドメインを使用したい場合：

1. Vercelプロジェクトダッシュボードで、「Settings」>「Domains」に移動します。
2. カスタムドメインを追加し、DNS設定についてはVercelの指示に従います。

## GitBaseの使用

- 管理パネルにアクセスするには、`/admin`に移動し、設定した`ACCESS_PASSWORD`を使用します。
- 管理インターフェースを通じて、記事やリソースを作成、編集、管理できるようになります。
- すべての変更は自動的にGitHubリポジトリと同期されます。

## トラブルシューティング

問題が発生した場合：
- ローカルとVercelの両方で、すべての環境変数が正しく設定されていることを確認します。
- ブラウザのコンソールとVercelデプロイログでエラーメッセージを確認します。
- GitHubトークンに必要な権限（repoスコープ）があることを確認します。

おめでとうございます！これで独自のGitBaseインスタンスのセットアップとデプロイが正常に完了しました。新しいデータベース不要、GitHub駆動のウェブサイトをお楽しみください！

その他のヘルプについては、[GitBaseドキュメント](https://github.com/qiayue/gitbase)を参照するか、GitHubリポジトリでissueを開いてください。