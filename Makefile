.PHONY: up down restart logs ps clean init-db reset

# Redmineを起動
up:
	@echo "🚀 Redmineを起動しています..."
	@docker compose up -d
	@echo "⏳ 起動完了を待っています..."
	@sleep 15
	@echo "✅ Redmineが起動しました！"
	@echo ""
	@echo "🌐 アクセスURL: http://localhost:15350"
	@echo ""
	@echo "📝 初期ログイン情報:"
	@echo "   ユーザー名: admin"
	@echo "   パスワード: admin"
	@echo ""
	@echo "⚠️  初回ログイン後は必ずパスワードを変更してください"

# Redmineを停止
down:
	@echo "🛑 Redmineを停止しています..."
	@docker compose down
	@echo "✅ Redmineを停止しました"

# Redmineを再起動
restart:
	@echo "🔄 Redmineを再起動しています..."
	@docker compose restart
	@echo "✅ Redmineを再起動しました"
	@echo ""
	@echo "🌐 アクセスURL: http://localhost:15350"

# ログを表示
logs:
	@docker compose logs -f

# コンテナの状態を表示
ps:
	@docker compose ps

# データを含めて完全に削除
clean:
	@echo "⚠️  警告: すべてのデータが削除されます！"
	@echo "5秒後に実行します... (Ctrl+Cでキャンセル)"
	@sleep 5
	@echo "🧹 Redmineを完全に削除しています..."
	@docker compose down -v
	@echo "✅ Redmineを完全に削除しました"

# デフォルトデータをロード
init-db:
	@echo "📊 Redmineにデフォルトデータをロードしています..."
	@docker compose exec redmine bundle exec rake redmine:load_default_data RAILS_ENV=production REDMINE_LANG=ja
	@echo "✅ デフォルトデータのロードが完了しました！"
	@echo ""
	@echo "📝 ロードされた内容:"
	@echo "  - トラッカー: バグ、機能、サポート"
	@echo "  - ステータス: 新規、進行中、解決、却下、終了"
	@echo "  - 優先度: 低、通常、高、緊急、今すぐ"
	@echo "  - ワークフロー: デフォルト設定"

# データをリセットして初期化
reset:
	@echo "🔄 Redmineをリセットして初期化します..."
	@$(MAKE) clean
	@echo ""
	@$(MAKE) up
	@echo ""
	@echo "⏳ データベースの準備を待っています..."
	@sleep 20
	@$(MAKE) init-db
	@echo ""
	@echo "✨ Redmineの初期化が完了しました！"

# ヘルプ
help:
	@echo "📚 使用可能なコマンド:"
	@echo "  make up      - Redmineを起動"
	@echo "  make down    - Redmineを停止"
	@echo "  make restart - Redmineを再起動"
	@echo "  make logs    - ログを表示"
	@echo "  make ps      - コンテナの状態を表示"
	@echo "  make init-db - デフォルトデータをロード"
	@echo "  make reset   - データをリセットして初期化"
	@echo "  make clean   - データを含めて完全に削除"
	@echo "  make help    - このヘルプを表示"