'use strict';
const config = require('../config');

module.exports.initializeModComponents = function(type, args) {
  if (type === 'main-process') {
    initMain()
  } else if (type === 'embedder') {
    initEmbedder.apply(this, args)
  } else if (type === 'injection') {
    initInjection.apply(this, args)
  } else throw new Error(`Unknown mod component type: ${type}`)
}

function requireMain(mod) {
  return require(`${modPath(mod)}/main-process`)
}

function requireEmbedder(mod) {
  return require(`${modPath(mod)}/embedder`)
}

function requireInjection(mod) {
  return require(`${modPath(mod)}/injection`)
}

// logic to let you load your own shit from your own place
function modPath(mod) {
  if (mod.path) {
    return mod.path
  } else {
    return `${__dirname}/${mod.id}`
  }
}

function initMain() {
  config.accounts.forEach((account) => {
    if (account.mods) {
      account.mods.forEach((mod) => {
        // here we load modules we want to use
        // requireMain means we are requiring the main-process component
        requireMain(mod).init(mod.config);
        console.log(`${account.id}: ${mod.id} initialized main-process`);
      })
    }
  })
}

function initEmbedder(account, webview) {
  if (account.mods) {
    account.mods.forEach(function(mod) {
      // initialize the embedder component of each module
      requireEmbedder(mod).init(webview);
      console.log(`${account.id}: ${mod.id} initialized embedder`);
    })
  }
}

function initInjection(account) {
  if (account.mods) {
    account.mods.forEach(function(mod) {
      // now we load injection component of our modules
      requireInjection(mod).init()
      console.log(`${account.id}: ${mod.id} initialized injection`);
    })
  }
}
