"use strict";
const fs = require('fs');

module.exports.init = (api) => {
  api.addStylesheetFromFile(`${__dirname}/stylesheet.css`);
}
