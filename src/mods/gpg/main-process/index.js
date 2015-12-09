'use strict';
const Promise = require('bluebird');
const openpgp = require('openpgp');
const electron = require('electron');
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const secretsFilePath = `${process.env.HOME}/.gpg-secret.js`;

module.exports.init = function() {
  getSecrets().spread(function(key, passphrase) {
    ipcMain.on('decrypt-request', function(event, ciphertext) {
      decrypt(ciphertext, key, passphrase).then(function(value) {
        event.sender.send("decrypt-result", { plaintext: value })
      }).catch(function(err) {
        event.sender.send("decrypt-result", { error: err.message })
      });
    });
  }).catch(function(err) {
    dialog.showErrorBox(err.message, err.stack)
    process.exit(1);
  })
}

function decrypt(pgpMessage, key, passphrase) {
  var privateKey = openpgp.key.readArmored(key).keys[0];
  privateKey.decrypt(passphrase);
  pgpMessage = openpgp.message.readArmored(pgpMessage);
  return openpgp.decryptMessage(privateKey, pgpMessage)
}

function getSecrets() {
  return new Promise(function(resolve, reject) {
    let secretFunc;
    try {
      secretFunc = require(secretsFilePath)
    } catch (e) {
      throw new Error('Missing secrets file. See README for more information.');
    }
    resolve(Promise.promisify(secretFunc)())
  });
}
