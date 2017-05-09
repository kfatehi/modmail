"use strict";
const mods = require('./src/mods');
const preload = "src/core/injection/index.js";
const electron = require('electron');
const shell = electron.shell;
const ipcRenderer = electron.ipcRenderer;
const configModule = require('./src/config');
const loadConfig = configModule.load;
const configPath = configModule.path;
const fs = require('fs');
const path = require('path');
const marked = require('marked');

window.$ = require('jquery');

function init() {
  let config = loadConfig();

  ipcRenderer.on('toggle-webview-inspector', toggleWebviewDevTools)

  let newUserDiv = $('#new-user')
  newUserDiv.hide();
  
  if (config.accounts.length > 0) {
    initAccountsAndTabs(config)
  } else {

    $('.tabs').hide();
    $('.webviews').hide();
    newUserDiv.find('#config-path').text(configPath);
    let readme = $(marked(fs.readFileSync(path.join('README.md')).toString()));
    readme.find('img').remove();
    readme.find('a').attr('target', 'blank');
    newUserDiv.find('#readme').append(readme);
    newUserDiv.show();
  }

  if (config.mailto) {
    ipcRenderer.on('open-mailto-link', (event, data) => {
      const target = $(`webview#${config.mailto}`).get(0)
      target.send('open-mailto-link', data);
    });
  }

  ipcRenderer.on('previous-tab', () => {
    switchTo(config.accounts[activeTabIndex()-1]);
  });
  ipcRenderer.on('next-tab', () => {
    switchTo(config.accounts[activeTabIndex()+1]);
  });
}

function initAccountsAndTabs(config) {
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

    setTimeout(()=> switchTo(config.accounts[0]), 0);
  })

}

function activeTabIndex() {
  return $('.tab').toArray().findIndex(t=>$(t).hasClass('active'));
}

function switchTo(account) {
  if (!account) return;
  // highlight the tab
  $('.tab').removeClass('active');
  $(`.tab#tab-${account.id}`).addClass('active');
  // surface the webview
  $('.viewport').removeClass('active');
  let webview = $(`.viewport#${account.id}`).addClass('active').get(0);
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
  let app = account.app || "mail";
  let url = account.url || `https://${app}.google.com`;
  let webview = $('<webview>')
  .addClass('viewport')
  .attr('id', account.id)
  .attr('src', url)
  .attr('preload', preload)
  .attr('partition', `persist:${account.id}`)
  return webview;
}

function toggleWebviewDevTools() {
  $('webview.viewport').each((i, el) => {
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

init();
