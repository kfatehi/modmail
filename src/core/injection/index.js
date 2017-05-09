'use strict';
const ipc = require('electron').ipcRenderer
const mods = require('../../mods')
const _ = require('lodash')
const fs = require('fs');

ipc.on('init-injection', function(event, account) {
  window.$ = require('jquery');
  window.gmail = require('./gmail')(window.$)

  let tools = {
    gmail,

    // react to dom events
    mutations: initMutationTool(),

    // manipulate styles
    stylesheet: initStyleTool(),

    // load stylesheet from file
    addStylesheetFromFile: addStylesheetFromFile,

    // find the mod config
    getModConfig: function(id) {
      return _.find(account.mods, { id: id }).config
    }
  }

  // remove the old chrome notice
  tools.stylesheet.insertRule(".w-MH { display: none !important; }", 0);

  mods.initializeModComponents('injection', [tools, account]);
});

ipc.on('open-mailto-link', function(event, data) {
  gmail.observe.on('compose', (compose, type)=>{
    gmail.observe.off('compose');
    setTimeout(()=>{
      compose.to(data.to);
      compose.subject(data.subject);
      compose.body(data.body);
    });
  });
  gmail.compose.start_compose();
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

function addStylesheetFromFile(path) {
  fs.readFile(path, function(err, buf) {
    if ( err ) return console.error(err);
    const css = buf.toString();
    $('body').append(`<style type="text/css" media="all">${css}</style>`);
  });
}

// handle action links like these by monkeypatching window.open
// https://github.com/blog/1891-view-issue-pull-request-buttons-for-gmail
window._open = window.open;
window.open = (url, target) => {
  if (url) {
    window._open(url, target);
  } else {
    return {
      document: {
        close:()=>{},
        write: (meta)=>{
          try {
            let url = $(meta).attr('content').match(/url=(.+)$/)[1];
            window._open(url, target);
          } catch (e) {

          }
        }
      }
    }
  }
};
