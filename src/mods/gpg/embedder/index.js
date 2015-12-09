'use strict';
const ipcRenderer = require('electron').ipcRenderer;

module.exports.init = function(webview) {
  webview.addEventListener('ipc-message', function(event) {
    if (event.channel === 'decrypt-request') {
      ipcRenderer.send(event.channel, event.args[0])
    }
  });

  ipcRenderer.on('decrypt-result', function(event, arg) {
    webview.send('decrypt-result', arg)
  });
}
