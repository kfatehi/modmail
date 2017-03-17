'use strict';
const DEFAULT_EMBEDDER = require('./default-embedder');
const { genIpcPrefix, genIpcProxy } = require('./utils');

module.exports.initializeModComponents = function(type, args) {
  if (type === 'main-process') {
    initMain.apply(this, args)
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
  try {
    return require(`${modPath(mod)}/embedder`)
  } catch (e) {
    return DEFAULT_EMBEDDER;
  }
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

function initMain(config) {
  const sharedState = {};
  config.accounts.forEach((account) => {
    if (account.mods) {
      account.mods.forEach((mod) => {
        // here we load modules we want to use
        // requireMain means we are requiring the main-process component
        const prefix = genIpcPrefix(account, mod);
        const ipcProxy = genIpcProxy(prefix);
        requireMain(mod).init(prefix, mod.config, ipcProxy, config, sharedState);
        console.log(`${account.id}: ${mod.id} initialized main-process`);
      })
    }
  })
}

function initEmbedder(account, webview) {
  if (account.mods) {
    account.mods.forEach(function(mod) {
      // initialize the embedder component of each module
      let prefix = genIpcPrefix(account, mod);
      requireEmbedder(mod).init(prefix, webview);
      console.log(`${account.id}: ${mod.id} initialized embedder`);
    })
  }
}

function initInjection(account, tools) {
  if (account.mods) {
    account.mods.forEach(function(mod) {
      // now we load injection component of our modules
      requireInjection(mod).init(tools)
      console.log(`${account.id}: ${mod.id} initialized injection`);
    })
  }
}
