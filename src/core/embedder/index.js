"use strict";
const mods = require('./src/mods');
const preload = "src/core/injection/index.js";
const electron = require('electron');
const shell = electron.shell;
const ipcRenderer = electron.ipcRenderer;
const config = require('./src/config').load();
window.$ = require('jquery');

function init(config) {
  config.accounts.forEach(function(account) {
    let tab = createTab(account);

    let webview = createWebview(account).get(0);

    $('.tabs').append(tab);

    tab.click(function() {  switchTo(account) });

    $('.webviews').append(webview);
    webview.addEventListener('page-title-updated', (e) => {
      $('title').text(e.title);
    });

    webview.addEventListener("dom-ready", () => {

      mods.initializeModComponents('embedder', [account, webview])

      // then send the init signal
      webview.send('init-injection', account);
    });

    webview.addEventListener('new-window', function(e) {
      shell.openExternal(e.url);
    });

  })

  if (config.accounts.length > 1) {
    setTimeout(function() {
      switchTo(config.accounts[0]);
    }, 0);
  }

  ipcRenderer.on('toggle-webview-inspector', toggleWebviewDevTools)
}

function switchTo(account) {
  // highlight the tab
  $('.tab').removeClass('active');
  $(`.tab#tab-${account.id}`).addClass('active');
  // surface the webview
  $('.gmail').removeClass('active');
  let webview = $(`.gmail#gmail-${account.id}`).addClass('active').get(0);
  // set title to that of surfaced webview
  $('title').text(webview.getTitle());
}

function createTab(account) {
  let label = $('<span>').addClass('label').text(account.label);
  let tab = $('<div>')
  .attr('id', `tab-${account.id}`)
  .addClass('tab')
  .append(label)
  return tab;
}

function createWebview(account) {
  let webview = $('<webview>')
  .addClass('gmail')
  .attr('id', `gmail-${account.id}`)
  .attr('src', "https://mail.google.com")
  .attr('preload', preload)
  .attr('partition', `persist:${account.id}`)
  return webview;
}

function toggleWebviewDevTools() {
  $('webview.gmail').each((i, el) => {
    if ($(el).hasClass('active')) {
      if (el.isDevToolsOpened()) {
        el.closeDevTools()
      } else {
        el.openDevTools()
      }
    } else {
      if (el.isDevToolsOpened()) {
        el.closeDevTools();
        return false;
      }
    }
  });
}

init(config);
