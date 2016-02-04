'use strict';
const Promise = require('bluebird');
const openpgp = require('openpgp');
const electron = require('electron');
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const secretsFilePath = `${process.env.HOME}/.gpg-secret.js`;
const _ = require('lodash');

module.exports.init = function(prefix, config) {
  const key = config.identity.privateKey;
  const passphrase = config.identity.passphrase;

  ipcMain.on(prefix+'decrypt-request', function(event, data) {
    var id = data.id;
    var ciphertext = data.ciphertext
    decrypt(ciphertext, key(), passphrase()).then(function(value) {
      event.sender.send(prefix+"decrypt-result", { plaintext: value, id: id })
    }).catch(function(err) {
      event.sender.send(prefix+"decrypt-result", { error: err.message, id: id })
    });
  });

  ipcMain.on(prefix+'encrypt-request', function(event, data) {
    var id = data.id;
    var plaintext = data.plaintext;
    var recipients = data.recipients;

    var publicKeys = ""
    var err = null

    _.each(recipients, function(emailAddress) {
      let recipient = _.find(config.recipients, (recip) => {
        return _.contains(recip.emails, emailAddress)
      })
      if (recipient && recipient.publicKey) {
        publicKeys += recipient.publicKey() + "\n"
      } else {
        err = `no public key found for ${emailAddress}`;
      }
    })

    if (err) {
      event.sender.send(prefix+"encrypt-result", { error: err, id: id })
    } else {
      encrypt(publicKeys, plaintext).then(function(ciphertext) {
        event.sender.send(prefix+"encrypt-result", { ciphertext: ciphertext, id: id })
      }).catch(function() {
        event.sender.send(prefix+"encrypt-result", { error: err.message, id: id })
      })
    }

  });
}

function decrypt(pgpMessage, key, passphrase) {
  var privateKey = openpgp.key.readArmored(key).keys[0];
  privateKey.decrypt(passphrase);
  pgpMessage = openpgp.message.readArmored(pgpMessage);
  return openpgp.decryptMessage(privateKey, pgpMessage)
}

function encrypt(pubKeys, plaintext) {
  var publicKey = openpgp.key.readArmored(pubKeys)
  return openpgp.encryptMessage(publicKey.keys, plaintext)
}
