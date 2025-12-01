# Image-to-Food (I2F)

AI搭載の食材認識・レシピ生成Webアプリケーション。カメラまたはアップロードした画像から食材を検出し、AIが自動的にレシピを提案します。

## 概要

Image-to-Foodは、YOLOv8による物体検出とGoogle Gemini AIを組み合わせた革新的なWebアプリケーションです。画像内の食材を自動認識し、検出された材料に基づいてレシピを生成します。

### 主な機能

- **リアルタイムカメラキャプチャ**: Webカメラやスマートフォンのカメラからリアルタイムに画像をキャプチャ
- **画像アップロード**: 保存済みの画像ファイルから食材を検出
- **AI物体検出**: YOLOv8モデルによる高精度な食材認識
- **自動レシピ生成**: Google Gemini AIが検出された食材からレシピを自動生成
- **視覚的フィードバック**: バウンディングボックス付きで検出結果を表示

## 必要要件

- Python 3.8以上
- Webカメラ対応ブラウザ（Chrome、Firefox、Safari等）
- Google AI API キー

## インストール

### 1. リポジトリのクローン

```bash
git clone https://github.com/macrosoft3/image-to-food.git
cd image-to-food
```

### 2. 依存関係のインストール

```bash
pip install -r requirements.txt
```

必要なパッケージ:

- Django
- google-genai
- Pillow
- python-dotenv
- pytorch
- torchvision
- ultralytics

### 3. 環境設定

#### シークレットキーの作成

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" > secret_key.txt
```

#### Google AI APIキーの設定

プロジェクトルートに`.env`ファイルを作成し、Google AI APIキーを設定します:

```bash
GOOGLE_API_KEY=your_api_key_here
```

Google AI APIキーは[Google AI Studio](https://makersuite.google.com/app/apikey)から取得できます。

### 4. データベースのマイグレーション

```bash
python manage.py migrate
```

### 5. YOLOモデルの準備

プロジェクトには`yolov8x-oiv7.pt`モデルファイルが含まれています。含まれていない場合は、[Ultralytics](https://github.com/ultralytics/ultralytics)から取得してください。

## 使い方

### サーバーの起動

```bash
python manage.py runserver
```

ブラウザで `http://127.0.0.1:8000/` にアクセスします。

### 画像からレシピを生成

1. **カメラを使用する場合**:
   - ブラウザでカメラへのアクセスを許可
   - 食材をカメラに映す
   - 「Take photo」ボタンをクリック

2. **画像をアップロードする場合**:
   - 「Upload photo」ボタンをクリック
   - 食材が写った画像を選択

3. **結果の確認**:
   - 検出された食材がバウンディングボックスで表示されます
   - AIが生成したレシピ名、準備時間、材料、手順が表示されます

## プロジェクト構造

```
image-to-food/
├── mysite/              # Django プロジェクト設定
│   ├── settings.py      # アプリケーション設定
│   └── urls.py          # メインURLルーティング
├── yolo/                # メインアプリケーション
│   ├── views.py         # ビジネスロジック（YOLO + AI処理）
│   ├── urls.py          # URLルーティング
│   ├── static/          # 静的ファイル
│   │   ├── capture.js   # カメラ制御とAPI通信
│   │   ├── main.css     # カスタムスタイル
│   │   └── docs.css     # ドキュメントスタイル
│   └── templates/       # HTMLテンプレート
│       └── yolo/
│           └── index.html
├── requirements.txt     # Python依存関係
├── yolov8x-oiv7.pt     # YOLOv8モデルファイル
└── manage.py           # Djangoコマンドラインユーティリティ
```

## 技術スタック

- **バックエンド**: Django 5.2
- **物体検出**: YOLOv8 (Ultralytics)
- **AI生成**: Google Gemini 2.5 Flash
- **画像処理**: Pillow, PyTorch
- **フロントエンド**: Bootstrap 5.3, Vanilla JavaScript

## 仕組み

1. **画像キャプチャ**: ユーザーがカメラで撮影またはファイルをアップロード
2. **物体検出**: YOLOv8モデルが画像内の食材を検出し、バウンディングボックスとクラスラベルを生成
3. **レシピ生成**: 検出された食材リストがGoogle Gemini AIに送信され、構造化されたレシピが生成される
4. **結果表示**: 検出画像とレシピ情報がユーザーに表示される

## 開発

### 開発サーバーの起動（デバッグモード）

```bash
python manage.py runserver
```

### 新しい依存関係の追加

```bash
pip install <package-name>
pip freeze > requirements.txt
```

## トラブルシューティング

### カメラが動作しない

- ブラウザのカメラアクセス許可を確認
- HTTPSまたはlocalhostでアクセスしているか確認（セキュリティ要件）

### API エラー

- `.env`ファイルにGoogle AI APIキーが正しく設定されているか確認
- APIキーの有効性と利用制限を確認

### モデル読み込みエラー

- `yolov8x-oiv7.pt`ファイルがプロジェクトルートに存在するか確認
- PyTorchとCUDA（GPU使用時）の互換性を確認

## ヘルプとサポート

- **バグ報告**: [GitHub Issues](https://github.com/macrosoft3/image-to-food/issues)
- **機能リクエスト**: [GitHub Issues](https://github.com/macrosoft3/image-to-food/issues)
- **フィードバック**: [フィードバックフォーム](https://forms.gle/uvEKbxzVJScZXFxe7)

## コントリビューション

プロジェクトへの貢献を歓迎します！

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## メンテナー

- **macrosoft** - [@KzKfOLgXRe75042](https://x.com/KzKfOLgXRe75042)

## 謝辞

- [YOLOv8](https://github.com/ultralytics/ultralytics) by Ultralytics
- [Google Gemini AI](https://ai.google.dev/)
- [Bootstrap](https://getbootstrap.com/)
- [Django](https://www.djangoproject.com/)
