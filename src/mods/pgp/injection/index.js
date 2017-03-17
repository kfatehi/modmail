"use strict";
var _ = require('lodash');
var pgp = require('./pgp-remote');
var Promise = require('bluebird');
var bodyParser = require('./body-parser');

// $ and gmail will be properties of window by the time this is called
module.exports.init = function(api) {
  api.mutations.listen(function(mutation) {
    if (mutation.type === 'childList') {
      if (isComposer(mutation)) {
        addSafeInputToComposerMenu(mutation.target)
      } else if (isMessageMenu(mutation)) {
        addDecryptorToMessageContainer(mutation.target)
      }
    }
  })
}

function isComposer(mutation) {
  return mutation.target.className.match(/editable/)
}

function isComposerMenu(mutation) {
  return mutation.target.className === "SK AX"
}

function isMessageMenu(mutation) {
  return mutation.target.className === "b7 J-M"
}

function getRecipients() {
  return gmail.dom.get_composer_recipients().join("\n")
}

function addSafeInputToComposerMenu(editorNode) {
  var unsafeEditor = $(editorNode)
  if (! unsafeEditor.data('modmail-mark')) {
    unsafeEditor.data('modmail-mark', true)

    var useUnsafe = $('<button></button>')
    .addClass('modmail-useunsafecomposer')
    .text('Open Encrypting Composer')
    .click(function() {
      launchEncryptingComposer(unsafeEditor)
    }).css({
      'position':'absolute',
      'top': 0
    })

    unsafeEditor.css({
      'padding-top': '25px' // so the text doesnt get covered by button
    }).parent().append( useUnsafe )
  } 
}

function launchEncryptingComposer(editable) {
  let modalTitle = 'Encrypt Message'
  let modalBody = `
  <label>PGP Recipients (one on each line):</label>
  <textarea style="display:block;width:100%;min-height:25px;" id="pgp-recipient">${getRecipients()}</textarea>
  <label>Plaintext:</label>
  <textarea style="display:block;width:100%;min-height:100px;" id="modmail-safecomposer"></textarea>
  <div>Clicking OK will replace your Gmail composer content with the encrypted version of the above which can be decrypted only by those in the recipient list.</div>`
  showModal(modalTitle, modalBody, function ok() {
    var modalContent = $('#gmailJsModalWindowContent');
    var recipients = modalContent.find('#pgp-recipient').val().trim().split('\n').map(i=>i.trim());
    var safeComposer = modalContent.find('#modmail-safecomposer')
    var email = safeComposer.val()
    pgp.encrypt(recipients, email).then(function(val) {
      editable.html(val.replace(/\n/g,'<br>'))
      gmail.tools.remove_modal_window();
    }).catch(function(err) {
      alert(err);
    });
  })
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
