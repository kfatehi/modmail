var ipc = require('electron').ipcRenderer
var mods = require('../../mods')

ipc.on('init', function() {
  window.$ = require('jquery');
  window.gmail = require('./gmail')(window.$)

  // now we load injection component of our modules
  mods.requireInjection('gpg').init()
});
