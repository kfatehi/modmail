"use strict";
const mods = require('./src/mods');
const config = require('./src/config');
const preload = "src/core/injection/index.js";
window.$ = require('jquery');

let embeds = [];

function init() {
  config.accounts.forEach(function(account) {
    embeds.push({
      label: account.label,
      tab: createTab(account.label),
      webview: createWebview(account.label)
    });
  })
  setTimeout(function() {
    switchTo(config.accounts[0].label);
  }, 0);
}

// TODO reveal/hide tab
function switchTo(label) {
  // highlight the tab
  $('.tab').removeClass('active');
  $(`.tab#tab-${label}`).addClass('active');
  // surface the webview
  $('.gmail').removeClass('active');
  let webview = $(`.gmail#gmail-${label}`).addClass('active').get(0);
  // set title to that of surfaced webview
  $('title').text(webview.getTitle());
}

window.switchTo = switchTo

// TODO create tab
function createTab(label) {
  let tab = $('<div>')
  tab.attr('id', `tab-${label}`)
  tab.addClass('tab')
  tab.text(label);
  $('.tabs').append(tab);
  tab.click(function() {
    switchTo(label);
  });
  return tab;
}

function createWebview(label) {
  let id = `gmail-${label}`;
  let src = "https://mail.google.com";
  let attrs = `class="gmail" id="${id}" src="${src}" preload="${preload}"`;
  let html = `<webview ${attrs}></webview>`;

  $('.webviews').append(html);
  let webview = document.getElementById(id)

  webview.addEventListener('page-title-updated', function(e) {
    $('title').text(e.title);
  });

  webview.addEventListener("dom-ready", function() {
    //webview.openDevTools();

    // initialize the embedder component of each module
    mods.requireEmbedder('gpg').init(webview);

    // then send the init signal
    webview.send('init');
  });

  return webview;
}

init();
