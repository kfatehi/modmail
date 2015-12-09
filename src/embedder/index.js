var mods = require('./src/mods');
var webview = document.getElementById('gmail')

webview.addEventListener('page-title-updated', function(e) {
  document.getElementsByTagName("title")[0].text = e.title
});

webview.addEventListener("dom-ready", function() {
  //webview.openDevTools();

  // initialize the embedder component of each module
  mods.requireEmbedder('gpg').init(webview);

  // then send the init signal
  webview.send('init');
});
