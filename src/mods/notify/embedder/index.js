'use strict';
const ipcRenderer = require('electron').ipcRenderer;

module.exports.init = function(prefix, webview) {
  webview.addEventListener('ipc-message', function(event) {
    if (event.channel === 'create-notification') {
      ipcRenderer.send(prefix+'create-notification', event.args[0])
    }
    if (event.channel === 'set-badge-count') {
      ipcRenderer.send(prefix+'set-badge-count', event.args[0])
    }
  });
}
