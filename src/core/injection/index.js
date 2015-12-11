'use strict';
const ipc = require('electron').ipcRenderer
const mods = require('../../mods')

ipc.on('init-injection', function(event, account) {
  window.$ = require('jquery');
  window.gmail = require('./gmail')(window.$)

  mods.initializeModComponents('injection', [account]);
});
