var webview = document.getElementById('gmail')
var ipcRenderer = require('electron').ipcRenderer;

webview.addEventListener('page-title-updated', function(e) {
  document.getElementsByTagName("title")[0].text = e.title
});

webview.addEventListener('ipc-message', function(event) {
  ipcRenderer.send(event.channel, event.args[0])
  console.log('renderer forwarded ipc from guest to main process', event);
});

ipcRenderer.on('decrypt-result', function(event, arg) {
  webview.send('decrypt-result', arg)
});

webview.addEventListener("dom-ready", function() {
  //webview.openDevTools();
  webview.send('init');
});
