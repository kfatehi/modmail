"use strict";
const fs = require('fs');
var ipc = require('electron').ipcRenderer;

module.exports.init = (api, account) => {
  let count = 0;
  api.gmail.observe.on('load', ()=>{
    api.gmail.observe.on("refresh", updateCount);
    api.gmail.observe.on("read", updateCount);
    api.gmail.observe.on("http_event", updateCount);
    api.gmail.observe.on("new_email", updateCount);
    api.gmail.observe.on("refresh", updateCount);
    api.gmail.observe.on("poll", updateCount);
    updateCount();
  });

  function updateCount() {
    let prev = count;
    let newCount = gmail.get.unread_inbox_emails();
    if ( prev !== newCount ) {
      count = newCount;
      ipc.sendToHost('notify-set-unread-count', count);
      if ( prev < newCount ) {
        notifyNewMail();
      }
      return true;
    } else {
      return false;
    }
  }

  function notifyNewMail() {
    let myNotification = new Notification(account.label, {
      body: 'You have new mail.'
    })

    myNotification.onclick = () => {
      ipc.sendToHost('new-mail-notification-clicked');
    }
  }
}

