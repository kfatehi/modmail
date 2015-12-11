'use strict';
const ipcRenderer = require('electron').ipcRenderer;

module.exports.init = function(prefix, webview) {
  webview.addEventListener('ipc-message', function(event) {
    if (event.channel === 'decrypt-request') {
      ipcRenderer.send(prefix+'decrypt-request', event.args[0])
    }
  });

  ipcRenderer.on(prefix+'decrypt-result', function(event, arg) {
    webview.send('decrypt-result', arg)
  });
}
