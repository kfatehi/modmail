"use strict";
const fs = require('fs');
var ipc = require('electron').ipcRenderer;

module.exports.init = (api) => {
  api.gmail.observe.on('load', ()=>{

    api.gmail.observe.on("refresh", ()=> {
      console.log('refresh');
      setBadgeToUnreadInboxCount();
    });

    api.gmail.observe.on("new_email", ()=> {
      console.log('new mail');
      setBadgeToUnreadInboxCount();
      notifyNewMail();
    });

    api.gmail.observe.on("read", ()=> {
      console.log('read');
      setBadgeToUnreadInboxCount();
    });

    console.log('loaded');
    setBadgeToUnreadInboxCount();
  });

  function setBadgeToUnreadInboxCount() {
    let count = gmail.get.unread_inbox_emails();
    ipc.sendToHost('notify-set-unread-count', count);
  }

  function notifyNewMail() {
    ipc.sendToHost('notify-new-mail');
  }

  window._setBadgeToUnreadInboxCount = setBadgeToUnreadInboxCount;
  window._notifyNewMail = notifyNewMail;
}

