'use strict';
const ipc = require('electron').ipcRenderer
const mods = require('../../mods')

ipc.on('init-injection', function(event, account) {
  window.$ = require('jquery');
  window.gmail = require('./gmail')(window.$)

  let tools = {
    // react to dom events
    mutations: initMutationTool(),

    // manipulate styles
    stylesheet: initStyleTool(),
  }

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

