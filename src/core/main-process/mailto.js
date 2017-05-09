const querystring = require('querystring');
const url = require('url');

let objectKeysToLowerCase = function (origObj) {
  return Object.keys(origObj).reduce(function (newObj, key) {
    let val = origObj[key];
    let newVal = (typeof val === 'object') ? objectKeysToLowerCase(val) : val;
    newObj[key.toLowerCase()] = newVal;
    return newObj;
  }, {});
}

let parseMailto = (href) => {
  let mailto = url.parse(href);
  let query = objectKeysToLowerCase(querystring.parse(mailto.query));
  let to = `${mailto.auth}@${mailto.host}`
  let subject = query.subject || '';
  let body = query.body || '';
  return { to, subject, body };
}

module.exports = {
  parse: parseMailto
}
