# Iwaraの動画をaria2でダウンロードするやつ

正確には https://github.com/agalwood/Motrix をフロントエンドとした aria2 にダウンロードリクエストを投げるやつ

速い

<!-- prettier-ignore -->
[video](https://media.stellaria.network/media_attachments/files/111/359/013/708/926/504/original/6a4bbd4888797be5.mp4 ':include')

## 設定

violentmonkeyの値に以下を設定する

```json
{
    "aria2token": "(Preferences > Advanced > Security > RPC Secretの値)"
}
```

値を設定できないuserscriptマネージャーは未サポート
