'use strict';
const ipcRenderer = require('electron').ipcRenderer;

module.exports.init = function(prefix, webview) {
  webview.addEventListener('ipc-message', function(event) {
    ipcRenderer.send(prefix+event.channel, ...event.args);
  });
}
