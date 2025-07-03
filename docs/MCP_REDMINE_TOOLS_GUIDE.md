# MCP Redmine ツールガイド

このドキュメントでは、MCP Redmineで利用可能なツールとその使用方法について説明します。

## 🛠️ 利用可能なツール一覧

MCP Redmineは、以下の3つのカテゴリに分かれた15のツールを提供しています：

### 📁 プロジェクト管理ツール
1. **redmine_project_list** - プロジェクト一覧の取得
2. **redmine_project_get** - 特定プロジェクトの詳細取得
3. **redmine_project_create** - 新規プロジェクトの作成
4. **redmine_project_update** - プロジェクト情報の更新
5. **redmine_project_delete** - プロジェクトの削除

### 📝 チケット（Issue）管理ツール
6. **redmine_issue_list** - チケット一覧の取得（フィルタリング可能）
7. **redmine_issue_get** - 特定チケットの詳細取得
8. **redmine_issue_create** - 新規チケットの作成
9. **redmine_issue_update** - チケット情報の更新
10. **redmine_issue_delete** - チケットの削除

### 📊 メタデータ取得ツール
11. **redmine_tracker_list** - トラッカー一覧の取得
12. **redmine_status_list** - ステータス一覧の取得
13. **redmine_priority_list** - 優先度一覧の取得
14. **redmine_user_list** - ユーザー一覧の取得
15. **redmine_current_user** - 現在のユーザー情報の取得

## 📋 各ツールの詳細

### プロジェクト管理

#### 1. redmine_project_list
**説明**: Redmineに登録されているすべてのプロジェクトを一覧表示します。

**パラメータ**:
- `limit` (optional): 取得するプロジェクト数の上限（デフォルト: 100）

**使用例**:
```
redmine_project_list を使用してください
```

**レスポンス例**:
```
Found 3 projects:

• My Project (my-project) - ID: 1
  This is a sample project

• Test Project (test-project) - ID: 2
  Testing environment

• Development (dev) - ID: 3
```

#### 2. redmine_project_get
**説明**: 特定のプロジェクトの詳細情報を取得します。

**パラメータ**:
- `id` (required): プロジェクトIDまたは識別子

**使用例**:
```
redmine_project_get を使用してください:
- id: "my-project"
```

**レスポンス例**:
```
Project Details:
• Name: My Project
• Identifier: my-project
• ID: 1
• Description: This is a sample project
• Public: Yes
• Status: Active
• Created: 2024-01-01 10:00:00
• Updated: 2024-01-15 14:30:00
```

#### 3. redmine_project_create
**説明**: 新しいプロジェクトを作成します。

**パラメータ**:
- `name` (required): プロジェクト名
- `identifier` (required): プロジェクト識別子（英数字とハイフンのみ）
- `description` (optional): プロジェクトの説明
- `is_public` (optional): 公開プロジェクトかどうか（デフォルト: true）

**使用例**:
```
redmine_project_create を使用してください:
- name: "新規開発プロジェクト"
- identifier: "new-dev-project"
- description: "2024年の新規開発プロジェクト"
- is_public: true
```

### チケット管理

#### 6. redmine_issue_list
**説明**: チケットの一覧を取得します。様々なフィルタリングオプションが利用可能です。

**パラメータ**:
- `project_id` (optional): プロジェクトIDでフィルタ
- `status_id` (optional): ステータスIDでフィルタ（"open"で未完了のみ）
- `assigned_to_id` (optional): 担当者IDでフィルタ
- `limit` (optional): 取得件数の上限（デフォルト: 25）
- `offset` (optional): 取得開始位置

**使用例**:
```
redmine_issue_list を使用してください:
- project_id: 1
- status_id: "open"
- limit: 10
```

#### 8. redmine_issue_create
**説明**: 新しいチケットを作成します。

**パラメータ**:
- `project_id` (required): プロジェクトID
- `subject` (required): チケットのタイトル
- `description` (optional): チケットの詳細説明
- `priority_id` (optional): 優先度ID
- `tracker_id` (optional): トラッカーID
- `assigned_to_id` (optional): 担当者ID
- `status_id` (optional): ステータスID
- `start_date` (optional): 開始日（YYYY-MM-DD形式）
- `due_date` (optional): 期限日（YYYY-MM-DD形式）
- `estimated_hours` (optional): 予定工数

**使用例**:
```
redmine_issue_create を使用してください:
- project_id: 1
- subject: "ログイン機能のバグ修正"
- description: "特殊文字を含むパスワードでログインできない問題"
- priority_id: 2
- tracker_id: 1
```

### メタデータ取得

#### 11. redmine_tracker_list
**説明**: 利用可能なトラッカー（バグ、機能、タスクなど）の一覧を取得します。

**使用例**:
```
redmine_tracker_list を使用してください
```

**レスポンス例**:
```
Available trackers:
• Bug (ID: 1)
• Feature (ID: 2)
• Support (ID: 3)
```

#### 15. redmine_current_user
**説明**: 現在のAPIキーに紐づくユーザー情報を取得します。接続テストにも使用できます。

**使用例**:
```
redmine_current_user を使用してください
```

## 🚨 注意事項と既知の問題

### 初期設定が必要な項目
新規Redmineインスタンスでは、以下の設定を事前に行う必要があります：

1. **トラッカーの設定**: 管理画面でバグ、機能、タスクなどを作成
2. **優先度の設定**: 低、中、高、緊急などを設定
3. **ステータスの設定**: 新規、進行中、完了などを設定
4. **ワークフローの設定**: ステータス遷移ルールを定義

これらが未設定の場合、チケット作成時に422エラーが発生します。

### エラー対処法
- **422エラー**: 必須フィールドが不足している、または無効な値が指定されている
- **404エラー**: 指定したIDのリソースが存在しない
- **401エラー**: APIキーが無効または権限不足

## 💡 活用のヒント

1. **プロジェクト作成前の確認**: `redmine_project_list`で既存プロジェクトを確認
2. **チケット作成前の準備**: 
   - `redmine_tracker_list`でトラッカーIDを確認
   - `redmine_priority_list`で優先度IDを確認
   - `redmine_status_list`でステータスIDを確認
3. **担当者の割り当て**: `redmine_user_list`でユーザーIDを確認してから割り当て

## 🔗 関連リソース

- [Redmine公式ドキュメント](https://www.redmine.org/guide)
- [Redmine REST API](https://www.redmine.org/projects/redmine/wiki/Rest_api)
- [MCP Redmine GitHub](https://github.com/koinunopochi/task-manager)