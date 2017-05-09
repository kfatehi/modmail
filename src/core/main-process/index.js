'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const mods = require('../../mods');
const loadConfig = require('../../config').load;
const mailto = require('./mailto');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

module.exports.init = function() {
  const config = loadConfig();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: `${__dirname}/../../../images/logo.png`,
    width: 980,
    height: 650
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/../../../index.html`);

  mods.initializeModComponents('main-process', [config, mainWindow])

  if (config.mailto) {
    app.setAsDefaultProtocolClient('mailto');
    console.log('registered as default mail handler');
  }

  if (process.platform == 'darwin') {
    mainWindow.on('close', function(event) {
      event.preventDefault()
      mainWindow.hide();
    })

    app.on('activate', function() {
      mainWindow.show();
    })

    app.on('open-url', function(event, href) {
      event.preventDefault();
      const data = mailto.parse(href);
      mainWindow.webContents.send('open-mailto-link', data);
    })
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function(event) {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}
