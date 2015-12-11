"use strict";
const _ = require('lodash');
const data = require(`${process.env.HOME || process.env.USERPROFILE}/.modmail.config.js`);
module.exports = data;
