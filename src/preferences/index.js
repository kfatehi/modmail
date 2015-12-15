'use strict';
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const approot = `${__dirname}/../..`
const app = electron.app;

const userData = app.getPath('userData')

let win = null

module.exports.open = function() {
  if (win) {
    win.show();
  } else {
    win = createWindow();
    win.on('closed', function() {
      win = null;
    })
  }
}

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    icon: `${approot}/images/logo.png`,
    width: 520,
    height: 320
  });

  // and load the index.html of the app.
  win.loadURL(`file://${approot}/preferences.html`);
  return win;
}
