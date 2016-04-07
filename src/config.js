"use strict";
module.exports = {
  load: function() {
    try {
      return require(`${process.env.HOME || process.env.USERPROFILE}/.modmail.config.js`);
    } catch (e) {
      return { accounts: [] }
    }
  }
}
