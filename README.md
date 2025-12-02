# Image-to-Food (I2F)

![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django&logoColor=white)
![YOLOv8](https://img.shields.io/badge/Ultralytics-YOLOv8-FF6F00)

AI搭載の食材認識・レシピ生成Webアプリ。カメラまたは画像アップロードから食材を検出し、検出結果をもとにAIがレシピを提案します。

## これは何か（What）

Image-to-Food は、Ultralytics YOLOv8 による物体検出と Google Gemini を組み合わせ、画像中の食材候補を検出してレシピ（名前・材料・手順）を自動生成する Django アプリです。

## なぜ役立つか（Why）

- **ワンクリック**: カメラ撮影またはアップロードだけでレシピ案を自動生成
- **高精度検出**: `yolov8x-oiv7.pt` による物体検出で材料候補を抽出
- **スピーディ**: 軽量なUIとAPIで素早く試せるプロトタイピング環境
- **拡張容易**: Djangoベースで、モデル・UI・APIの差し替えが簡単

## はじめ方（Getting Started）

### 必要要件

- Python 3.10 以上
- カメラ対応ブラウザ（Chrome / Firefox / Safari 等）
- Google AI API キー（Gemini 用）

### セットアップ

```bash
# 1) 取得
git clone https://github.com/macrosoft3/image-to-food.git
cd image-to-food

# 2) 仮想環境（例: venv）
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 3) 依存関係
pip install -r requirements.txt

# 4) 環境変数（Google API キー）
cat > .env <<'EOF'
GOOGLE_API_KEY=your_api_key_here
EOF

# 5) DB 初期化
python manage.py migrate

# 6) 起動
python manage.py runserver
```

- ブラウザで `http://127.0.0.1:8000/` を開きます。
- 「Upload photo」または「Take photo」を使って画像を送信すると、検出結果画像とレシピが表示されます。

注意:

- PyTorch のインストールは環境により手順が異なる場合があります。エラーになる場合は公式インストールガイド（CUDA/CPU向け）に従って `torch`/`torchvision` を別途導入してください。
- 同梱の `yolov8x-oiv7.pt` を使用します（未同梱の場合は Ultralytics から入手してください）。

## 使い方（Usage）

UI からの操作が前提です。カメラを許可し、被写体（食材）を映して「Take photo」、または「Upload photo」で画像を選択してください。検出画像（バウンディングボックス付き）と、Gemini が生成したレシピ（名前・材料・手順）がページ下部に表示されます。

関連ファイル:

- テンプレート: `yolo/templates/yolo/index.html`
- クライアントJS: `yolo/static/capture.js`

## プロジェクト構成

```
image-to-food/
├── mysite/
│   ├── settings.py
│   └── urls.py
├── yolo/
│   ├── views.py
│   ├── urls.py
│   ├── static/
│   │   ├── capture.js
│   │   ├── main.css
│   │   └── docs.css
│   └── templates/
│       └── yolo/
│           └── index.html
├── yolov8x-oiv7.pt
├── requirements.txt
└── manage.py
```

## サポート（Help）

- バグ報告・要望: https://github.com/macrosoft3/image-to-food/issues
- 参考実装: `yolo/views.py`（YOLO 推論と Gemini 呼び出し）

## メンテナー / コントリビューション（Who）

- メンテナー: **macrosoft**（X: https://x.com/KzKfOLgXRe75042 ）
- コントリビュート歓迎: Issue で相談の上、PR をお送りください（コーディング規約や詳細な手順は将来の `CONTRIBUTING.md` で案内予定）。

---

補足:

- 本リポジトリは学習・試用目的の構成です。プロダクション利用時は、環境変数の管理、CSRF/Cookie のセキュリティ設定、モデル最適化、ログ/監視等を適切に構成してください。
