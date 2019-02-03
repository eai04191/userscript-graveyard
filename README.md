# Userscript Graveyard ⚰️

[![forthebadge](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](https://forthebadge.com)

はかば。

## ⚠️ Attention

ここにあるのはリポジトリを建てるほどやる気があるわけでもないスクリプト達です。

書いた当時は動いたけれど、現在では動いていない可能性もあります。むしろ書いた当時ですら動いていなかったかもしれません。

やる気が無いのですから、おそらく設定画面はありませんし、エラーは握りつぶされデバッグしづらく、必要のないDOMの変更をしてパフォーマンスに影響を与えているかもしれません。

これらのスクリプトが満足に動くと期待しないでください。問題が発生したらissueを建てても良いですが、対応することはまずないと考えてください。

スクリプトはMITライセンスのため、あなたがforkして修正・公開するのは自由です。

## 🎨 userstyle

[Stylus](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=ja)で動作確認済み。

リポジトリになってるのは[user:eai04191 topic:userstyle](https://github.com/search?q=user%3Aeai04191+topic%3Auserstyle)で確認して。

### [twitter.javaStyleButton.user.css](/userstyle/twitter.javaStyleButton.user.css)

![SS](https://i.imgur.com/Wk4Ykcf.png)

Twitter のボタン（フォローとか）を[ジャバ](https://www.java.com/ja/download/)っぽくする。

### [mastodon.omoshiika.user.css](/userstyle/mastodon.omoshiika.user.css)

![SS](https://mstdn.maud.io/system/media_attachments/files/001/988/721/original/adeebcea11bff48d.jpeg)

連合タイムラインにアイコンだけ表示するようにする。

> SNSはアイコンが10割なので連合タイムラインはアイコンだけ表示するようにしたら重しイカもしれない
> https://mstdn.maud.io/users/Eai/statuses/100610017821558791


### [youtube.capture.user.css](/userstyle/youtube.capture.user.css)

![SS](https://i.imgur.com/EJniMei.png)

YouTubeでシアターモードで再生中の動画の大きさを1920x1080にして、上に乗っかってるボタンなどを消す。

ボタンや影など邪魔されずに等倍の大きさで`video`ノードのスクリーンショットを撮影できる。

1920x1080で取るためにはそれより大きいディスプレイが必要。画像は2560x1440。

### [](/userstyle/)


## 🛠️ userscript

[Violentmonkey](https://violentmonkey.github.io/) で動作確認済み。

リポジトリになってるのは[user:eai04191 topic:userscript](https://github.com/search?q=user%3Aeai04191+topic%3Auserscript)で確認して。

### [mastodon.donsogigi.user.js](/userscript/mastodon.donsogigi.user.js)

**[DEPRECATED]**

[![SS](https://mstdn.maud.io/system/media_attachments/files/002/415/143/small/c59d30ffcd762854.png)](https://mstdn.maud.io/system/media_attachments/files/002/415/143/original/c59d30ffcd762854.mp4)

`#そぎぎ`を追加するボタンを追加する。安易な`innerHTML`のせいですべてが死ぬ。

### [notestock.loginCodeButton.user.js](/userscript/notestock.loginCodeButton.user.js)

**[DEPRECATED]**

認証画面にトゥートするボタンを追加する。

現在は公式にトゥート、note するボタンが追加された。

### [pixiv.openWithMangaView.user.js](/userscript/pixiv.openWithMangaView.user.js)

![SS](https://i.imgur.com/5gR5urk.png)

pixivのユーザーのイラスト一覧の画面で、イラストの漫画ビューを直接開くボタンを追加する。

### [github.relativeTime.user.js](/userscript/github.relativeTime.user.js)

![SS](https://i.imgur.com/ok8frdf.png)

GitHubの時間表記`on 30 Jul 2018`などを`2018/7/30 22:41`といった表記に変更する。

### [picrew.mastodonIntegration.user.js](/userscript/picrew.mastodonIntegration.user.js)

![SS](https://i.imgur.com/agpRoRC.png)

picrewの完成画面で直接投稿できるボタンを追加する。

使うには15,16行目のホストとトークンを書き換える。

### [bookmeter.hontoSearch.user.js](/userscript/bookmeter.hontoSearch.user.js)

読書メーターで本の詳細ページに出てくる「書斎で詳細を見る」にhontoでの検索を追加する。

`MutationObserver`を知らない頃に書いたので`waitForKeyelements.js`とか使ってるしもう何もかも終わり。

### [](/userscript/)

## 🔖 bookmarklet

### [mastodon.embed.js](/bookmarklet/mastodon.embed.js)

![SS](https://i.imgur.com/Fuvon8m.png)

Mastodonのトゥートページで実行すると埋め込みコードを得ることができる。

### [](/bookmarklet/)