# Image to Food

食材の写真から認識して、作れる料理やレシピを提案するWebアプリケーション

## 📖 プロジェクト概要

Image to Foodは、AIを活用した料理提案Webアプリケーションです。スマートフォンやPCのカメラで食材を撮影するだけで、YOLOベースの物体検出技術により自動的に食材を認識し、冷蔵庫にある材料で作れる料理を提案します。

### 主な目的

- 冷蔵庫の食材を無駄なく活用
- 献立作りの時間を短縮
- 料理のアイデア発見をサポート
- 食材管理の簡素化

## ✨ 主な機能

- **リアルタイムカメラ検出**: スマホ・PCのカメラから直接撮影して食材を認識
- **AIによる食材認識**: YOLO（You Only Look Once）を使用した高精度な物体検出
- **レスポンシブデザイン**: モバイルデバイスとデスクトップの両方に対応
- **ダークモード対応**: 目に優しいダークテーマを採用

## 🚀 セットアップ手順

### 必要な環境

- Python 3.8以上
- pip（Pythonパッケージマネージャー）
- Webカメラが使用可能なブラウザ（Chrome、Firefox、Safari等）

### インストール

1. リポジトリをクローン:
```bash
git clone https://github.com/macrosoft3/image-to-food.git
cd image-to-food
```

2. 仮想環境を作成（推奨）:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. 依存パッケージをインストール:
```bash
pip install -r requirements.txt
```

4. データベースをマイグレート:
```bash
python manage.py migrate
```

5. 開発サーバーを起動:
```bash
python manage.py runserver
```

6. ブラウザで http://127.0.0.1:8000/yolo/ にアクセス

## 💡 使い方

1. アプリケーションを開くと、カメラの使用許可を求められます
2. 許可すると、リアルタイムのカメラ映像が表示されます
3. 「📸 今すぐ試してみる」ボタンをクリックして食材を撮影
4. AIが食材を認識し、検出結果が表示されます
5. 認識された食材から作れる料理の提案を確認できます

## 🛠 技術スタック

- **バックエンド**: Django 4.2
- **AI/ML**: Ultralytics YOLO
- **フロントエンド**: 
  - Bootstrap 5.3
  - Vanilla JavaScript
  - HTML5 Camera API
- **データベース**: SQLite（開発環境）

## 📁 プロジェクト構造

```
image-to-food/
├── image_to_food/        # Djangoプロジェクト設定
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── yolo/                 # YOLOアプリケーション
│   ├── static/          # 静的ファイル（CSS、JS）
│   ├── templates/       # HTMLテンプレート
│   ├── views.py         # ビュー関数
│   └── urls.py          # URLルーティング
├── manage.py            # Django管理コマンド
├── requirements.txt     # 依存パッケージ一覧
└── README.md           # このファイル
```

## 📝 ライセンス

このプロジェクトのライセンスは未指定です。使用する際は作者に確認してください。

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！以下の手順でコントリビュートできます：

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### コントリビューションガイドライン

- コードスタイル: PEP 8に準拠
- コミットメッセージ: 明確で簡潔な説明を記載
- テスト: 新機能には適切なテストを追加
- ドキュメント: 変更内容に応じてREADMEを更新

## 👤 作者

**So Masuda**

- Twitter: [@KzKfOLgXRe75042](https://x.com/KzKfOLgXRe75042)
- GitHub: [macrosoft3](https://github.com/macrosoft3)

## 🙏 謝辞

- [Ultralytics](https://github.com/ultralytics/ultralytics) - YOLO実装
- [Django](https://www.djangoproject.com/) - Webフレームワーク
- [Bootstrap](https://getbootstrap.com/) - UIフレームワーク

## 📮 お問い合わせ

質問や提案がある場合は、[GitHub Issues](https://github.com/macrosoft3/image-to-food/issues)で報告してください。
