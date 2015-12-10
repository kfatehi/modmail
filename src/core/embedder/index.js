"use strict";
let mods = require('./src/mods');
let config = require('./src/config');

let embeds = [];

function init() {
  config.accounts.forEach(function(account) {
    console.log(account);
    embeds.push({
      label: account.label,
      tab: createTab(account.label),
      webview: createWebview(account.label)
    });
  })
}

// TODO reveal/hide tab
function switchTo(label) {
  embeds.forEach(function(embed) {
    if (label === embed.label) {
      embed.webview.style['z-index'] = 9
    } else {
      embed.webview.style['z-index'] = 1
    }
  })
}

window.switchTo = switchTo

// TODO create tab
function createTab(label) {
  console.log('creating tab', label);
}

function createWebview(label) {
  let id = `gmail-${label}`;
  let src = "https://mail.google.com";
  let preload = "src/core/injection/index.js";
  let attrs = `id="${id}" src="${src}" preload="${preload}"`;
  let html = `<webview ${attrs}></webview>`;

  document.write(html);
  let webview = document.getElementById(id)

  webview.addEventListener('page-title-updated', function(e) {
    document.getElementsByTagName("title")[0].text = e.title
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
