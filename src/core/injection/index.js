'use strict';
const ipc = require('electron').ipcRenderer
const mods = require('../../mods')
const config = require('./src/config');

ipc.on('init', function() {
  window.$ = require('jquery');
  window.gmail = require('./gmail')(window.$)

  config.mods.forEach(function(mod) {
    // now we load injection component of our modules
    mods.requireInjection(mod).init()
  })
});
