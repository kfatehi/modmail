'use strict';
const Promise = require('bluebird');
const openpgp = require('openpgp');
const electron = require('electron');
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const secretsFilePath = `${process.env.HOME}/.gpg-secret.js`;

module.exports.init = function(prefix, config) {
  const getSecrets = Promise.promisify(config.getSecrets);
  const getRecipientPublicKey = Promise.promisify(config.getRecipientPublicKey);

  getSecrets().spread(function(key, passphrase) {

    ipcMain.on(prefix+'decrypt-request', function(event, data) {
      var id = data.id;
      var ciphertext = data.ciphertext
      decrypt(ciphertext, key, passphrase).then(function(value) {
        event.sender.send(prefix+"decrypt-result", { plaintext: value, id: id })
      }).catch(function(err) {
        event.sender.send(prefix+"decrypt-result", { error: err.message, id: id })
      });
    });

    ipcMain.on(prefix+'encrypt-request', function(event, data) {
      var id = data.id;
      var plaintext = data.plaintext;
      getRecipientPublicKey(data.recipient).then(function(pubKey) {
        return encrypt(pubKey, plaintext)
      }).then(function(ciphertext) {
        event.sender.send(prefix+"encrypt-result", { ciphertext: ciphertext, id: id })
      }).catch(function(err) {
        event.sender.send(prefix+"encrypt-result", { error: err.message, id: id })
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

function encrypt(pubKey, plaintext) {
  var publicKey = openpgp.key.readArmored(pubKey);
  return openpgp.encryptMessage(publicKey.keys, plaintext)
}
