"use strict";
const fs = require('fs');
var ipc = require('electron').ipcRenderer;

module.exports.init = (api) => {
  api.gmail.observe.on('load', ()=>{
    api.gmail.observe.on("refresh", ()=> {
      setBadgeToUnreadInboxCount();
    });

    api.gmail.observe.on("new_email", ()=> {
      setBadgeToUnreadInboxCount();
      notifyNewMail();
    });

    api.gmail.observe.on("read", ()=> {
      setBadgeToUnreadInboxCount();
    });

    setBadgeToUnreadInboxCount();
  });

  function setBadgeToUnreadInboxCount() {
    let count = gmail.get.unread_inbox_emails();
    ipc.sendToHost('notify-set-unread-count', count);
  }

  function notifyNewMail() {
    let myNotification = new Notification('New Email', {
      body: 'You have new mail.'
    })

    myNotification.onclick = () => {
      ipc.sendToHost('new-mail-notification-clicked', count);
    }
  }

  window._setBadgeToUnreadInboxCount = setBadgeToUnreadInboxCount;
  window._notifyNewMail = notifyNewMail;
}

