var Promise = require('bluebird');
var ipc = require('electron').ipcRenderer;

module.exports.decrypt = decryptRemotely;
module.exports.encrypt = encryptRemotely;

// all this does is message the ciphertext to the secure area
// and get back the plaintext. this is to avoid bringing the
// user's gpg key into the active webpage
// returns a promise
function decryptRemotely(pgpMessage) {
  return new Promise(function(resolve, reject) {
    ipc.on('decrypt-result', function(event, result) {
      result.error ? reject(result.error) : resolve(result.plaintext)
    });
    ipc.sendToHost('decrypt-request', pgpMessage);
  });
}

function encryptRemotely(recipient, plaintext) {
  return new Promise(function(resolve, reject) {
    ipc.on('encrypt-result', function(event, result) {
      result.error ? reject(result.error) : resolve(result.ciphertext)
    });
    ipc.sendToHost('encrypt-request', {
      recipient: recipient, plaintext: plaintext
    });
  });
}
