# Redmine + MCP タスク管理システム

RedmineとMCP (Model Context Protocol) を組み合わせたタスク管理システムです。
ClaudeからRedmineを直接操作できるようになります。

## 🚀 クイックスタート

### 1. Redmineを起動（デフォルトデータ付き）
```bash
# データをリセットして初期化（推奨）
make reset

# または既存のRedmineを起動
make up
```

### 2. MCP Redmine Serverを設定
```bash
# Redmineの管理画面でAPIキーを取得後
claude mcp add redmine npx @koinunopochi/mcp-redmine \
  -e REDMINE_URL=http://localhost:15350 \
  -e REDMINE_API_KEY=your-api-key-here
```

### 3. Claudeで使用
Claudeで以下のようなコマンドが使用可能になります：
- プロジェクトの作成・管理
- イシュー（チケット）の作成・更新
- ステータスやトラッカーの確認

## 📋 プロジェクト構成

```
タスク管理/
├── docker-compose.yml    # Redmine Docker設定
├── .env                  # 環境変数（要作成）
├── Makefile             # 便利なコマンド集
├── mcp-redmine/         # MCP Redmine Server
│   ├── src/            # TypeScriptソースコード
│   ├── dist/           # ビルド済みファイル
│   └── README.md       # MCP詳細ドキュメント
└── README.md           # このファイル
```

## 🛠️ セットアップ詳細

### 前提条件
- Docker Desktop
- Node.js 16以上
- Claude Desktop App

### 手順

#### 1. リポジトリのクローン
```bash
git clone https://github.com/koinunopochi/task-manager.git
cd task-manager
```

#### 2. 環境変数の設定
```bash
cp .env.example .env
# 必要に応じて.envを編集（通常はデフォルトでOK）
```

#### 3. Redmineの初期化
```bash
# Redmineを起動してデフォルトデータをロード
make reset
```

これにより以下が自動設定されます：
- トラッカー（バグ、機能、サポート）
- ステータス（新規、進行中、解決、却下、終了）
- 優先度（低め、通常、高め、急いで、今すぐ）
- ワークフロー（ステータス遷移）

#### 4. RedmineのAPIキー取得
1. http://localhost:15350 にアクセス
2. ユーザー名: `admin` / パスワード: `admin` でログイン
3. 右上の「個人設定」をクリック
4. 右側の「APIアクセスキー」の「表示」をクリック
5. 表示されたキーをコピー

#### 5. MCP設定
```bash
# 開発版を使用する場合（ローカルのdistを使用）
cd mcp-redmine
npm install
npm run build
cd ..

claude mcp add-json redmine-local '{
  "command": "node",
  "args": ["'$(pwd)'/mcp-redmine/dist/index.js"],
  "env": {
    "REDMINE_URL": "http://localhost:15350",
    "REDMINE_API_KEY": "コピーしたAPIキー"
  }
}'

# または公開版を使用する場合
claude mcp add redmine npx @koinunopochi/mcp-redmine \
  -e REDMINE_URL=http://localhost:15350 \
  -e REDMINE_API_KEY=コピーしたAPIキー
```

## 📚 使用可能なコマンド

### Makeコマンド
```bash
make up       # Redmineを起動
make down     # Redmineを停止
make restart  # Redmineを再起動
make logs     # ログを表示
make ps       # コンテナの状態を表示
make init-db  # デフォルトデータをロード
make reset    # データをリセットして初期化（推奨）
make clean    # データを含めて完全に削除
make help     # ヘルプを表示
```

### Claude内でのRedmine操作
- `redmine_project_list` - プロジェクト一覧
- `redmine_project_create` - プロジェクト作成
- `redmine_issue_list` - イシュー一覧
- `redmine_issue_create` - イシュー作成
- `redmine_issue_update` - イシュー更新
- その他多数（詳細は[mcp-redmine/README.md](mcp-redmine/README.md)参照）

## 🔧 トラブルシューティング

### Redmineにアクセスできない
- Dockerが起動しているか確認
- ポート15350が他のアプリで使用されていないか確認
- `make logs`でエラーを確認

### MCPが動作しない
- APIキーが正しいか確認
- Claude Desktopを再起動
- `claude mcp list`で設定を確認

### ステータスが変更できない
- `make init-db`でデフォルトデータがロードされているか確認
- ワークフローが設定されているか管理画面で確認

## 📝 ライセンス

MIT License

## 🤝 貢献

Issue、Pull Requestは歓迎です！

## 📞 サポート

問題が発生した場合は、[Issues](https://github.com/koinunopochi/task-manager/issues)に報告してください。