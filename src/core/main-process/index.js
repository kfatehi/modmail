'use strict';
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const mods = require('../../mods');
const config = require('../../config');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

module.exports.init = function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: `${__dirname}/../../../images/logo.png`,
    width: 980,
    height: 650
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/../../../index.html`);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  config.mods.forEach(function(mod) {
    // here we load modules we want to use
    // requireMain means we are requiring the main-process component
    mods.requireMain(mod).init();
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}
