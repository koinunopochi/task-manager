# MCP Redmine Server

Redmine integration for Model Context Protocol (MCP). This server allows Claude and other MCP clients to interact with your Redmine instance.

## Features

### Project Management
- List all projects
- Get project details
- Create new projects
- Update existing projects
- Delete projects

### Issue Management
- List issues (with filtering options)
- Get issue details
- Create new issues
- Update existing issues
- Delete issues

### Metadata
- List trackers
- List issue statuses
- List issue priorities
- List users
- Get current user info

### Wiki Management
- List wiki pages in a project
- Get wiki page content
- Create or update wiki pages
- Delete wiki pages

## Installation

### Quick Start with npx (Recommended)
```bash
npx @koinunopochi/mcp-redmine
```

### Manual Installation
1. Clone this repository
2. Install dependencies:
   ```bash
   cd mcp-redmine
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

### Global Installation
```bash
npm install -g @koinunopochi/mcp-redmine
mcp-redmine
```

## Configuration

The server requires Redmine URL and API key. You can configure these in several ways:

### 1. Environment Variables in MCP Settings (Recommended)
Add environment variables directly in your MCP settings (`mcp.json`):
```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["@koinunopochi/mcp-redmine"],
      "env": {
        "REDMINE_URL": "https://your-redmine-instance.com",
        "REDMINE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 2. System Environment Variables
```bash
export REDMINE_URL="https://your-redmine-instance.com"
export REDMINE_API_KEY="your-api-key-here"
```

### 3. Config File in Home Directory
Create `~/.mcp-redmine.json`:
```json
{
  "url": "https://your-redmine-instance.com",
  "apiKey": "your-api-key-here"
}
```

### 4. Local Config File
Create `.mcp-redmine.json` in the current directory with the same format as above.

## Getting Your Redmine API Key

1. Log in to your Redmine instance
2. Go to "My account" (usually in the top-right menu)
3. Look for "API access key" on the right side
4. Click "Show" to reveal your API key
5. Copy the API key for use in configuration

## Usage with Claude

### Quick Setup (Recommended)
```bash
claude mcp add redmine npx @koinunopochi/mcp-redmine \
  -e REDMINE_URL=http://localhost:3000 \
  -e REDMINE_API_KEY=your-api-key-here
```

### Manual Configuration
Add to your MCP settings file:

```json
{
  "mcpServers": {
    "redmine": {
      "command": "npx",
      "args": ["@koinunopochi/mcp-redmine"],
      "env": {
        "REDMINE_URL": "http://localhost:3000",
        "REDMINE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

### Projects
- `redmine_project_list` - List all projects
- `redmine_project_get` - Get project details
- `redmine_project_create` - Create a new project
- `redmine_project_update` - Update a project
- `redmine_project_delete` - Delete a project

### Issues
- `redmine_issue_list` - List issues with optional filters
- `redmine_issue_get` - Get issue details
- `redmine_issue_create` - Create a new issue
- `redmine_issue_update` - Update an issue
- `redmine_issue_delete` - Delete an issue

### Metadata
- `redmine_tracker_list` - List available trackers
- `redmine_status_list` - List issue statuses
- `redmine_priority_list` - List issue priorities
- `redmine_user_list` - List users
- `redmine_current_user` - Get current user info

### Wiki
- `redmine_wiki_list` - List wiki pages in a project
- `redmine_wiki_get` - Get wiki page content
- `redmine_wiki_create` - Create or update a wiki page
- `redmine_wiki_delete` - Delete a wiki page

## Examples

### Create a Project
```
Use redmine_project_create with:
- name: "My New Project"
- identifier: "my-new-project"
- description: "Project description"
```

### Create an Issue
```
Use redmine_issue_create with:
- project_id: 123
- subject: "Fix bug in login system"
- description: "Users cannot log in with special characters"
- priority_id: 2
```

### List Open Issues in a Project
```
Use redmine_issue_list with:
- project_id: 123
- status_id: "open"
```

### Create a Wiki Page
```
Use redmine_wiki_create with:
- project_id: "my-project"
- page_title: "API Documentation"
- text: "# API Documentation\n\nThis is the content..."
- comments: "Initial creation"
```

## Development

To run in development mode with auto-rebuild:
```bash
npm run dev
```

## Redmine初期設定について

### 🎉 簡単セットアップ（推奨）
プロジェクトのルートディレクトリで以下を実行すれば、Redmineのデフォルトデータが自動的にロードされます：

```bash
make reset
```

これにより以下が自動設定されます：
- トラッカー（バグ、機能、サポート）
- ステータス（新規、進行中、解決、却下、終了）
- 優先度（低め、通常、高め、急いで、今すぐ）
- ワークフロー（ステータス遷移）

### 手動設定が必要な場合
既存のRedmineや`make reset`が使えない環境では、以下の手動設定が必要です：

1. **管理者ログイン**後、「管理」メニューにアクセス

2. **トラッカー設定**
   - 管理 → トラッカー → 「新しいトラッカー」
   - 最低限: バグ、機能、タスクを作成

3. **優先度設定**  
   - 管理 → 列挙項目 → 優先度 → 「新しい項目」
   - 例：低、標準、高、緊急（それぞれにposition値を設定）

4. **ステータス設定**
   - 管理 → 課題のステータス → 「新しいステータス」
   - 例：新規、進行中、解決済み、終了

5. **ワークフロー設定**
   - 管理 → ワークフロー
   - トラッカーとロールの組み合わせでステータス遷移を定義

**確認方法**: `redmine_tracker_list`、`redmine_priority_list`、`redmine_status_list`で利用可能なオプションを確認できます。

## License

MIT