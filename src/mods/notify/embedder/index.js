'use strict';
const ipcRenderer = require('electron').ipcRenderer;

module.exports.init = function(prefix, webview, tab) {
  webview.addEventListener('ipc-message', function(event) {
    ipcRenderer.send(prefix+event.channel, ...event.args);

    if (event.channel === "notify-set-unread-count") {
      const count = event.args[0];
      window.ev = event;
      window.tab = tab;
      if (count === 0) {
        tab.find('.count').empty();
      } else {
        tab.find('.count').text(`(${count})`);
      }
    }
  });
}
