var _ = require('lodash');
var pgp = require('./pgp-remote');
var Promise = require('bluebird');
var bodyParser = require('./body-parser');

// $ and gmail will be properties of window by the time this is called
module.exports.init = function() {
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (
          mutation.type === 'childList' && // interested in DOM child node inserts/removals
          mutation.addedNodes.length === 1 && //&& // interested in catching the insert event
          mutation.target.className === "SK AX" // composer menu
        ) {
          console.log('mutation of copmoser menu detected');
          scanAndConfigureEncryption(mutation.target)
        }
      });    
  })

  var config = {
    subtree: true,
    attributes: true,
    childList: true
  }

  observer.observe(document, config)

  // scanAndConfigureDecryption(el)
}

function scanAndConfigureEncryption(menuNode) {
  var menu = $(menuNode)
  if (menu.find('.decryptButton').length < 1) {
    var encryptButton = $('<div class="decryptButton J-N J-Ks" id=":qq" role="menuitemcheckbox" aria-checked="false" style="-webkit-user-select: none;"><div class="J-N-Jz" style="-webkit-user-select: none;"><div class="J-N-Jo" style="-webkit-user-select: none;"></div>Encrypt Message ...</div></div>');

    // move to gmail helper
    encryptButton.hover(function() {
      $(this).addClass('J-N-JT')
    }, function() {
      $(this).removeClass('J-N-JT')
    })

    encryptButton.click(function() {
      var editable = menu.parent().parent().find('.editable')
      var email = editable.html().replace(/<br>/ig, '\n');
      showModal('Encrypt Message', [
        '<label>PGP Recipient</label><input type="text" id="pgp-recipient"/>',
        '<div>Clicking OK will replace your email content with the PGP encrypted version</div>'
      ].join('\n'), function ok() {
        var modal = this;
        var recipient = $('#pgp-recipient').val().trim();
        pgp.encrypt(recipient, email).then(function(val) {
          console.log(val);
          editable.html(val.replace(/\n/g,'<br>'))
          modal.remove();
        }).catch(function(err) {
          alert(err);
        });
      })
    });

    menu.append(encryptButton)
  }
  // when hover, J-N J-T
}

function scanAndConfigureDecryption() {
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
}

function addDecryptButtonToContainer(container, callback) {
  return gmail.tools.addButtonToContainer(container, "Decrypt", callback);
}

function getCryptoBlocks(emailBody) {
  return bodyParser.extractPGP(emailBody)
}

function encrypt(recipient, plaintext) {
  return pgp.encrypt(recipient, plaintext)
}

function decrypt(pgpBlocks) {
  return Promise.map(pgpBlocks, function(pgpMessage, idx) {
    return pgp.decrypt(pgpMessage)
  })
}

function showModal(title, body, ok) {
  gmail.tools.add_modal_window(title, body, ok)
}
