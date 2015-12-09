var _ = require('lodash');
var pgp = require('./pgp-remote');
var Promise = require('bluebird');
var bodyParser = require('./body-parser');

// $ and gmail will be properties of window by the time this is called
module.exports.init = function() {
  // XXX maybe there is a better way than using setInterval....
  setInterval(function() {
    gmail.dom.messageContainers().each(function(i, el) {
      var container = $(el);
      // is this marked? if so we ignore it
      if (container.data('electron') !== 'marked') {
        // we want to add decrypt button if it looks like pgp content
        // this serves the dual purpose of filtering out message containers that are collapsed
        // so that we don't accidentally mark them before actually placing a button
        // if it is collapsed, we will get an empty jQuery array from extractMessageFromContainer

        var bodyElement = gmail.dom.extractMessageFromContainer(container)
        if (bodyElement.length === 1) {
          var cryptoBlocks = getCryptoBlocks(bodyElement.text());
          if (cryptoBlocks.length > 0) {
            var decryptButton = addDecryptButtonToContainer(container, function() {
              decrypt(cryptoBlocks).then(function(plaintexts) {
                var plaintexts = plaintexts.join('\n---\n')
                bodyElement.empty()
                _.each(plaintexts, function(plaintext) {
                  var html = plaintext.split('\n').join('<br>')
                  bodyElement.append(html);
                });
                decryptButton.remove();
              }).catch(function(err) {
                showModal('Cannot decrypt!', 'Either you do not have the key, or your passphrase is wrong, or the message is corrupt.');
              });
            })
          }
          // mark it so we dont mess with it again
          container.data('electron', 'marked');
        }
      }
    })
  }, 2000);
}

function addDecryptButtonToContainer(container, callback) {
  return gmail.tools.addButtonToContainer(container, "Decrypt", callback);
}

function getCryptoBlocks(emailBody) {
  return bodyParser.extractPGP(emailBody)
}

function decrypt(pgpBlocks) {
  return Promise.map(pgpBlocks, function(pgpMessage, idx) {
    return pgp.decrypt(pgpMessage)
  })
}

function showModal(title, body) {
  gmail.tools.add_modal_window(title, body)
}
