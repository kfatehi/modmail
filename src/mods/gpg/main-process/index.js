'use strict';
const Promise = require('bluebird');
const openpgp = require('openpgp');
const electron = require('electron');
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const secretsFilePath = `${process.env.HOME}/.gpg-secret.js`;

module.exports.init = function(prefix, config) {
  const getSecrets = Promise.promisify(config.getSecrets);
  getSecrets().spread(function(key, passphrase) {
    ipcMain.on(prefix+'decrypt-request', function(event, ciphertext) {
      decrypt(ciphertext, key, passphrase).then(function(value) {
        event.sender.send(prefix+"decrypt-result", { plaintext: value })
      }).catch(function(err) {
        event.sender.send(prefix+"decrypt-result", { error: err.message })
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
