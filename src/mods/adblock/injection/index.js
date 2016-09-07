"use strict";
const fs = require('fs');

module.exports.init = (api) => {
  fs.readFile(`${__dirname}/stylesheet.css`, function(err, buf) {
    if ( err ) return console.error(err);
    const css = buf.toString();
    $('body').append(`<style type="text/css" media="all">${css}</style>`);
  });
}
