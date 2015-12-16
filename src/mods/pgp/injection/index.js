var _ = require('lodash');
var pgp = require('./pgp-remote');
var Promise = require('bluebird');
var bodyParser = require('./body-parser');

// $ and gmail will be properties of window by the time this is called
module.exports.init = function(api) {
  api.mutations.listen(function(mutation) {
    if (mutation.type === 'childList') {
      if (isComposerMenu(mutation)) {
        addEncryptorToComposerMenu(mutation.target)
      } else if (isMessageMenu(mutation)) {
        addDecryptorToMessageContainer(mutation.target)
      }
    }
  })
}

function isComposerMenu(mutation) {
  return mutation.target.className === "SK AX"
}

function isMessageMenu(mutation) {
  return mutation.target.className === "b7 J-M"
}

function addEncryptorToComposerMenu(menuNode) {
  var menu = $(menuNode)
  if (! menu.data('modmail-mark')) {
    menu.data('modmail-mark', true)
    gmail.tools.add_menu_button(menuNode, 'Encrypt', function onClick() {
      var editable = menu.parent().parent().find('.editable')
      var email = htmlToTextWithNewlines(editable.html())
      showModal('Encrypt Message', [
        '<label>PGP Recipient</label><input type="text" id="pgp-recipient"/>',
        '<div>Clicking OK will replace your email content with the PGP encrypted version</div>'
      ].join('\n'), function ok() {
        var modal = this;
        var recipient = $('#pgp-recipient').val().trim();
        pgp.encrypt(recipient, email).then(function(val) {
          editable.html(val.replace(/\n/g,'<br>'))
          modal.remove();
        }).catch(function(err) {
          alert(err);
        });
      })
    })
  }
}

function addDecryptorToMessageContainer(menuNode) {
  var menu = $(menuNode);
  if (! menu.data('modmail-mark')) {
    menu.data('modmail-mark', true)
    console.log('added decrypt btn');
    var decryptButton = gmail.tools.add_menu_button(menuNode, 'Decrypt', function onClick() {
      // this menu actually is shared/changed/moved for all messages
      // so to get this actual messgae, we need to find the "more" button
      // that opens it. the attributes make it simple to locate...
      var moreBtn = $('[aria-label=More][aria-expanded=true]')
      var bodyElement = moreBtn.parents('.adn.ads').find('.adP.adO > div')
      decryptAndReplaceMessageBody(bodyElement, function() {
        moreBtn.blur();
      })
    })
  }
}

function decryptAndReplaceMessageBody(bodyElement, done) {
  var cryptoBlocks = bodyParser.extractPGP(bodyElement.text());
  if (cryptoBlocks.length) {
    decrypt(cryptoBlocks).then(function(plaintexts) {
      var plaintexts = plaintexts.join('\n---\n')
      bodyElement.empty()
      _.each(plaintexts, function(plaintext) {
        var html = plaintext.split('\n').join('<br>')
        bodyElement.append(html);
      });
    }).catch(function(err) {
      showModal('Decryption Failed', 'Either you do not have the key, or your passphrase is wrong, or the message is corrupt.');
    }).finally(done)
  } else done()
}

function decrypt(pgpBlocks) {
  return Promise.map(pgpBlocks, function(pgpMessage, idx) {
    return pgp.decrypt(pgpMessage)
  })
}

function showModal(title, body, ok) {
  gmail.tools.add_modal_window(title, body, ok)
}

function htmlToTextWithNewlines(html) {
  return html.replace(/<\/div>|<br>/ig, '\n').replace(/<div>/ig, '')
}
