'use strict';
const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;

module.exports.init = function(prefix, config) {
  ipcMain.on(prefix+'set-badge-count', function(event, data) {
    console.log('badge count', data.count);
    //app.setBadgeCount(data.count);
  });
}
