'use strict';
module.exports.requireMain = function(mod) {
  return require(`${modPath(mod)}/main-process`)
}

module.exports.requireEmbedder = function(mod) {
  return require(`${modPath(mod)}/embedder`)
}

module.exports.requireInjection = function(mod) {
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
