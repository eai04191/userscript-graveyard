# Mastodonに投稿するやつ

![](https://i.imgur.com/d0XxifO.png)

[てゆうかもう寝よう。](http://mouneyou.rgx6.com/)から Mastodon に投稿するボタンを追加する。

## 設定項目

`GM_getValue`でホスト名とトークンを取得するので設定しておく。

| キー  | 値                                                                                |
| ----- | --------------------------------------------------------------------------------- |
| host  | お使いの Mastodon サーバーのホスト名                                              |
| token | Mastodon の設定から**開発**->**新規アプリ**で作成して、できた**アクセストークン** |

Violentmonkey ならインストールした後ダッシュボードから**編集**->**値**

![](https://i.imgur.com/UsYo9vr.png)

**All**押してこんな感じにする

Tampermonkey はわからん（ないっぽい）（つまり使えないということです）
