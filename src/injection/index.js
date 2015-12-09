var _ = require('lodash');
var pgp = require('./pgp-remote');
var Promise = require('bluebird');
var bodyParser = require('./body-parser');
var ipc = require('electron').ipcRenderer;

function init() {
  window.$ = require('jquery');
  window.gmail = require('./gmail')(window.$)

  // XXX maybe there is a better way than using setInterval....
  setInterval(function() {
    gmail.dom.messageContainers().each(function(i, el) {
      var container = $(el);
      // is this marked? if so we ignore it
      if (container.data('electron') === 'ignore') return false;
      // add decrypt button if it looks like pgp content
      addButtonToContainer(container)
      // mark it so we dont mess with it again
      container.data('electron', 'ignore');
    })
  }, 2000);
}

// message body 
// $('.adP.adO')
//
// message container
// $('.G2.G3')
//
//

ipc.on('init', init);

function addButtonToContainer(container) {
  gmail.tools.addButtonToContainer(container, "Decrypt", function() {
    var email = gmail.dom.extractMessageFromContainer(container)
    var cryptoBlocks = getCryptoBlocks(email);
    if (cryptoBlocks) {
      decrypt(cryptoBlocks, email);
    } else {
      showModal('No Ciphertext', 'There is nothing to decrypt right now.');
    }
  });
}

function getCryptoBlocks(emailElement) {
  var data = emailElement.text()
  var pgpBlocks = bodyParser.extractPGP(data)
  return pgpBlocks.length > 0 ? pgpBlocks : null
}

function decrypt(pgpBlocks, emailElement) {
  return Promise.map(pgpBlocks, function(pgpMessage, idx) {
    return pgp.decrypt(pgpMessage).catch(function(err) {
      console.log(err);
      showModal('Cannot decrypt!', 'Either you do not have the key, or your passphrase is wrong, or the message is corrupt.');
    });
  }).then(function(plaintexts) {
    var plaintexts = plaintexts.join('\n---\n')
    emailElement.empty()
    _.each(plaintexts, function(plaintext) {
      var html = plaintext.split('\n').join('<br>')
      emailElement.append(html);
    });
  });
}

function showModal(title, body) {
  gmail.tools.add_modal_window(title, body)
}
