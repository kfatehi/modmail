'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipcMain = electron.ipcMain;
var Promise = require('bluebird')
const getSecrets = Promise.promisify(require(`${process.env.HOME}/.gpg-secret.js`))
const openpgp = require('openpgp');

function decrypt(pgpMessage, key, passphrase) {
  var privateKey = openpgp.key.readArmored(key).keys[0];
  privateKey.decrypt(passphrase);
  pgpMessage = openpgp.message.readArmored(pgpMessage);
  return openpgp.decryptMessage(privateKey, pgpMessage)
}

// Report crashes to our server.
electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  getSecrets().spread(function(key, passphrase) {
    ipcMain.on('decrypt-request', function(event, ciphertext) {
      decrypt(ciphertext, key, passphrase).then(function(value) {
        event.sender.send("decrypt-result", { plaintext: value })
      }).catch(function(err) {
        event.sender.send("decrypt-result", { error: err.message })
      });
    });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
