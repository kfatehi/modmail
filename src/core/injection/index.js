'use strict';
const ipc = require('electron').ipcRenderer
const mods = require('../../mods')
const _ = require('lodash')

window.jQuery = require('jquery');
window.$ = window.jQuery;
window.gmail = require('./gmail')(window.$)
require('gmail-js'); // sets window.Gmail

ipc.on('init-injection', function(event, account) {

  let tools = {
    // react to dom events
    mutations: initMutationTool(),

    // manipulate styles
    stylesheet: initStyleTool(),

    // find the mod config
    getModConfig: function(id) {
      return _.find(account.mods, { id: id }).config
    },

    gmail: window.Gmail()
  }

  // remove the old chrome notice
  tools.stylesheet.insertRule(".w-MH { display: none !important; }", 0);

  mods.initializeModComponents('injection', [account, tools]);
});

function initMutationTool() {
  let handlers = [];

  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  let observer = new MutationObserver(function(mutations) {
    handlers.forEach(function(handler) {
      mutations.forEach(function(mutation) {
        handler(mutation);
      });
    })
  })

  let config = {
    subtree: true,
    attributes: false,
    childList: true
  }

  observer.observe(document, config)

  return {
    listen: function(fn) {
      handlers.push(fn)
    }
  }
}

function initStyleTool() {
  // Create the <style> tag
  var style = document.createElement("style");

  // Add a media (and/or media query) here if you'd like!
  // style.setAttribute("media", "screen")
  // style.setAttribute("media", "only screen and (max-width : 1024px)")

  // WebKit hack :(
  style.appendChild(document.createTextNode(""));

  // Add the <style> element to the page
  document.head.appendChild(style);

  return style.sheet;
}

