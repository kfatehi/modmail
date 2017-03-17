"use strict";

const packager = require('electron-packager')
const pkg = require('../package');

packager({
  name: 'Modmail',
  electronVersion: pkg.dependencies.electron,
  arch: 'x64',
  dir: __dirname+'/../',
  platform: require('os').platform(),
  icon: __dirname+'/../images/logo',
  ignore: /scripts|out/,
  overwrite: true,
  prune: true,
  out: __dirname+'/../out',
  appCopyright: 'Keyvan Fatehi, 2016',
  appVersion: pkg.version,
  buildVersion: pkg.version,
}, (err, paths) => {
  if (err) throw err;
  console.log(paths);
})
