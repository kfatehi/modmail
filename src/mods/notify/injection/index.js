"use strict";
var ipc = require('electron').ipcRenderer;

module.exports.init = (tools) => {
  // new email notifications
  var gmailjs = tools.gmail;

  gmailjs.observe.on('new_email', function() {
    createNotification();
    setTimeout(updateBadge, 2500);
  });

  function createNotification() {
    ipc.sendToHost('create-notification');
  }

  function updateBadge() {
    var unreads = gmailjs.get.unread_emails();
    console.log('unreads inbox count:', unreads.inbox);
    ipc.sendToHost('set-badge-count', { count: unreads.inbox });
  }

  setTimeout(updateBadge, 2500);
}
