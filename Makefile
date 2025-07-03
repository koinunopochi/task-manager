.PHONY: up down restart logs ps clean

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

# ヘルプ
help:
	@echo "📚 使用可能なコマンド:"
	@echo "  make up      - Redmineを起動"
	@echo "  make down    - Redmineを停止"
	@echo "  make restart - Redmineを再起動"
	@echo "  make logs    - ログを表示"
	@echo "  make ps      - コンテナの状態を表示"
	@echo "  make clean   - データを含めて完全に削除"
	@echo "  make help    - このヘルプを表示"