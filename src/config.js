"use strict";
const searchPath = `${process.env.HOME || process.env.USERPROFILE}/.modmail.config.js`

module.exports = {
  path: searchPath,
  load: function() {
    try {
      return require(searchPath);
    } catch (e) {
      console.log(e);
      return { accounts: [] }
    }
  }
}
