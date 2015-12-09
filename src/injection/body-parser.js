var _ = require('lodash');

module.exports.extractPGP = extractPGP;

function extractPGP(ascii) {
  var lines = ascii.split('\n')
  var pgpMessages = [];

  var isPGP = false;
  var pgpMsg = []

  _.each(lines, function(line) {
    if (line.trim() === '-----BEGIN PGP MESSAGE-----') {
      isPGP = true;
      pgpMsg.push(line.trim());
    } else if (isPGP) {
      if (line.trim() === '-----END PGP MESSAGE-----') {
        pgpMsg.push(line.trim());
        pgpMessages.push(pgpMsg.join('\n'));
        isPGP = false;
        pgpMsg = [];
      } else {
        pgpMsg.push(line.trim());
      }
    }
  });

  return pgpMessages;
}
