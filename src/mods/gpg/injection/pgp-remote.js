var Promise = require('bluebird');
var ipc = require('electron').ipcRenderer;
module.exports.decrypt = decryptRemotely;

// all this does is message the ciphertext to the secure area
// and get back the plaintext. this is to avoid bringing the
// user's gpg key into the active webpage
// returns a promise
function decryptRemotely(pgpMessage) {
  return new Promise(function(resolve, reject) {
    function getMessage(msgEvent) {
      console.log('get message bakc', msgEvent);
      if (msgEvent.name == "decryptedMessage") {
        var res = JSON.parse(msgEvent.message);
        if (res.error)
          reject(res.error);
        else
          resolve(res.plaintext)
      }
    }

    ipc.on('decrypt-result', function(event, result) {
      if (result.error) {
        reject(result.error);
      } else {
        resolve(result.plaintext)
      }
    });

    ipc.sendToHost('decrypt-request', pgpMessage);
  });
}
