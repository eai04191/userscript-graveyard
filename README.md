# Userscript Graveyard ⚰️

[![forthebadge](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](https://forthebadge.com)

はかば。

## ⚠️ Attention

ここにあるのはリポジトリを建てるほどやる気があるわけでもないスクリプト達です。

書いた当時は動いたけれど、現在では動いていない可能性もあります。むしろ書いた当時ですら動いていなかったかもしれません。

やる気が無いのですから、おそらく設定画面はありませんし、エラーは握りつぶされデバッグしづらく、必要のないDOMの変更をしてパフォーマンスに影響を与えているかもしれません。

これらのスクリプトが満足に動くと期待しないでください。問題があればissueを建ててもらえれば目は通しますが、対応はしないと思います。（ちょろいのでおだてればできる範囲は対応するでしょう）

スクリプトはすべてMITライセンスのため、fork、公開するのは自由です。

PRはおそらく受け入れます。

## 🎨 userstyle

[Stylus](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=ja)で動作確認済み。

リポジトリになってるのは[user:eai04191 topic:userstyle](https://github.com/search?q=user%3Aeai04191+topic%3Auserstyle)で確認して。

### [twitter.javaStyleButton.user.css](/userstyle/twitter.javaStyleButton.user.css)

<img src="https://i.imgur.com/Wk4Ykcf.png" align="right">

Twitter のボタン（フォローとか）を[ジャバ](https://www.java.com/ja/download/)っぽくする。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [mastodon.omoshiika.user.css](/userstyle/mastodon.omoshiika.user.css)

<img src="https://mstdn.maud.io/system/media_attachments/files/001/988/721/original/adeebcea11bff48d.jpeg" align="right">

連合タイムラインにアイコンだけ表示するようにする。

> SNSはアイコンが10割なので連合タイムラインはアイコンだけ表示するようにしたら重しイカもしれない
> https://mstdn.maud.io/users/Eai/statuses/100610017821558791

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [mastodon.gaminghota.user.css](/userstyle/mastodon.gaminghota.user.css)

[<img src="https://mstdn.maud.io/system/media_attachments/files/002/535/811/small/454eb3a4c9419a43.png" align="right">](https://mstdn.maud.io/system/media_attachments/files/002/535/811/original/454eb3a4c9419a43.mp4)

https://mstdn.maud.io/users/Eai/statuses/101142623916415083

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [youtube.capture.user.css](/userstyle/youtube.capture.user.css)

<img src="https://i.imgur.com/EJniMei.png" align="right" width="50%">

YouTubeでシアターモードで再生中の動画の大きさを1920x1080にして、上に乗っかってるボタンなどを消す。

ボタンや影など邪魔されずに等倍の大きさで`video`ノードのスクリーンショットを撮影できる。

1920x1080で取るためにはそれより大きいディスプレイが必要。画像は2560x1440。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [tissue.safemode.user.css](/userstyle/tissue.safemode.user.css)

<img src="https://i.imgur.com/g1r8iXn.png" align="right" width="50%">

[Tissue](https://shikorism.net/) のセンシティブな要素を隠すスタイル。

センシティブな要素しかないだろ。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [nijie.fluid.user.css](/userstyle/nijie.fluid.user.css)

<img src="https://i.imgur.com/6N0iXAR.png" align="right" width="50%">

ニジエの作品ページで枠を100%にして絵を大きく表示するスタイル。

めんどくさくてすべての要素の `box-sizing` をいじったので若干崩れる箇所がある。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [notestock.searchcount.user.css](/userstyle/notestock.searchcount.user.css)

<img src="https://i.imgur.com/twaNFRi.png" align="right">

notestockの検索結果に見つかった件数を表示するスタイル。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [github.expandItems.user.css](/userstyle/github.expandItems.user.css)

<img src="https://i.imgur.com/VpTMmsw.png" align="right" width="50%">

GitHubのタイムラインでたたまれる項目を常に展開するスタイル。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [mastodon.privacyfilter.user.css](/userstyle/mastodon.privacyfilter.user.css)

<img src="https://i.imgur.com/NBKEraL.png" align="right" width="50%">

MastodonのWebUIから個人を特定できそうなのを隠すスタイル。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [](/userstyle/)


## 🛠️ userscript

[Violentmonkey](https://violentmonkey.github.io/) で動作確認済み。

リポジトリになってるのは[user:eai04191 topic:userscript](https://github.com/search?q=user%3Aeai04191+topic%3Auserscript)で確認して。

### [mastodon.donsogigi.user.js](/userscript/mastodon.donsogigi.user.js)

[<img src="https://media.mstdn.plusminus.io/media_attachments/files/000/229/109/small/d6f2fc844a6772f6.png" align="right">](https://media.mstdn.plusminus.io/media_attachments/files/000/229/109/original/d6f2fc844a6772f6.mp4)

`#そぎぎ`を追加するボタンを追加する。@mohemohe が直してくれた。

[:don:そぎ by mohemohe · Pull Request #1 · eai04191/userscript-graveyard](https://github.com/eai04191/userscript-graveyard/pull/1)

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [notestock.loginCodeButton.user.js](/userscript/notestock.loginCodeButton.user.js)

**[Deprecated]**

認証画面にトゥートするボタンを追加する。

現在は公式にトゥート、note するボタンが追加された。

### [pixiv.openWithMangaView.user.js](/userscript/pixiv.openWithMangaView.user.js)

<img src="https://i.imgur.com/5gR5urk.png" align="right">

**[Deprecated]**

pixivのユーザーのイラスト一覧の画面で、イラストの漫画ビューを直接開くボタンを追加する。

現在はイラストページから漫画が見れるので必要なくなった。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [github.relativeTime.user.js](/userscript/github.relativeTime.user.js)

<img src="https://i.imgur.com/ok8frdf.png" align="right">

GitHubの時間表記`on 30 Jul 2018`などを`2018/7/30 22:41`といった表記に変更する。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [picrew.mastodonIntegration.user.js](/userscript/picrew.mastodonIntegration.user.js)

<img src="https://i.imgur.com/agpRoRC.png" align="right" width=50%>

picrewの完成画面で直接投稿できるボタンを追加する。

使うには15,16行目のホストとトークンを書き換える。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [bookmeter.hontoSearch.user.js](/userscript/bookmeter.hontoSearch.user.js)

<img src="https://i.imgur.com/217fvkh.png" align="right">

読書メーターで本の詳細ページに出てくる「書店で詳細を見る」にhontoでの検索リンクを追加する。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [hatena.hatenaKeywordRemover.user.js](/userscript/hatena.hatenaKeywordRemover.user.js)

はてなブログとかではてなキーワードとかへのリンクを削るやつ。

車輪の再発明。

### [tissue.tagMute.user.js](/userscript/tissue.tagMute.user.js)

[Tissue](https://shikorism.net/) にタグミュートのようなものを追加するやつ。

使うときは14行目の配列を書き換える

使ってるとタグミュートしていることを忘れるので注意。

### [discord.image.user.js](/userscript/discord.image.user.js)

**[Defective]**

Discordで画像の保存を楽にするためのなにやら。

画像の下にダウンロードボタンを付ける予定だったがオリジンが違うため`download`属性付きの`a`もblobを取ってくるやつもうまいこと行かずに頓挫。

### [mastodon.bigben.user.js](/userscript/mastodon.bigben.user.js)

https://mastodon.org.uk/@bigben のBONGがホームに流れたらぼんぐぼんぐしてくれる。

https://stellaria.network/users/Eai/statuses/102006336379176131

飽きる。

### [mastodon.xfiles.user.js](/userscript/mastodon.xfiles.user.js)

`x-files`あたりの文字がホームに流れたらX-filesのテーマが流れる。

https://stellaria.network/users/Eai/statuses/101998013693873129

### [mastodon.ussr.user.js](/userscript/mastodon.ussr.user.js)

☭や<img src="https://media.stellaria.network/custom_emojis/images/000/000/767/static/Hammer_and_sickle_red_on_transparent-min.png" width="16px">がホームに流れたらソビエト連邦の国歌が流れる。

https://stellaria.network/users/Eai/statuses/102163905594645230

### [](/userscript/)

## 🔖 bookmarklet

### [mastodon.embed.js](/bookmarklet/mastodon.embed.js)

<img src="https://i.imgur.com/Fuvon8m.png" align="right">

Mastodonのトゥートページで実行すると埋め込みコードを得ることができる。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)

### [](/bookmarklet/)

## ❓ その他

### [violentmonkey.oneline.css](/userstyle/violentmonkey.oneline.css)

<img src="https://media.stellaria.network/media_attachments/files/000/187/763/original/60ead13ae199b317.png" align="right" width="50%">

Violentmonkeyの設定画面で1スクリプト1行で表示するCSS。

Violentmonkeyの 設定 -> 高度な設定 -> カスタムスタイル に貼り付けて使用する。

![](https://placehold.jp/ffffff/ffffff/1000x1.png)
