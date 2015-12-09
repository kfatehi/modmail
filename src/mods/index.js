'use strict';
module.exports.requireMain = function(name) {
  return require(`${__dirname}/${name}/main-process`)
}

module.exports.requireEmbedder = function(name) {
  return require(`${__dirname}/${name}/embedder`)
}

module.exports.requireInjection = function(name) {
  return require(`${__dirname}/${name}/injection`)
}
