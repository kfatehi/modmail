"use strict";

const platform = require('os').platform()
var file_system = require('fs');
var archiver = require('archiver');

var name = 'Modmail-'+platform+'-x64.zip'

var outpath = __dirname+"/../out/"+name;

var output = file_system.createWriteStream(outpath);
var archive = archiver('zip');

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err){
  throw err;
});

archive.pipe(output);
archive.bulk([{
  expand: true,
  cwd: __dirname+'/../out',
  src: ['Modmail-'+platform+'-x64/**'],
}]);
archive.finalize();
