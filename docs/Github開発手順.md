# 🧭 GitHub チーム開発手順書

## ✅ 基本ルール

- `main` ブランチは常に **安定稼働 & デプロイ可能な状態** を保つ
- **すべての開発はプルリク（Pull Request）ベースで行う**
- `main` への直接 push は禁止

---

## 🚀 通常の開発フロー（PRの基本）

### 1. 最新の main を取得

git checkout main
git pull origin main
2. 作業用ブランチを作成
bash
コピーする
編集する
git checkout -b feature/〇〇機能
ブランチ命名ルール例：

機能追加：feature/ログイン画面

バグ修正：fix/バリデ修正

UI調整：style/色調整

リファクタ：refactor/api構成変更

3. 作業・コミット
bash
コピーする
編集する
git add .
git commit -m "ログイン画面のUI作成"
4. GitHubにプッシュ
bash
コピーする
編集する
git push origin feature/ログイン画面
5. GitHub上でPRを作成
ベースブランチ：main

わかりやすいタイトル・説明を記載

他メンバーへレビュー依頼

🔄 mainが更新されていた場合の対応（作業中ブランチに取り込む）
※ PRを出す前 or レビュー中に main が更新されていた場合など

1. 最新の main を取得
bash
コピーする
編集する
git checkout main
git pull origin main
2. 作業ブランチに戻る
bash
コピーする
編集する
git checkout feature/〇〇機能
3. main を取り込む
✅ 方法A：マージ（初心者向け・安全）
bash
コピーする
編集する
git merge main
→ コンフリクトが出たら手動で解決し、以下を実行：

bash
コピーする
編集する
git add .
git commit -m "Merge main into feature/〇〇機能"
✅ 方法B：リベース（履歴がきれい、中級者向け）
bash
コピーする
編集する
git rebase main
→ コンフリクトが出たら解消後に：

bash
コピーする
編集する
git add .
git rebase --continue
※ GitHubに push 済みなら、以下の強制 push が必要：

bash
コピーする
編集する
git push origin feature/〇〇機能 --force
4. GitHubのPRが自動で更新される
変更が取り込まれた状態で再レビューへ

💡補足
.next/, node_modules/, .env などは .gitignore 済み

main は常にデプロイ可能な状態に保つ

コンフリクトが発生したら、ファイルを開いて修正 → git add → 継続の流れ

🧼 よく使うコマンドまとめ
bash
コピーする
編集する
# 現在の状態を確認
git status

# 差分確認（mainとの比較）
git diff main

# mainのログを見る
git log origin/main..HEAD

# ブランチ一覧
git branch

# スタッシュ（一時退避）
git stash
git stash apply
🙌 最後に
わからないことはチーム内でどんどん共有しよう！

Gitの操作に慣れていなくても、この手順を守っていれば安全に開発できます！
