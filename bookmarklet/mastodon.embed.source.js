const domain = window.location.host;
const isLongURL = window.location.href.match(/\/statuses\//);
let user;
let id;
if (isLongURL) {
  user = window.location.pathname.split("/")[2];
  id = window.location.pathname.split("/")[4];
} else {
  user = window.location.pathname.split("/")[1].replace("@", "");
  id = window.location.pathname.split("/")[2];
}
const html = `<iframe src="https://${domain}/@${user}/${id}/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400"></iframe><script src="https://${domain}/embed.js" async="async"></script>`;
window.prompt("Embed Ctrl+C to copy.", html);
