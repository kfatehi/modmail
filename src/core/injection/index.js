'use strict';
const ipc = require('electron').ipcRenderer
const mods = require('../../mods')

ipc.on('init-injection', function(event, account) {
  window.$ = require('jquery');
  window.gmail = require('./gmail')(window.$)

  account.mods.forEach(function(mod) {
    // now we load injection component of our modules
    mods.requireInjection(mod).init()
    console.log(`${account.id}: ${mod.id} initialized injection`);
  })
});
