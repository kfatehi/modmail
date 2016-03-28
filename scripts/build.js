"use strict";

const packager = require('electron-packager')
const pkg = require('../package').version

packager({
  name: 'Modmail',
  version: '0.37.2', // electron version
  arch: 'x64',
  dir: __dirname+'/../',
  platform: require('os').platform(),
  icon: __dirname+'/../images/logo',
  ignore: /scripts/,
  overwrite: true,
  prune: true,
  out: __dirname+'/../out',
  'app-copyright': 'Keyvan Fatehi, 2016',
  'app-version': pkg.version,
  'build-version': pkg.version,
}, (err, paths) => {
  if (err) throw err;
  console.log(paths);
})
