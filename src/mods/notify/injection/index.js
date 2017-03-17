"use strict";
const fs = require('fs');
var ipc = require('electron').ipcRenderer;

module.exports.init = (api, account) => {
  let count = 0;
  api.gmail.observe.on('load', ()=>{
    api.gmail.observe.on("refresh", ()=> {
      updateCount();
    });

    gmail.observe.on("new_email", function(id, url, body, xhr) {
      // this is a little broken. none of the args work and it seems
      // to repeatedly get called, so in order to prevent duplicates at least,
      // we will only emit this if the count changed.
      if (updateCount()) {
        notifyNewMail();
      }
    })

    api.gmail.observe.on("read", ()=> {
      updateCount();
    });

    updateCount();
  });

  function updateCount() {
    let prev = count;
    let newCount = gmail.get.unread_inbox_emails();
    if ( prev === newCount ) return false;
    else {
      count = newCount;
      ipc.sendToHost('notify-set-unread-count', count);
      return true;
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

