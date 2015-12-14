var Promise = require('bluebird');
var ipc = require('electron').ipcRenderer;

module.exports.decrypt = function(pgpMessage) {
  return decryptRemotely(randId(), pgpMessage);
}

module.exports.encrypt = function(recipient, plaintext) {
  return encryptRemotely(randId(), recipient, plaintext);
}

// used to keep our IPC messages from clashing
function randId() {
  return Math.random().toString(20).substring(6)
}

// all this does is message the ciphertext to the secure area
// and get back the plaintext. this is to avoid bringing the
// user's gpg key into the active webpage
// returns a promise
function decryptRemotely(id, pgpMessage) {
  return new Promise(function(resolve, reject) {
    ipc.on('decrypt-result', function(event, result) {
      if (result.id === id) {
        if (result.error) {
          reject(result.error)
        } else {
          resolve(result.plaintext)
        }
      }
    });
    ipc.sendToHost('decrypt-request', {
      ciphertext: pgpMessage, id: id 
    });
  });
}

function encryptRemotely(id, recipient, plaintext) {
  return new Promise(function(resolve, reject) {
    ipc.on('encrypt-result', function(event, result) {
      if (result.id === id) {
        if (result.error) {
          reject(result.error)
        } else {
          resolve(result.ciphertext)
        }
      }
    });
    ipc.sendToHost('encrypt-request', {
      recipient: recipient, plaintext: plaintext, id: id 
    });
  });
}
